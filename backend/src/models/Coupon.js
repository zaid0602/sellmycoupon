const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    brand: {
      type: String,
      required: [true, "Brand is required"],
      trim: true,
    },
    description: {
      type: String,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    category: {
      type: String,
      required: true,
      enum: ["food", "shopping", "travel", "electronics", "entertainment", "beauty", "health", "other"],
    },
    couponType: {
      type: String,
      required: true,
      enum: ["discount_code", "gift_card", "one_time"],
    },

    /* Pricing */
    faceValue: {
      type: Number,
      required: [true, "Face value is required"],
      min: [1, "Face value must be positive"],
    },
    sellingPrice: {
      type: Number,
      required: [true, "Selling price is required"],
      min: [1, "Selling price must be positive"],
    },

    /* The actual coupon — hidden until paid */
    couponCode: {
      type: String,
      required: [true, "Coupon code is required"],
      select: false, // NEVER sent to client unless explicitly selected
    },

    expiresAt: {
      type: Date,
      required: [true, "Expiry date is required"],
    },

    status: {
      type: String,
      enum: ["active", "sold", "expired", "removed"],
      default: "active",
    },

    /* Analytics */
    views: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },

    /* Admin moderation */
    isApproved: { type: Boolean, default: true },
    flaggedReason: { type: String, default: null },
  },
  { timestamps: true }
);

/* Auto-expire: mark as expired if date passed */
couponSchema.pre(/^find/, function (next) {
  this.where({ expiresAt: { $gt: new Date() } }).where({ status: { $ne: "removed" } });
  next();
});

/* Index for fast search */
couponSchema.index({ title: "text", brand: "text", description: "text" });
couponSchema.index({ category: 1, status: 1, sellingPrice: 1 });

module.exports = mongoose.model("Coupon", couponSchema);
