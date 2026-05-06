const { body, param, query } = require("express-validator");
const { validationResult } = require("express-validator");

/* ─── Run and collect validation errors ─── */
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      error: "Validation failed",
      details: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

/* ─── Auth ─── */
exports.registerRules = [
  body("name").trim().notEmpty().withMessage("Name is required").isLength({ max: 60 }),
  body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

exports.loginRules = [
  body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

/* ─── Coupon ─── */
exports.createCouponRules = [
  body("title").trim().notEmpty().withMessage("Title is required").isLength({ max: 100 }),
  body("brand").trim().notEmpty().withMessage("Brand is required"),
  body("category").isIn(["food", "shopping", "travel", "electronics", "entertainment", "beauty", "health", "other"]).withMessage("Invalid category"),
  body("couponType").isIn(["discount_code", "gift_card", "one_time"]).withMessage("Invalid coupon type"),
  body("faceValue").isFloat({ min: 1 }).withMessage("Face value must be a positive number"),
  body("sellingPrice").isFloat({ min: 1 }).withMessage("Selling price must be a positive number").custom((val, { req }) => {
    if (Number(val) >= Number(req.body.faceValue)) {
      throw new Error("Selling price must be less than face value");
    }
    return true;
  }),
  body("couponCode").trim().notEmpty().withMessage("Coupon code is required"),
  body("expiresAt").isISO8601().withMessage("Valid expiry date is required").custom((val) => {
    if (new Date(val) <= new Date()) throw new Error("Expiry date must be in the future");
    return true;
  }),
];

/* ─── Payments ─── */
exports.createOrderRules = [
  body("couponId").isMongoId().withMessage("Valid coupon ID required"),
];

exports.verifyPaymentRules = [
  body("sessionId").notEmpty().withMessage("Stripe session ID required"),
  body("orderId").isMongoId().withMessage("Valid order ID required"),
];
