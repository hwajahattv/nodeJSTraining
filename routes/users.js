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

// User Management (Admin)
// Get a list of all users (only accessible to admins)
router.get("/", authenticateToken, (req, res) => {
    console.log(req.user.role);
    // Check if the user making the request is an admin
    if (req.user.role !== "admin") {
        return res.status(403).json({ error: "Access denied" });
    }

    User.find()
        .then((users) => {
            res.json(users);
        })
        .catch((error) => {
            res.status(500).json({ error: "Internal server error" });
        });
});

// Get details of a specific user (only accessible to admins)
router.get("/:userId", authenticateToken, (req, res) => {
    // Check if the user making the request is an admin
    if (req.user.role !== "admin") {
        return res.status(403).json({ error: "Access denied" });
    }

    const { userId } = req.params;

    User.findById(userId)
        .then((user) => {
            if (user) {
                res.json(user);
            } else {
                res.status(404).json({ error: "User not found" });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: "Internal server error" });
        });
});

// Update details of a specific user (only accessible to admins)
router.put("/:userId", authenticateToken, (req, res) => {
    // Check if the user making the request is an admin
    if (req.user.role !== "admin") {
        return res.status(403).json({ error: "Access denied" });
    }

    const { userId } = req.params;
    const updatedUser = req.body;

    User.findByIdAndUpdate(userId, updatedUser, { new: true })
        .then((user) => {
            if (user) {
                res.json(user);
            } else {
                res.status(404).json({ error: "User not found" });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: "Internal server error" });
        });
});

// Delete a specific user (only accessible to admins)
router.delete("/:userId", authenticateToken, (req, res) => {
    // Check if the user making the request is an admin
    if (req.user.role !== "admin") {
        return res.status(403).json({ error: "Access denied" });
    }

    const { userId } = req.params;

    User.findByIdAndDelete(userId)
        .then((user) => {
            if (user) {
                res.json({ message: "User deleted successfully" });
            } else {
                res.status(404).json({ error: "User not found" });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: "Internal server error" });
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
