const mongoose = require("mongoose");

const CartProductSchema = new mongoose.Schema({
    productId: String,
    units: Number,
    calculatedPrice: Number,
    cartId: String,
},
    {
        versionKey: false,
        toJSON: { virtuals: true }, // Allow to get a category for each product
        id: false //  Don't add additional id.
    });

// CartProductSchema.virtual("product", {
//     ref: "Product", // Category model.
//     localField: "productName", // FK
//     foreignField: "productName", // PK
//     // justOne: true // Each product has just one category (prevent array creation)
// })

const CartProduct = mongoose.model("CartProducts", CartProductSchema, "cartProducts");
module.exports = CartProduct;