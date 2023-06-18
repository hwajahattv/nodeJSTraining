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

/* GET home page. */
router.get("/", function (req, res, next) {
    res.render("index", { title: "Express" });
});

router.post("/register", async function (req, res, next) {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        });

        await user.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({
            masla: error,
        });
    }
});

router.post("/login", async function (req, res, next) {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const result = await bcrypt.compare(req.body.password, user.password);

        if (!result) {
            return res.status(401).json({ error: "Invalid password" });
        }

        const token = jwt.sign({ id: user._id }, "your_secret_key");
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: "Error finding user in database" });
    }
});

router.get("/protected", authenticateToken, function (req, res, next) {
    res.send("This is a protected route");
});

function authenticateToken(req, res, next) {
    const token = req.headers["authorization"];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, "your_secret_key", (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

module.exports = router;
