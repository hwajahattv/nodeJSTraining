const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Product = require("../models/product");
const Cart = require("../models/cart");
const { Category, Subcategory } = require("../models/category");

// Cart Management (User)
router.get("/", authenticateToken, function (req, res) {
    const userId = req.user.id; // Assuming you have implemented user authentication and obtained the user ID from the request

    Cart.findOne({ user: userId })
        .populate("products.product")
        .then((cart) => {
            if (cart) {
                res.json(cart);
            } else {
                res.status(404).json({ error: "Cart not found" });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: "Failed to fetch cart" });
        });
});

router.post("/", authenticateToken, (req, res) => {
    const userId = req.user.id; // Assuming you have implemented user authentication and obtained the user ID from the request
    const { productId, quantity } = req.body;

    Cart.findOne({ user: userId })
        .then((cart) => {
            if (cart) {
                // Cart exists, update the product quantity
                const existingProduct = cart.products.find(
                    (item) => item.product.toString() === productId
                );

                if (existingProduct) {
                    // Product already exists in the cart, update the quantity
                    existingProduct.quantity += quantity;
                } else {
                    // Product doesn't exist in the cart, add it
                    cart.products.push({ product: productId, quantity });
                }
                return cart.save();
            } else {
                // Cart doesn't exist, create a new one
                const newCart = new Cart({
                    user: userId,
                    products: [{ product: productId, quantity }],
                });
                return newCart.save();
            }
        })
        .then((savedCart) => {
            res.status(201).json(savedCart);
        })
        .catch((error) => {
            res.status(500).json({ error: "Failed to update cart" });
        });
});

router.delete("/:productId", authenticateToken, (req, res) => {
    const userId = req.user.id; // Assuming you have implemented user authentication and obtained the user ID from the request
    const productId = req.params.productId;

    Cart.findOne({ user: userId })
        .then((cart) => {
            if (cart) {
                // Cart exists, remove the product
                cart.products = cart.products.filter(
                    (item) => item.product.toString() !== productId
                );

                return cart.save();
            } else {
                res.status(404).json({ error: "Cart not found" });
            }
        })
        .then((updatedCart) => {
            res.json(updatedCart);
        })
        .catch((error) => {
            res.status(500).json({ error: "Failed to update cart" });
        });
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
