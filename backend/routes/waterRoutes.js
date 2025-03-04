const express = require("express");
const WaterIntake = require("../models/WaterIntake");
const jwt = require("jsonwebtoken");

const router = express.Router();

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ error: "Access Denied" });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ error: "Invalid Token" });
    }
};

router.post("/add", authMiddleware, async (req, res) => {
    const intake = new WaterIntake({ userId: req.user.userId, amount: req.body.amount });
    await intake.save();
    res.status(201).json({ message: "Water intake recorded" });
});

router.get("/history", authMiddleware, async (req, res) => {
    const history = await WaterIntake.find({ userId: req.user.userId }).sort({ date: -1 });
    res.json(history);
});

module.exports = router;
