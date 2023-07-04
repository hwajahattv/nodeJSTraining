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

// Checkout route
router.post("/", authenticateToken, (req, res) => {
    const userId = req.user.id;
    let msg = [];
    Cart.findOne({ user: userId }).then((cart) => {
        if (cart) {
            // Cart exists, update the product quantity
            const cartItems = cart.products;
            if (cartItems) {
                // Update the quantity of each product in the cart
                cartItems.forEach((item) => {
                    Product.findById(item.product._id)
                        .exec()
                        .then((foundProduct) => {
                            if (foundProduct) {
                                const productValues = foundProduct.toObject(); // Convert the document to a plain JavaScript object
                                // Check if the requested quantity is available
                                if (item.quantity <= productValues.quantity) {
                                    productValues.quantity -= item.quantity;
                                    // Find the document by its ID and update it with the new object values
                                    Product.findOneAndUpdate(
                                        { _id: productValues._id },
                                        productValues,
                                        {
                                            new: true,
                                        }
                                    )
                                        .then((updatedDoc) => {
                                            if (updatedDoc) {
                                                console.log(
                                                    "Object updated successfully:",
                                                    updatedDoc
                                                );
                                            } else {
                                                console.log(
                                                    "Object not found."
                                                );
                                            }
                                        })
                                        .catch((error) => {
                                            console.error(
                                                "Error updating object:",
                                                error
                                            );
                                        });
                                } else {
                                    // Return an error if the requested quantity exceeds available stock
                                    console.log(
                                        productValues.title + " low stock"
                                    );
                                }
                            } else {
                                console.log(
                                    "Product " +
                                        productValues.title +
                                        " not found."
                                );
                            }
                        })
                        .catch((error) => {
                            console.error("Error finding product:", error);
                        });
                });
                res.json({ message: msg, items: cartItems, cart: cart });
            } else {
                // Product doesn't exist in the cart
                res.status(500).json({
                    message: "Cart is empty.",
                });
            }
        }
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
