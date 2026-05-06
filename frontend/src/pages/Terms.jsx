import React from "react";
import { C, font } from "../theme";

export default function TermsPage() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "60px 28px", fontFamily: font }}>
      <h1 style={{ fontSize: 32, fontWeight: 900, color: C.text, marginBottom: 24 }}>Terms of Service</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 24, color: C.muted, lineHeight: 1.7, fontSize: 15 }}>
        <p>Welcome to sellmycoupon.in. By accessing or using our platform, you agree to be bound by these terms.</p>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8 }}>1. Platform Usage</h2>
          <p>Our platform facilitates the buying and selling of unused coupons. We act as an intermediary to securely process transactions.</p>
        </div>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8 }}>2. Seller Responsibilities</h2>
          <p>Sellers must ensure that all coupons listed are valid, unused, and accurately described. Fraudulent listings will result in immediate account suspension.</p>
        </div>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8 }}>3. Buyer Responsibilities</h2>
          <p>Buyers are responsible for checking the terms, conditions, and expiry dates of a coupon before purchasing. All sales are final once the code is revealed, unless the code is proven invalid.</p>
        </div>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8 }}>4. Fees & Payments</h2>
          <p>We charge a 10% platform fee on all successful sales. Payouts are processed to the seller's provided bank details within 24-48 hours of withdrawal request.</p>
        </div>
      </div>
    </div>
  );
}