const Order = require("../models/Order");
const User = require("../models/User");
const WalletTransaction = require("../models/WalletTransaction");

const releaseEscrowFunds = async () => {
  try {
    // Calculate the threshold (24 hours ago)
    // Note: Change 24 to 0.05 (3 minutes) if you want to test it locally faster!
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Find all completed orders that are past the 24h window and haven't been cleared
    const pendingOrders = await Order.find({
      status: "completed",
      isEscrowCleared: false,
      createdAt: { $lte: twentyFourHoursAgo }
    }).populate("coupon");

    for (const order of pendingOrders) {
      const earnings = Math.floor(order.amountPaid * 0.9);

      const updatedUser = await User.findByIdAndUpdate(
        order.seller,
        { $inc: { walletBalance: earnings, totalSales: 1, totalEarned: earnings } },
        { new: true }
      );

      if (WalletTransaction && updatedUser) {
        await WalletTransaction.create({
          user: order.seller,
          amount: earnings,
          type: "credit",
          description: `Escrow released for ${order.coupon?.brand || 'Coupon'} sale`,
          reference: order._id.toString(),
          balanceAfter: updatedUser.walletBalance
        });
      }

      // Mark order as successfully cleared
      order.isEscrowCleared = true;
      await order.save();
    }
  } catch (err) {
    console.error("Escrow Service Error:", err);
  }
};

// Run the check every 5 minutes
setInterval(releaseEscrowFunds, 5 * 60 * 1000);

module.exports = { releaseEscrowFunds };