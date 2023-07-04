const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// Order Management (User)

router.post("/", (req, res) => {
    // Place an order using the products in the user's cart
});

router.get("/:orderId", (req, res) => {
    // Get details of a specific order
});

router.get("/", (req, res) => {
    // Get a list of all orders placed by the user
});

router.post("/:orderId/confirm", (req, res) => {
    // Confirm an order and send an email to the user
});

function authenticateToken(req, res, next) {
    const token = req.headers["authorization"];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, "secret", (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

module.exports = router;
