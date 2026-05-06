const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();

const { register, login, getMe, updatePassword } = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const { registerRules, loginRules, validate } = require("../middleware/validators");

/* Stricter rate limit for auth endpoints */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 10,
  message: { success: false, error: "Too many auth attempts. Try again in 15 minutes." },
});

// POST  /api/auth/register
router.post("/register", authLimiter, registerRules, validate, register);

// POST  /api/auth/login
router.post("/login", authLimiter, loginRules, validate, login);

// GET   /api/auth/me
router.get("/me", protect, getMe);

// PUT   /api/auth/password
router.put("/password", protect, updatePassword);

module.exports = router;
