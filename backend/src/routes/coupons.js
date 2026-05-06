const express = require("express");
const router = express.Router();

const {
  getCoupons,
  getCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getMyCoupons,
  getFeaturedCoupons,
} = require("../controllers/couponController");

const { protect } = require("../middleware/auth");
const { createCouponRules, validate } = require("../middleware/validators");

// GET  /api/coupons              — public browse (filter, sort, paginate)
router.get("/", getCoupons);

// GET  /api/coupons/featured     — public homepage featured strip
router.get("/featured", getFeaturedCoupons);

// GET  /api/coupons/my           — authenticated: seller's own listings
router.get("/my", protect, getMyCoupons);

// GET  /api/coupons/:id          — public coupon detail (code never exposed)
router.get("/:id", getCoupon);

// POST /api/coupons              — authenticated: list a new coupon
router.post("/", protect, createCouponRules, validate, createCoupon);

// PUT  /api/coupons/:id          — authenticated: seller edits own coupon
router.put("/:id", protect, updateCoupon);

// DELETE /api/coupons/:id        — authenticated: seller removes own coupon
router.delete("/:id", protect, deleteCoupon);

module.exports = router;
