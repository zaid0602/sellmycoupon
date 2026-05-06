const User   = require("../models/User");
const Coupon = require("../models/Coupon");
const Order  = require("../models/Order");
const mongoose = require("mongoose");

/* ─── GET /api/users/:id ─── */
exports.getPublicProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select("name rating ratingCount totalSales createdAt");

    if (!user) return res.status(404).json({ success: false, error: "User not found" });

    const listings = await Coupon.find({ seller: user._id, status: "active", isApproved: true })
      .select("-couponCode").limit(6).sort({ createdAt: -1 });

    res.json({ success: true, data: { user, listings } });
  } catch (err) {
    next(err);
  }
};

/* ─── PUT /api/users/profile ─── */
exports.updateProfile = async (req, res, next) => {
  try {
    const allowed = ["name", "phone", "avatar"];
    const updates = {};
    allowed.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true });

    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

/* ─── GET /api/users/dashboard ─── */
exports.getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [activeListings, totalListings, completedSales, recentOrders] = await Promise.all([
      Coupon.countDocuments({ seller: userId, status: "active" }),
      Coupon.countDocuments({ seller: userId }),
      Order.countDocuments({ seller: userId, status: "completed" }),
      Order.find({ buyer: userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("coupon", "title brand"),
    ]);

    const user = await User.findById(userId).select("walletBalance totalEarned totalSales rating ratingCount");

    const pendingEscrow = await Order.aggregate([
      { $match: { seller: new mongoose.Types.ObjectId(userId), status: "completed", isEscrowCleared: false } },
      { $group: { _id: null, total: { $sum: "$amountPaid" } } }
    ]);
    const pendingPayouts = pendingEscrow[0] ? Math.floor(pendingEscrow[0].total * 0.9) : 0;

    res.json({
      success: true,
      data: {
        walletBalance:  user.walletBalance,
        totalEarned:    user.totalEarned,
        totalSales:     user.totalSales,
        activeListings,
        totalListings,
        completedSales,
        averageRating:  user.averageRating,
        recentPurchases: recentOrders,
        pendingPayouts,
      },
    });
  } catch (err) {
    next(err);
  }
};
