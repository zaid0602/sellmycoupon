const User   = require("../models/User");
const WalletTransaction = require("../models/WalletTransaction");

/* ─── GET /api/wallet ─── */
exports.getBalance = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("walletBalance totalEarned");
    res.json({ success: true, balance: user.walletBalance, totalEarned: user.totalEarned });
  } catch (err) {
    next(err);
  }
};

/* ─── GET /api/wallet/transactions ─── */
exports.getTransactions = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip  = (Number(page) - 1) * Number(limit);
    const total = await WalletTransaction.countDocuments({ user: req.user.id });

    const txns = await WalletTransaction.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({ success: true, count: txns.length, total, pages: Math.ceil(total / limit), data: txns });
  } catch (err) {
    next(err);
  }
};

/* ─── POST /api/wallet/withdraw ─── */
exports.requestWithdrawal = async (req, res, next) => {
  try {
    const { amount, bankDetails } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, error: "Invalid withdrawal amount" });
    }
    if (!bankDetails) {
      return res.status(400).json({ success: false, error: "Bank details are required" });
    }

    const user = await User.findById(req.user.id);
    if (user.walletBalance < amount) {
      return res.status(400).json({ success: false, error: `Insufficient balance. Available: ₹${user.walletBalance}` });
    }
    const MIN_WITHDRAWAL = 100;
    if (amount < MIN_WITHDRAWAL) {
      return res.status(400).json({ success: false, error: `Minimum withdrawal is ₹${MIN_WITHDRAWAL}` });
    }

    /* Deduct immediately, create pending transaction */
    user.walletBalance = +(user.walletBalance - amount).toFixed(2);
    await user.save();

    await WalletTransaction.create({
      user:         user._id,
      type:         "withdrawal",
      amount,
      description:  `Withdrawal to ${bankDetails}`,
      reference:    `WD_${Date.now()}`,
      balanceAfter: user.walletBalance,
      status:       "pending",
    });

    res.json({
      success: true,
      message: "Withdrawal request submitted. Amount will be credited within 24 hours.",
      newBalance: user.walletBalance,
    });
  } catch (err) {
    next(err);
  }
};
