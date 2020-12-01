const mongoose = require("mongoose");

const CartSchema = mongoose.Schema({
    userId: String,
    dateCreated: Date
},
    {
        versionKey: false,
        toJSON: { virtuals: true }, // Allow to get a category for each product
        id: false
    });
const Cart = mongoose.model("Cart", CartSchema, "shoppingCarts");
module.exports = Cart;