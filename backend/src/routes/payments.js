const express = require("express");
const router = express.Router();
const { stripeWebhook } = require("../controllers/paymentController");

// The raw body parsing is already handled globally in app.js for this specific route!
router.post("/webhook", stripeWebhook);

module.exports = router;