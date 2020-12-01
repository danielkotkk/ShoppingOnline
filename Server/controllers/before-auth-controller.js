const beforeAuthLogic = require("../business-logic/before-auth-logic");
const express = require("express");
const router = express();

// Routes that execute on register/login page before user auth.
router.get("/products", async (request, response) => {
    try {
        const products = await beforeAuthLogic.getProductsLength();
        response.json(products);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
})

router.get("/orders", async (request, response) => {
    try {
        const orders = await beforeAuthLogic.getOrdersLength();
        response.json(orders);
    } catch (err) {
        response.status(500).send(err.message);
    }
})


module.exports = router;