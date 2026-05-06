const Coupon = require("../models/Coupon");

/* ─── GET /api/coupons  (browse with filters, sort, pagination) ─── */
exports.getCoupons = async (req, res, next) => {
  try {
    const {
      search, category, couponType, minPrice, maxPrice,
      sort = "newest", page = 1, limit = 12,
    } = req.query;

    const filter = { status: "active", isApproved: true };

    if (search) {
      filter.$text = { $search: search };
    }
    if (category && category !== "all") filter.category = category;
    if (couponType) filter.couponType = couponType;
    if (minPrice || maxPrice) {
      filter.sellingPrice = {};
      if (minPrice) filter.sellingPrice.$gte = Number(minPrice);
      if (maxPrice) filter.sellingPrice.$lte = Number(maxPrice);
    }

    const sortMap = {
      newest:    { createdAt: -1 },
      oldest:    { createdAt:  1 },
      price_asc: { sellingPrice: 1 },
      price_desc:{ sellingPrice: -1 },
      savings:   { faceValue: -1 },   // proxy — high face = more savings
      popular:   { views: -1 },
    };

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await Coupon.countDocuments(filter);

    const coupons = await Coupon.find(filter)
      .populate("seller", "name rating ratingCount totalSales")
      .sort(sortMap[sort] || sortMap.newest)
      .skip(skip)
      .limit(Number(limit))
      .select("-couponCode"); // never leak the code

    res.json({
      success: true,
      count: coupons.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: Number(page),
      data: coupons,
    });
  } catch (err) {
    next(err);
  }
};

/* ─── GET /api/coupons/featured ─── */
exports.getFeaturedCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find({ status: "active", isApproved: true, isFeatured: true })
      .populate("seller", "name rating ratingCount")
      .sort({ createdAt: -1 })
      .limit(8)
      .select("-couponCode");

    res.json({ success: true, count: coupons.length, data: coupons });
  } catch (err) {
    next(err);
  }
};

/* ─── GET /api/coupons/:id ─── */
exports.getCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id)
      .populate("seller", "name rating ratingCount totalSales createdAt")
      .select("-couponCode");

    if (!coupon) {
      return res.status(404).json({ success: false, error: "Coupon not found" });
    }

    /* Increment view count */
    await Coupon.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    res.json({ success: true, data: coupon });
  } catch (err) {
    next(err);
  }
};

/* ─── GET /api/coupons/my ─── */
exports.getMyCoupons = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = { seller: req.user.id };
    if (status) filter.status = status;

    /* Seller CAN see their own code */
    const coupons = await Coupon.find(filter).sort({ createdAt: -1 });

    res.json({ success: true, count: coupons.length, data: coupons });
  } catch (err) {
    next(err);
  }
};

/* ─── POST /api/coupons ─── */
exports.createCoupon = async (req, res, next) => {
  try {
    const { title, brand, description, category, couponType, faceValue, sellingPrice, couponCode, expiresAt } = req.body;

    const coupon = await Coupon.create({
      seller: req.user.id,
      title, brand, description, category, couponType,
      faceValue, sellingPrice, couponCode, expiresAt,
    });

    /* Don't return the code in the response */
    const safe = coupon.toObject();
    delete safe.couponCode;

    res.status(201).json({ success: true, data: safe });
  } catch (err) {
    next(err);
  }
};

/* ─── PUT /api/coupons/:id ─── */
exports.updateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) return res.status(404).json({ success: false, error: "Coupon not found" });
    if (coupon.seller.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, error: "Not authorised to edit this coupon" });
    }
    if (coupon.status === "sold") {
      return res.status(400).json({ success: false, error: "Cannot edit a sold coupon" });
    }

    const allowed = ["title", "brand", "description", "category", "couponType", "faceValue", "sellingPrice", "couponCode", "expiresAt"];
    allowed.forEach((f) => { if (req.body[f] !== undefined) coupon[f] = req.body[f]; });
    await coupon.save();

    const safe = coupon.toObject();
    delete safe.couponCode;

    res.json({ success: true, data: safe });
  } catch (err) {
    next(err);
  }
};

/* ─── DELETE /api/coupons/:id ─── */
exports.deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) return res.status(404).json({ success: false, error: "Coupon not found" });
    if (coupon.seller.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, error: "Not authorised" });
    }
    if (coupon.status === "sold") {
      return res.status(400).json({ success: false, error: "Cannot remove a sold coupon" });
    }

    coupon.status = "removed";
    await coupon.save();

    res.json({ success: true, message: "Coupon removed successfully" });
  } catch (err) {
    next(err);
  }
};
