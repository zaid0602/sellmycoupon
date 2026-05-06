const express = require("express");
const router  = express.Router();

const {
  getBalance,
  getTransactions,
  requestWithdrawal,
} = require("../controllers/walletController");

const { protect } = require("../middleware/auth");

// GET  /api/wallet             — current balance
router.get("/", protect, getBalance);

// GET  /api/wallet/transactions — full transaction history
router.get("/transactions", protect, getTransactions);

// POST /api/wallet/withdraw    — request bank withdrawal
router.post("/withdraw", protect, requestWithdrawal);

module.exports = router;
