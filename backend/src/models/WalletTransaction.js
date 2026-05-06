const mongoose = require("mongoose");

const walletTxSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["credit", "debit", "withdrawal", "refund"],
      required: true,
    },
    amount:      { type: Number, required: true },
    description: { type: String, required: true },
    reference:   { type: String, default: null }, // orderId, withdrawalId
    balanceAfter:{ type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "completed",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WalletTransaction", walletTxSchema);
