const User = require("../models/User");
const { generateToken } = require("../middleware/auth");

/* ─── Register ─── */
exports.register = async (req, res, next) => {
  try {
    const { name, username, email, password } = req.body;

    if (await User.findOne({ email })) {
      return res.status(400).json({ success: false, error: "Email already registered" });
    }

    const role = email === "admin@sellmycoupon.in" ? "admin" : "user";
    const user = await User.create({ name: name || username, username: username || name, email, password, role });

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        walletBalance: user.walletBalance,
      },
    });
  } catch (err) {
    next(err);
  }
};

/* ─── Login ─── */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, error: "Invalid email or password" });
    }
    if (user.isSuspended) {
      return res.status(403).json({ success: false, error: "Your account has been suspended" });
    }

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        walletBalance: user.walletBalance,
        rating: user.averageRating,
        totalSales: user.totalSales,
      },
    });
  } catch (err) {
    next(err);
  }
};

/* ─── Get Current User ─── */
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

/* ─── Update Password ─── */
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, error: "Both passwords are required" });
    }

    const user = await User.findById(req.user.id).select("+password");

    if (!(await user.matchPassword(currentPassword))) {
      return res.status(401).json({ success: false, error: "Current password is incorrect" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, error: "New password must be at least 6 characters" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: "Password updated successfully", token: generateToken(user._id) });
  } catch (err) {
    next(err);
  }
};
