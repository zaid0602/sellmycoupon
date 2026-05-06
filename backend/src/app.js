const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");

const authRoutes      = require("./routes/auth");
const userRoutes      = require("./routes/users");
const couponRoutes    = require("./routes/coupons");
const orderRoutes     = require("./routes/orders");
const paymentRoutes   = require("./routes/payments");
const walletRoutes    = require("./routes/wallet");
const adminRoutes     = require("./routes/admin");
const { errorHandler } = require("./middleware/errorHandler");

// Start the background escrow clearing service
require("./controllers/escrowService");

const app = express();

/* ─── Security & Parsing ─── */
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use("/api/payments/webhook", express.raw({ type: "application/json" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

/* ─── Global Rate Limiter ─── */
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200,
  message: { success: false, error: "Too many requests, please try again later." },
});
app.use(globalLimiter);

/* ─── Routes ─── */
app.use("/api/auth",     authRoutes);
app.use("/api/users",    userRoutes);
app.use("/api/coupons",  couponRoutes);
app.use("/api/orders",   orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/wallet",   walletRoutes);
app.use("/api/admin",    adminRoutes);

/* ─── Health Check ─── */
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "sellmycoupon.in API is running", env: process.env.NODE_ENV });
});

/* ─── 404 Handler ─── */
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route ${req.originalUrl} not found` });
});

/* ─── Error Handler ─── */
app.use(errorHandler);

module.exports = app;
