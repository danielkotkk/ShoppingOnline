const mongoose = require("mongoose");

// Creating User Schema:

const UserSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    identity: String,
    password: String,
    city: String,
    street: String,
    isAdmin: Boolean
},
    {
        versionKey: false, // Don't add __v to a Product object
        toJSON: { virtuals: true }, // Allow to get a category for each product
        id: false //  Don't add additional id.
    });

// Creating a model:
const User = mongoose.model("User", UserSchema, "users"); // Model name,Schema name,collection name
module.exports = User;