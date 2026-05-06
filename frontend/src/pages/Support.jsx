import React from "react";
import { C, font } from "../theme";

export default function SupportPage() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "60px 28px", fontFamily: font, textAlign: "center" }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🎧</div>
      <h1 style={{ fontSize: 32, fontWeight: 900, color: C.text, marginBottom: 16 }}>Help & Support</h1>
      <p style={{ color: C.muted, lineHeight: 1.7, fontSize: 16, marginBottom: 40 }}>Need help with a purchase or having trouble listing a coupon? Our team is here to assist you.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16, textAlign: "left", marginBottom: 40 }}>
        <div style={{ background: C.card, padding: 24, borderRadius: 16, border: `1.5px solid ${C.border}` }}>
          <h3 style={{ color: C.text, fontWeight: 800, marginBottom: 8 }}>Email Support</h3>
          <p style={{ color: C.muted, fontSize: 14, marginBottom: 16 }}>Get in touch with our support team via email.</p>
          <a href="mailto:support@sellmycoupon.in" style={{ color: C.primary, textDecoration: "none", fontWeight: 700 }}>support@sellmycoupon.in</a>
        </div>
        <div style={{ background: C.card, padding: 24, borderRadius: 16, border: `1.5px solid ${C.border}` }}>
          <h3 style={{ color: C.text, fontWeight: 800, marginBottom: 8 }}>Dispute a Purchase</h3>
          <p style={{ color: C.muted, fontSize: 14, marginBottom: 16 }}>Did a coupon code not work? Open a dispute within 24 hours.</p>
          <a href="mailto:disputes@sellmycoupon.in" style={{ color: C.primary, textDecoration: "none", fontWeight: 700 }}>disputes@sellmycoupon.in</a>
        </div>
      </div>

      <div style={{ background: C.surface, padding: 32, borderRadius: 16, textAlign: "left" }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: C.text, marginBottom: 16 }}>Frequently Asked Questions</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <h4 style={{ color: C.text, fontWeight: 700, marginBottom: 4 }}>When do I get paid for a sale?</h4>
            <p style={{ color: C.muted, fontSize: 14 }}>Once a buyer purchases your coupon and does not open a dispute within 24 hours, the funds are credited to your wallet.</p>
          </div>
          <div>
            <h4 style={{ color: C.text, fontWeight: 700, marginBottom: 4 }}>What if a code I bought doesn't work?</h4>
            <p style={{ color: C.muted, fontSize: 14 }}>Contact our disputes team immediately with proof. We hold funds in escrow to protect buyers against invalid codes.</p>
          </div>
        </div>
      </div>
    </div>
  );
}