const express = require("express");
const authLogic = require("../business-logic/auth-logic");
const router = express.Router();
const verifyLoggedIn = require("../middleware/verify-logged-in");
const User = require("../models/user");
const isAdmin = require("../middleware/is-admin");
router.post("/register", async (request, response) => {
    try {

        const user = new User(request.body);
        // On register the user isAdmin property automatically will be set to false
        user.isAdmin = false;
        const addedUser = await authLogic.register(user);
        request.session.user = addedUser;
        response.status(201).json(addedUser);
    }
    catch (err) {
        if (err.errors) {
            response.status(400).send("Invalid input");
            return;
        }

        response.status(500).send(err.message);
    }
})

router.post("/login", async (request, response) => {
    try {
        const credentials = request.body;
        const user = await authLogic.login(credentials);
        if (!user) {
            response.status(400).send("Illegal username or password");
            return;
        }
        request.session.user = user;
        response.json(user);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
})
router.get("/get-user-address/:userId", async (request, response) => {
    try {
        const userId = request.params.userId;
        const address = await authLogic.getUserAddress(userId);
        response.json(address);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
})
router.get("/get-firstname/:userId", async (request, response) => {
    try {
        const userId = request.params.userId;
        const firstNameObj = await authLogic.getFirstname(userId);
        // Sends the first name property
        response.send(firstNameObj.firstName);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
})

router.post("/logout", (request, response) => {
    try {
        // Destories the session
        request.session.destroy();
        response.end();
    }
    catch (err) {
        response.status(500).send(err.message);
    }

})

router.post("/is-admin/", isAdmin, async (request, response) => { // Add Middleware
    try {
        // if successful means the token is valid and the user is admin.
        response.end();
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});
router.post("/is-logged-in", verifyLoggedIn, async (request, response) => {
    try {
        // if successful means the token is valid and the user is logged in.
        response.end();
    }
    catch (err) {
        response.status(500).send(err.message);
    }
})
router.post("/check-identity-existence/:identityNumber", async (request, response) => {
    try {
        const identityNumber = request.params.identityNumber;
        const identityExistence = await authLogic.checkIdentityExistence(identityNumber);
        response.send(identityExistence);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
})
module.exports = router;
