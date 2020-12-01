const Product = require("../models/product");
const Category = require("../models/category");
const Cart = require("../models/cart");
const { models } = require("mongoose");
const CartProduct = require("../models/cart-product");
const Order = require("../models/order");
const filesHandler = require("../helpers/files-handler");

// Returns object id with the string
String.prototype.toObjectId = function () {
    const ObjectId = require('mongoose').Types.ObjectId;
    return new ObjectId(this.toString());
}

function addProductAsync(shopToAdd) {
    return shopToAdd.save();
}

// Updates the product and returning the new document instead the old one.
function updateProduct(productToUpdate) {
    return Product.findByIdAndUpdate(productToUpdate._id, productToUpdate, { "new": true });
}

function getCategories() {
    return Category.find().exec();
}

function getCategoryById(categoryId) {
    return Category.findById(categoryId).exec();
}

function getProductsByCategory(categoryId) {
    return Product.find({
        categoryId: categoryId
    }).exec();
}

function getProductsByName(productName) {
    return Product.find({
        "productName": { "$regex": productName }
    }).exec();
}

async function getCart(userId) {
    return Cart.findOne({
        "userId": userId
    }).exec();
}

async function getCartProductById(cartProductId) {
    return CartProduct.findById(cartProductId).exec();
}

async function deleteCart(userId) {
    const cart = await getCart(userId);
    await CartProduct.findByIdAndDelete(cart._id);
    return Cart.findOneAndDelete({
        "userId": userId
    }).exec();
}

async function deleteCartProduct(cartProductId) {
    CartProduct.findOneAndDelete({
        "_id": cartProductId
    }).exec();
}
async function deleteAllCartProducts(cartId) {
    // Deletes every cart product that has specific cart id
    CartProduct.deleteMany({ "cartId": cartId }).exec();
}
async function getCartProducts(cartId) {
    const newCartProducts = [];
    const cartProductsWithoutNames = await CartProduct.find({ "cartId": cartId }).exec();
    for (let cartProduct of cartProductsWithoutNames) {
        const product = await getProductsByProductId(cartProduct.productId);
        const newCartProduct = {
            "_id": cartProduct._id,
            "productId": cartProduct.productId,
            "units": cartProduct.units,
            "productName": product.productName, // Adding property of name
            "picturePath": product.picturePath, // Adding property of picture path
            "calculatedPrice": cartProduct.calculatedPrice,
            "cartId": cartProduct.cartId
        }
        newCartProducts.push(newCartProduct);
    }
    return newCartProducts;
}
async function getProductsByProductId(productId) {
    return models.Product.findById(productId);
}
function addProductToCart(productToAdd) {
    return productToAdd.save();
}
async function updateUnits(cartProduct) {
    const product = CartProduct.findByIdAndUpdate(cartProduct._id, cartProduct, { "new": true });
    return product;
}
function addCart(cart) {
    return cart.save();
}

async function addOrder(order, cartProducts) {
    // Adds the title to the text
    await filesHandler.write(`all-receipts/${order.cartId}.txt`, "Cart receipt: \r\n\r\n");
    cartProducts.forEach(async (cartProduct) => {
        const pricePerUnit = await getProductPricePerUnit(cartProduct.productId);
        // Each product text (each product on line)
        const cartInfo = `Product name: ${cartProduct.productName}, Price per unit: $${pricePerUnit}, Units: ${cartProduct.units}, Calculated price: $${cartProduct.calculatedPrice}\r\n`;
        await filesHandler.append(`all-receipts/${order.cartId}.txt`, cartInfo);
        if (cartProduct.productId === cartProducts[cartProducts.length - 1].productId) // To prevent appending the total price before all the products
            await filesHandler.append(`all-receipts/${order.cartId}.txt`, `\r\nTotal Price: $${order.totalPrice}`)
    })
    return order.save();
}
async function getProductPricePerUnit(productId) {
    const product = await Product.findOne({ _id: productId }, { _id: 0, "price": 1 }).exec(); // Returns only the price.
    return product.price; // Returns the price from the query that includes object that includes the price.
}
function getLastOrderDate(userId) {
    return Order.findOne({ "userId": userId },{ _id: 0, orderDate: 1 }).sort({ _id: -1 });
}
module.exports = {
    addProductAsync,
    updateProduct,
    getCategories,
    getCategoryById,
    getProductsByCategory,
    getProductsByName,
    getProductPricePerUnit,
    addCart,
    getCart,
    deleteCart,
    deleteCartProduct,
    deleteAllCartProducts,
    getCartProductById,
    getCartProducts,
    getProductsByProductId,
    addProductToCart,
    addOrder,
    updateUnits,
    getLastOrderDate
}