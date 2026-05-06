const jwt  = require("jsonwebtoken");
const User = require("../models/User");

/* ─── Verify JWT ─── */
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, error: "Not authorised — no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ success: false, error: "User not found" });
    }
    if (req.user.isSuspended) {
      return res.status(403).json({ success: false, error: "Account suspended" });
    }

    next();
  } catch {
    res.status(401).json({ success: false, error: "Invalid or expired token" });
  }
};

/* ─── Admin only ─── */
exports.adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ success: false, error: "Admin access required" });
  }
  next();
};

/* ─── Generate JWT ─── */
exports.generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || "7d" });
