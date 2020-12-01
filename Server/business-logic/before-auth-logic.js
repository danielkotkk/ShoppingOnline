const Product = require("../models/product");
const Order = require("../models/order");

// Functions that execute on register/login page before user auth.
function getProductsLength() {
    return Product.find().countDocuments().exec();
}

function getOrdersLength() {
    return Order.find().countDocuments();
}

module.exports = {
    getProductsLength,
    getOrdersLength
}