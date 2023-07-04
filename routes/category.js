const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { Category, Subcategory } = require("../models/category");

// Category Management (Admin)
router.get("/", authenticateToken, (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ error: "Access denied" });
    }
    Category.find()
        .then((categories) => {
            res.json(categories);
        })
        .catch((error) => {
            res.status(500).json({ error: "Failed to fetch categories" });
        });
});

router.get("/:categoryId", authenticateToken, (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ error: "Access denied" });
    }
    const categoryId = req.params.categoryId;

    Category.findById(categoryId)
        .then((category) => {
            if (category) {
                res.json(category);
            } else {
                res.status(404).json({ error: "Category not found" });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: "Failed to fetch category" });
        });
});

router.post("/", authenticateToken, (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ error: "Access denied" });
    }
    const { name, parent } = req.body;

    const category = new Category({
        name,
        parent,
    });

    category
        .save()
        .then((savedCategory) => {
            res.status(201).json(savedCategory);
        })
        .catch((error) => {
            res.status(500).json({ error: "Failed to create category" });
        });
});

router.put("/:categoryId", authenticateToken, (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ error: "Access denied" });
    }
    const categoryId = req.params.categoryId;
    const { name, parent } = req.body;

    Category.findByIdAndUpdate(categoryId, {
        name,
        parent,
    })
        .then((updatedCategory) => {
            if (updatedCategory) {
                res.json(updatedCategory);
            } else {
                res.status(404).json({ error: "Category not found" });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: "Failed to update category" });
        });
});

router.delete("/:categoryId", authenticateToken, (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ error: "Access denied" });
    }
    const categoryId = req.params.categoryId;

    Category.findByIdAndDelete(categoryId)
        .then((deletedCategory) => {
            if (deletedCategory) {
                res.json({
                    message: "Category deleted successfully",
                });
            } else {
                res.status(404).json({ error: "Category not found" });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: "Failed to delete category" });
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
