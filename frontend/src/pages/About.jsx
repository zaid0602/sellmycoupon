import React from "react";
import { C, font } from "../theme";

export default function AboutPage() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "60px 28px", fontFamily: font }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <span style={{ fontSize: 48 }}>👋</span>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: C.text, marginTop: 16 }}>About sellmycoupon.in</h1>
        <p style={{ color: C.muted, fontSize: 16, marginTop: 12 }}>India's most trusted peer-to-peer coupon marketplace.</p>
      </div>
      
      <div style={{ display: "flex", flexDirection: "column", gap: 24, color: C.muted, lineHeight: 1.7, fontSize: 15 }}>
        <p>Every day, thousands of valuable coupons, gift cards, and discount codes expire completely unused. Whether it's a flight voucher, a food delivery discount, or a shopping promo code, we believe that value shouldn't go to waste.</p>
        
        <p><strong>sellmycoupon.in</strong> was built to solve this problem. We provide a secure, transparent platform where anyone can list their unused coupons for cash, and shoppers can discover incredible discounts on the brands they love.</p>
        
        <div style={{ background: C.card, border: `1.5px solid ${C.border}`, padding: 24, borderRadius: 16, marginTop: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: C.text, marginBottom: 12 }}>Our Mission</h2>
          <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
            <li>To help people monetize their unused digital assets.</li>
            <li>To help shoppers save real money on everyday purchases.</li>
            <li>To create a completely secure ecosystem with zero fraud.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}