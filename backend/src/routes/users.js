const express = require("express");
const router  = express.Router();

const {
  getPublicProfile,
  updateProfile,
  getDashboardStats,
} = require("../controllers/userController");

const { protect } = require("../middleware/auth");

// GET  /api/users/dashboard    — authenticated: aggregated stats
router.get("/dashboard", protect, getDashboardStats);

// GET  /api/users/:id          — public seller profile
router.get("/:id", getPublicProfile);

// PUT  /api/users/profile      — authenticated: update own profile
router.put("/profile", protect, updateProfile);

module.exports = router;
