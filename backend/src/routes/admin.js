const express = require("express");
const router  = express.Router();

const {
  getAdminStats,
  getAllUsers,
  suspendUser,
  getAllCoupons,
  approveCoupon,
  removeCoupon,
  getAllOrders,
  processRefund,
  setFeatured,
  getPendingWithdrawals,
  approveWithdrawal,
  rejectWithdrawal,
} = require("../controllers/adminController");

const { protect, adminOnly } = require("../middleware/auth");

/* All admin routes require login + admin role */
router.use(protect, adminOnly);

// GET  /api/admin/stats          — platform overview stats
router.get("/stats", getAdminStats);

// ── Users ──
// GET  /api/admin/users          — all users (paginated)
router.get("/users", getAllUsers);
// PUT  /api/admin/users/:id/suspend   — toggle suspend
router.put("/users/:id/suspend", suspendUser);

// ── Coupons ──
// GET  /api/admin/coupons        — all coupons incl. removed
router.get("/coupons", getAllCoupons);
// PUT  /api/admin/coupons/:id/approve  — approve a coupon
router.put("/coupons/:id/approve", approveCoupon);
// PUT  /api/admin/coupons/:id/featured — toggle featured
router.put("/coupons/:id/featured", setFeatured);
// DELETE /api/admin/coupons/:id  — hard remove
router.delete("/coupons/:id", removeCoupon);

// ── Orders ──
// GET  /api/admin/orders         — all orders
router.get("/orders", getAllOrders);
// POST /api/admin/orders/:id/refund — admin-initiated refund
router.post("/orders/:id/refund", processRefund);

// ── Withdrawals ──
// GET  /api/admin/withdrawals
router.get("/withdrawals", getPendingWithdrawals);
// PUT  /api/admin/withdrawals/:id/approve
router.put("/withdrawals/:id/approve", approveWithdrawal);
// PUT  /api/admin/withdrawals/:id/reject
router.put("/withdrawals/:id/reject", rejectWithdrawal);

module.exports = router;
