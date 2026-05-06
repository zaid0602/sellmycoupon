const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Coupon = require("../models/Coupon");
const Order = require("../models/Order");

exports.createOrder = async (req, res, next) => {
  try {
    const { couponId } = req.body;
    const coupon = await Coupon.findById(couponId).select("+couponCode");

    if (!coupon) {
      return res.status(404).json({ success: false, error: "Coupon not found" });
    }

    if (coupon.status !== "active") {
      return res.status(400).json({ success: false, error: "Coupon is not available for purchase" });
    }

    const order = await Order.create({
      buyer: req.user._id,
      seller: coupon.seller,
      coupon: coupon._id,
      amountPaid: coupon.sellingPrice,
      couponCode: coupon.couponCode,
      status: "pending",
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: coupon.title, description: coupon.brand },
            unit_amount: Math.round(coupon.sellingPrice * 100), // Stripe expects amounts in paise/cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/dashboard`, // Redirect back to their purchases
      cancel_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/`, // Redirect to home if they cancel
      metadata: { orderId: order._id.toString(), couponId: coupon._id.toString(), userId: req.user._id.toString() },
    });

    order.stripeSessionId = session.id;
    await order.save();

    res.status(200).json({ success: true, checkoutUrl: session.url });
  } catch (error) {
    next(error);
  }
};