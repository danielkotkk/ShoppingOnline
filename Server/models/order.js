const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    userId: String,
    cartId: String,
    totalPrice: Number,
    city: String,
    street: String,
    shippingDate: Date,
    orderDate: Date,
    creditCard: String
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

const Order = mongoose.model("Orders", OrderSchema, "orders");
module.exports = Order;