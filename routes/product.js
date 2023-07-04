// var express = require('express');
// var router = express.Router();

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Product = require("../models/product");
const Cart = require("../models/cart");
const { Category, Subcategory } = require("../models/category");

// Product Management (Admin)
router.get("/", authenticateToken, (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ error: "Access denied" });
    }
    // Get all products
    Product.find()
        .then((products) => {
            res.json(products);
        })
        .catch((error) => {
            res.status(500).json({ error: "Failed to fetch products" });
        });
});

router.get("/:productId", authenticateToken, (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ error: "Access denied" });
    }
    // Get details of a specific product
    const productId = req.params.productId;
    Product.findById(productId)
        .then((product) => {
            if (product) {
                res.json(product);
            } else {
                res.status(404).json({ error: "Product not found" });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: "Failed to fetch product" });
        });
});

router.post("/", authenticateToken, (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ error: "Access denied" });
    }
    // Create a new product
    const { title, price, quantity, category } = req.body;

    const product = new Product({
        title,
        price,
        quantity,
        category,
    });

    product
        .save()
        .then((savedProduct) => {
            res.status(201).json(savedProduct);
        })
        .catch((error) => {
            res.status(500).json({
                error: "Failed to create product",
            });
        });
});

router.put("/:productId", authenticateToken, (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ error: "Access denied" });
    }
    // Update details of a specific product
    const productId = req.params.productId;
    const { title, description, price, quantity, category } = req.body;

    Product.findByIdAndUpdate(productId, {
        title,
        description,
        price,
        quantity,
        category,
    })
        .then((updatedProduct) => {
            if (updatedProduct) {
                res.json(updatedProduct);
            } else {
                res.status(404).json({ error: "Product not found" });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: "Failed to update product" });
        });
});

router.delete("/:productId", authenticateToken, (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ error: "Access denied" });
    }
    // Delete a specific product
    const productId = req.params.productId;

    Product.findByIdAndDelete(productId)
        .then((deletedProduct) => {
            if (deletedProduct) {
                res.json({ message: "Product deleted successfully" });
            } else {
                res.status(404).json({ error: "Product not found" });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: "Failed to delete product" });
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
