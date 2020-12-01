const shoppingOnlineLogic = require("../business-logic/shopping-online-logic");
const express = require("express");
const router = express();
const Product = require("../models/product");
const Cart = require("../models/cart");
const CartProducts = require("../models/cart-product");
const Order = require("../models/order");

router.post("/", async (request, response) => {
    try {
        const productToAdd = new Product(request.body);
        const addedProduct = await shoppingOnlineLogic.addProductAsync(productToAdd);
        response.status(201).json(addedProduct);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
})
router.patch("/", async (request, response) => {
    try {
        const productToUpdate = new Product(request.body);
        const product = await shoppingOnlineLogic.updateProduct(productToUpdate);
        response.status(200).json(product);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
})

router.get("/get-categories", async (request, response) => {
    try {
        const categories = await shoppingOnlineLogic.getCategories();
        response.json(categories)
    } catch (err) {
        response.status(500).send(err.message);
    }
});
router.get("/get-category-by-id/:categoryId", async (request, response) => {
    try {
        const categoryId = request.params.categoryId;
        const category = await shoppingOnlineLogic.getCategoryById(categoryId);
        response.json(category)
    } catch (err) {
        response.status(500).send(err.message);
    }
});

router.get("/products-by-category/:categoryId", async (request, response) => {
    try {
        const categoryId = request.params.categoryId;
        const products = await shoppingOnlineLogic.getProductsByCategory(categoryId);
        if (!products) {
            response.sendStatus(404);
            return;
        }
        response.json(products);
    } catch (err) {
        response.status(500).send(err.message);
    }
});
router.get("/products-by-name/:productName", async (request, response) => {
    try {
        const productName = request.params.productName;
        const products = await shoppingOnlineLogic.getProductsByName(productName);
        if (!products) {
            response.sendStatus(404);
            return;
        }
        response.json(products);
    } catch (err) {
        response.status(500).send(err.message);
    }
});
router.get("/product-price/:productId", async (request, response) => {
    try {
        const productId = request.params.productId;
        const productPrice = await shoppingOnlineLogic.getProductPricePerUnit(productId);
        response.json(productPrice);
    } catch (err) {
        response.status(500).send(err.message);
    }
});
router.get("/cart/:userId", async (request, response) => {
    try {
        const userId = request.params.userId;
        const cart = await shoppingOnlineLogic.getCart(userId);
        response.json(cart);
    } catch (err) {
        response.status(500).send(err.message);
    }
});
router.delete("/cart-products/:cartProductId", async (request, response) => {
    try {
        const cartProductId = request.params.cartProductId;
        const cartProduct = await shoppingOnlineLogic.getCartProductById(cartProductId);
        const cartId = cartProduct.cartId
        await shoppingOnlineLogic.deleteCartProduct(cartProductId);
        // Sends to client side to update the cart
        socketServer.emit("updateCartProducts", await shoppingOnlineLogic.getCartProducts(cartId));
        response.sendStatus(204);
    } catch (err) {
        response.status(500).send(err.message);
    }
});
router.delete("/delete-all-cart-products/:cartId", async (request, response) => {
    try {
        const cartId = request.params.cartId;
        await shoppingOnlineLogic.deleteAllCartProducts(cartId);
        response.sendStatus(204);
    } catch (err) {
        response.status(500).send(err.message);
    }
});

router.delete("/cart/:userId", async (request, response) => {
    try {
        const userId = request.params.userId;
        // Gets the cart to delete the cart products
        const cart = await shoppingOnlineLogic.getCart(userId);
        await shoppingOnlineLogic.deleteAllCartProducts(cart._id);
        await shoppingOnlineLogic.deleteCart(userId);
        response.sendStatus(204);
    } catch (err) {
        response.status(500).send(err.message);
    }
});

router.post("/cart", async (request, response) => {
    try {
        // Date created will be set to the current time
        request.body.dateCreated = new Date().toLocaleDateString();
        const cart = new Cart(request.body);
        const newCart = await shoppingOnlineLogic.addCart(cart);
        response.json(newCart);
    } catch (err) {
        response.status(500).send(err.message);
    }
});
router.get("/cart-products/:cartId", async (request, response) => {
    try {
        const cartId = request.params.cartId;
        const cartProducts = await shoppingOnlineLogic.getCartProducts(cartId);
        response.json(cartProducts);
    } catch (err) {
        response.status(500).send(err.message);
    }
});
router.patch("/cart-products/", async (request, response) => {
    try {
        const cartProduct = request.body;
        const updatedProduct = await shoppingOnlineLogic.updateUnits(cartProduct);
        response.json(updatedProduct);
    } catch (err) {
        response.status(500).send(err.message);
    }
});
router.post("/cart-products", async (request, response) => {
    try {
        const newProduct = new CartProducts(request.body);
        const product = await shoppingOnlineLogic.addProductToCart(newProduct);
        // Sends to the client to update the cart
        socketServer.emit("updateCartProducts", await shoppingOnlineLogic.getCartProducts(request.body.cartId));
        response.json(product);
    } catch (err) {
        response.status(500).send(err.message);
    }
});
router.post("/order", async (request, response) => {
    try {
        const newOrder = new Order(request.body);
        const cartProducts = await shoppingOnlineLogic.getCartProducts(newOrder.cartId)
        const order = await shoppingOnlineLogic.addOrder(newOrder, cartProducts);
        response.json(order);
    } catch (err) {
        response.status(500).send(err.message);
    }
})
router.get("/get-receipt/:cartId", async (request, response) => {
    try {
        const path = require("path");
        const cartId = request.params.cartId;
        // Gets the receipt and send it to client to download
        response.download(path.join(__dirname, `../all-receipts/${cartId}.txt`));
    } catch (err) {
        response.status(500).send(err.message);
    }
})
router.get("/orders/last-order-date/:userId", async (request, response) => {
    try {
        const userId = request.params.userId;
        const lastOrder = await shoppingOnlineLogic.getLastOrderDate(userId);
        // Send the date
        if (lastOrder) {
            response.send(lastOrder.orderDate);
            return;
        }
        response.send(lastOrder);
    } catch (err) {
        response.status(500).send(err.message);
    }
})
module.exports = router;