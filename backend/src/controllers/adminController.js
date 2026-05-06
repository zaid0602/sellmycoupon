const User   = require("../models/User");
const Coupon = require("../models/Coupon");
const Order  = require("../models/Order");
const WalletTransaction = require("../models/WalletTransaction");

/* ─── GET /api/admin/stats ─── */
exports.getAdminStats = async (req, res, next) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      newUsers30d,
      totalCoupons,
      activeCoupons,
      totalOrders,
      paidOrders30d,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Coupon.countDocuments({}),
      Coupon.countDocuments({ status: "active" }),
      Order.countDocuments(),
      Order.countDocuments({ status: "completed", createdAt: { $gte: thirtyDaysAgo } }),
    ]);

    /* Revenue aggregation */
    const revenueAgg = await Order.aggregate([
      { $match: { status: "completed", createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: null, gross: { $sum: "$amountPaid" }, commission: { $sum: { $multiply: ["$amountPaid", 0.1] } } } },
    ]);
    const revenue = revenueAgg[0] || { gross: 0, commission: 0 };

    res.json({
      success: true,
      data: {
        users: { total: totalUsers, new30d: newUsers30d },
        coupons: { total: totalCoupons, active: activeCoupons },
        orders: { total: totalOrders, paid30d: paidOrders30d },
        revenue: {
          gross30d:      +revenue.gross.toFixed(2),
          commission30d: +revenue.commission.toFixed(2),
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

/* ─── GET /api/admin/users ─── */
exports.getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, role } = req.query;
    const filter = {};
    if (search) filter.$or = [{ name: new RegExp(search, "i") }, { email: new RegExp(search, "i") }];
    if (role) filter.role = role;

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await User.countDocuments(filter);
    const users = await User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).select("-password");

    res.json({ success: true, count: users.length, total, pages: Math.ceil(total / limit), data: users });
  } catch (err) {
    next(err);
  }
};

/* ─── PUT /api/admin/users/:id/suspend ─── */
exports.suspendUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: "User not found" });
    if (user.role === "admin") return res.status(400).json({ success: false, error: "Cannot suspend an admin" });

    user.isSuspended = !user.isSuspended;
    await user.save();

    res.json({ success: true, message: `User ${user.isSuspended ? "suspended" : "restored"} successfully`, isSuspended: user.isSuspended });
  } catch (err) {
    next(err);
  }
};

/* ─── GET /api/admin/coupons ─── */
exports.getAllCoupons = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, category } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;

    /* Bypass the pre-find hook that filters out expired/removed coupons */
    const skip  = (Number(page) - 1) * Number(limit);
    const total = await Coupon.countDocuments(filter);
    const coupons = await Coupon.find(filter)
      .populate("seller", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .select("-couponCode");

    res.json({ success: true, count: coupons.length, total, pages: Math.ceil(total / limit), data: coupons });
  } catch (err) {
    next(err);
  }
};

/* ─── PUT /api/admin/coupons/:id/approve ─── */
exports.approveCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      { isApproved: true, flaggedReason: null },
      { new: true }
    ).select("-couponCode");

    if (!coupon) return res.status(404).json({ success: false, error: "Coupon not found" });
    res.json({ success: true, data: coupon });
  } catch (err) {
    next(err);
  }
};

/* ─── PUT /api/admin/coupons/:id/featured ─── */
exports.setFeatured = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ success: false, error: "Coupon not found" });

    coupon.isFeatured = !coupon.isFeatured;
    await coupon.save();

    res.json({ success: true, isFeatured: coupon.isFeatured, message: `Coupon ${coupon.isFeatured ? "featured" : "unfeatured"}` });
  } catch (err) {
    next(err);
  }
};

/* ─── DELETE /api/admin/coupons/:id ─── */
exports.removeCoupon = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      { status: "removed", isApproved: false, flaggedReason: reason || "Removed by admin" },
      { new: true }
    );

    if (!coupon) return res.status(404).json({ success: false, error: "Coupon not found" });
    res.json({ success: true, message: "Coupon removed" });
  } catch (err) {
    next(err);
  }
};

/* ─── GET /api/admin/orders ─── */
exports.getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .populate("buyer",  "name email")
      .populate("seller", "name email")
      .populate("coupon", "title brand")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .select("-revealedCode");

    res.json({ success: true, count: orders.length, total, pages: Math.ceil(total / limit), data: orders });
  } catch (err) {
    next(err);
  }
};

/* ─── POST /api/admin/orders/:id/refund ─── */
exports.processRefund = async (req, res, next) => {
  try {
    const { reason = "Admin-initiated refund" } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ success: false, error: "Order not found" });
    if (order.status !== "completed") return res.status(400).json({ success: false, error: "Order is not in a completed state" });

    order.status       = "refunded";
    order.refundReason = reason;
    order.refundedAt   = new Date();
    order.refundId     = `admin_refund_${Date.now()}`;
    await order.save();

    /* Debit seller ONLY if the escrow was already cleared to their wallet */
    if (order.isEscrowCleared) {
      const seller = await User.findById(order.seller);
      const sellerEarns = Math.floor(order.amountPaid * 0.9);
      seller.walletBalance = Math.max(0, +(seller.walletBalance - sellerEarns).toFixed(2));
      await seller.save();

      await WalletTransaction.create({
        user: seller._id, type: "debit", amount: sellerEarns,
        description: `Admin refund: ${reason}`,
        reference: order._id.toString(), balanceAfter: seller.walletBalance,
      });
    }

    res.json({ success: true, message: "Refund processed" });
  } catch (err) {
    next(err);
  }
};

/* ─── GET /api/admin/withdrawals ─── */
exports.getPendingWithdrawals = async (req, res, next) => {
  try {
    const withdrawals = await WalletTransaction.find({ type: "withdrawal", status: "pending" })
      .populate("user", "name email walletBalance")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: withdrawals });
  } catch (err) {
    next(err);
  }
};

/* ─── PUT /api/admin/withdrawals/:id/approve ─── */
exports.approveWithdrawal = async (req, res, next) => {
  try {
    const tx = await WalletTransaction.findByIdAndUpdate(req.params.id, { status: "completed" }, { new: true });
    if (!tx) return res.status(404).json({ success: false, error: "Withdrawal not found" });
    res.json({ success: true, message: "Withdrawal approved" });
  } catch (err) {
    next(err);
  }
};

/* ─── PUT /api/admin/withdrawals/:id/reject ─── */
exports.rejectWithdrawal = async (req, res, next) => {
  try {
    const tx = await WalletTransaction.findById(req.params.id);
    if (!tx || tx.status !== "pending") return res.status(400).json({ success: false, error: "Only pending withdrawals can be rejected" });
    
    tx.status = "failed";
    await tx.save();
    await User.findByIdAndUpdate(tx.user, { $inc: { walletBalance: tx.amount } });

    res.json({ success: true, message: "Withdrawal rejected and refunded to wallet" });
  } catch (err) {
    next(err);
  }
};
