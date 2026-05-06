const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/Order");
const Coupon = require("../models/Coupon");
const User = require("../models/User");
// Adjust the path if your WalletTransaction model is named differently
const WalletTransaction = require("../models/WalletTransaction");

exports.stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    // Verify the webhook signature to ensure it actually came from Stripe
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the successful payment event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata.orderId;
    const couponId = session.metadata.couponId;

    try {
      // 1. Mark the Order as completed
      const order = await Order.findByIdAndUpdate(orderId, { status: "completed" }, { new: true });
      
      if (order) {
        // 2. Mark the Coupon as sold
        const coupon = await Coupon.findByIdAndUpdate(couponId, { status: "sold" });

        if (coupon) {
          // 3. FUNDS HELD IN ESCROW
          // We intentionally DO NOT update the user's wallet here!
          // A background service will automatically verify 24 hours have passed 
          // without a dispute, and then credit their wallet balance.
        }
      }
    } catch (err) {
      console.error("Error processing successful payment:", err);
      return res.status(500).send("Internal Server Error");
    }
  }

  // Acknowledge receipt of the event
  res.json({ received: true });
};