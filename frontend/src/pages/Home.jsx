import React, { useState, useEffect } from "react";
import { C, CATS } from "../theme";
import { Pill, Btn } from "../components/Shared";
import CouponCard from "../components/CouponCard";

export default function HomePage({ setPage, setCoupon }) {
  const [COUPONS, setCOUPONS] = useState([]);

  useEffect(() => {
    fetch("/api/coupons")
      .then(res => res.json())
      .then(data => setCOUPONS(Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : [])))
      .catch(err => console.error("Failed to load coupons", err));
  }, []);

  const hot = COUPONS.slice(0, 4);
  return (
    <div>
      {/* Hero */}
      <div style={{ padding: "80px 28px 60px", textAlign: "center", background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${C.primaryGlow}, transparent)`, borderBottom: `1px solid ${C.border}` }}>
        <Pill color={C.amber} size="md">🇮🇳 India's #1 Coupon Marketplace</Pill>
        <h1 style={{ fontSize: "clamp(34px,5vw,66px)", fontWeight: 900, margin: "20px auto 18px", lineHeight: 1.08, maxWidth: 700, background: `linear-gradient(150deg, ${C.text} 40%, ${C.primary})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Buy & Sell Coupons.<br />Save Real Money.
        </h1>
        <p style={{ fontSize: 18, color: C.muted, maxWidth: 520, margin: "0 auto 36px", lineHeight: 1.65 }}>
          Unused coupon? Turn it into cash. Need a discount? Buy one cheap. Secure, peer-to-peer, instant.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <Btn size="lg" onClick={() => setPage("browse")}>🔍 Browse Coupons</Btn>
          <Btn variant="outline" size="lg" onClick={() => setPage("sell")}>💰 Sell My Coupon</Btn>
        </div>

        <div style={{ display: "flex", gap: 48, justifyContent: "center", marginTop: 56, flexWrap: "wrap" }}>
          {[["12,400+", "Coupons Sold"], ["₹82L+", "Value Traded"], ["9,200+", "Users"], ["4.8★", "Avg Rating"]].map(([v, l]) => (
            <div key={l}>
              <div style={{ fontSize: 26, fontWeight: 900, color: C.primary }}>{v}</div>
              <div style={{ fontSize: 12, color: C.muted }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div style={{ padding: "40px 28px" }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: C.text, marginBottom: 18 }}>Browse by Category</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {CATS.filter(c => c.id !== "all").map(cat => (
            <button key={cat.id} onClick={() => setPage("browse")}
              style={{ background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 12, padding: "9px 18px", cursor: "pointer", color: C.text, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 7, transition: "all 0.18s" }}>
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Hot deals */}
      <div style={{ padding: "0 28px 60px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: C.text }}>🔥 Hot Deals Right Now</h2>
          <Btn variant="ghost" size="sm" onClick={() => setPage("browse")}>See all →</Btn>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: 16 }}>
          {hot.map(c => <CouponCard key={c._id || c.id} coupon={c} onClick={(cp) => { setCoupon(cp); setPage("detail"); }} />)}
        </div>
      </div>

      {/* How it works */}
      <div style={{ padding: "50px 28px", background: C.surface, borderTop: `1px solid ${C.border}` }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: C.text, textAlign: "center", marginBottom: 40 }}>How It Works</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 24, maxWidth: 800, margin: "0 auto" }}>
          {[["📝", "List Coupon", "Upload unused coupons in seconds. Set price and go live instantly."],
            ["💸", "Buyer Pays", "Buyers browse and pay securely via Stripe. Funds held in escrow."],
            ["�", "Code Revealed", "Coupon code is revealed only after payment confirmation."],
            ["🏦", "You Earn", "Withdraw to bank within 24h. We take only 10% commission."]
          ].map(([ico, title, desc]) => (
            <div key={title} style={{ textAlign: "center", padding: "24px 12px" }}>
              <div style={{ fontSize: 34, marginBottom: 12 }}>{ico}</div>
              <div style={{ fontWeight: 700, fontSize: 15, color: C.text, marginBottom: 8 }}>{title}</div>
              <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.65 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
