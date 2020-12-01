const jwt = require("jsonwebtoken");
const User = require("../models/user");
const hash = require("../helpers/hash");

async function register(user) {
    // Hashes the password
    user.password = hash(user.password);
    // Adds token
    const token = jwt.sign({ sub: user.id }, config.jwt.secretKey, { expiresIn: '7d' });
    user.save();
    return { ...user.toJSON(), token }
}
async function login(credentials) {
    const usernameOrEmail = credentials.usernameOrEmail;
    const password = hash(credentials.password);
    // Find user with the same email and password
    const user = await User.findOne({ "usernameOrEmail": usernameOrEmail, "password": password }).exec();
    if (user) {
        const token = jwt.sign({ sub: user.id }, config.jwt.secretKey, { expiresIn: '7d' });
        if (user.isAdmin) {
            // If the user is admin, add token2
            const token2 = jwt.sign({ user }, config.jwt.adminSecretKey, { expiresIn: "7d" });
            return {
                ...user.toJSON(), token, token2
            };
        }
        return {
            ...user.toJSON(), token
        };
    }
    return user;
}

async function getUserAddress(userId) {
    // Gets the city and street of the user
    const user = User.findOne({ "_id": userId }, { city: 1, street: 1 }).exec();
    return user;
}
async function getFirstname(userId) {
    // Gets the first name of the user
    const user = User.findOne({ "_id": userId }, { _id: 0, firstName: 1 }).exec();
    return user;
}
async function checkIdentityExistence(identityNumber) {
    const identity = User.findOne({ "identity": identityNumber });
    return identity;
}

module.exports = {
    login,
    register,
    getUserAddress,
    getFirstname,
    checkIdentityExistence
}