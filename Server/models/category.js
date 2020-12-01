const mongoose = require("mongoose");

const CategorySchema = mongoose.Schema({
    categoryName: String
}, {
    versionKey: false
});

const Category = mongoose.model("Category", CategorySchema, "categories");

module.exports = Category;