// var express = require('express');
// var router = express.Router();

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Product = require("../models/product");

// Stock Management (Admin)
router.put("/:productId", authenticateToken, (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ error: "Access denied" });
    }
    // Update the stock quantity of a specific product
    const { productId } = req.params; // Get the productId from the URL
    const { stockQuantity } = req.body; // Get the new stock quantity from the request body
    Product.findById(productId)
        .exec()
        .then((foundProduct) => {
            if (foundProduct) {
                const productValues = foundProduct.toObject(); // Convert the document to a plain JavaScript object
                console.log("Product values:", productValues);
                // Check if the requested quantity is available

                const result =
                    Number(productValues.quantity) + Number(stockQuantity);
                productValues.quantity = result.toString();
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
                                "Stock updated successfully:",
                                updatedDoc
                            );
                            res.json({
                                message: "Stock updated successfully:",
                                items: updatedDoc,
                            });
                        } else {
                            console.log("Object not found.");
                        }
                    })
                    .catch((error) => {
                        console.error("Error updating object:", error);
                    });
            } else {
                console.log("Product " + productValues.title + " not found.");
            }
        })
        .catch((error) => {
            console.error("Error finding product:", error);
        });
});

router.get("/protected", authenticateToken, function (req, res, next) {
    res.send("This is a protected route");
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
