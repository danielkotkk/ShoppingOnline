const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    productName: String,
    categoryId: {
        type: mongoose.Schema.Types.ObjectId, // PK type.
        ref: "Category", // The model this field is pointing to.
    },
    price: Number,
    picturePath: String

},
    { versionKey: false });

// ProductSchema.virtual("category", {
//     ref: "Category", // Category model.
//     localField: "categoryId", // FK
//     foreignField: "_id", // PK
//     justOne: true // Each product has just one category (prevent array creation)
// })

const Product = mongoose.model("Product", ProductSchema, "products");

module.exports = Product;