const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      required: true,
    },
    amountPaid: {
      type: Number,
      required: true,
    },
    stripeSessionId: {
      type: String,
    },
    couponCode: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded", "disputed"],
      default: "pending",
    },
    isEscrowCleared: { type: Boolean, default: false },
    refundReason: { type: String },
    refundedAt: { type: Date },
    refundId: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);