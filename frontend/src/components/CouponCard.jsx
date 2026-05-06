import React, { useState } from "react";
import { C, CATS, fmt, savings, daysLeft } from "../theme";
import { Pill } from "./Shared";

export default function CouponCard({ coupon, onClick }) {
  const [hov, setHov] = useState(false);
  const price = coupon.sellingPrice || coupon.price || 0;
  const faceValue = coupon.faceValue || 0;
  const pct = savings(faceValue, price);
  const days = daysLeft(coupon.expiresAt);
  const urgent = days < 7;
  return (
    <div
      onClick={() => onClick(coupon)}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? C.cardHover : C.card,
        border: `1.5px solid ${hov ? C.borderHover : C.border}`,
        borderRadius: 18, padding: 22, cursor: "pointer", position: "relative", overflow: "hidden",
        transform: hov ? "translateY(-5px)" : "none",
        boxShadow: hov ? `0 16px 48px ${C.primary}18` : "0 2px 12px #00000030",
        transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      {hov && <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 0%, ${C.primaryGlow}, transparent 70%)`, pointerEvents: "none" }} />}

      <div style={{ position: "absolute", top: 14, right: 14 }}>
        <Pill color={C.amber}>{pct}% SAVE</Pill>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <span style={{ fontSize: 28 }}>{coupon.emoji}</span>
        <div>
          <div style={{ fontWeight: 800, fontSize: 15, color: C.text }}>{coupon.brand || coupon.brandName || "Special Offer"}</div>
          <div style={{ fontSize: 11, color: C.muted }}>{CATS.find(c => c.id === (coupon.category || coupon.cat))?.label}</div>
        </div>
      </div>

      <div style={{ fontWeight: 600, fontSize: 14, color: C.text, marginBottom: 16, lineHeight: 1.45, minHeight: 40, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
        {coupon.title || coupon.description || coupon.desc || `${pct}% Off`}
      </div>

      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 11, color: C.muted, textDecoration: "line-through" }}>{fmt(faceValue)}</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: C.text }}>{fmt(price)}</div>
        </div>
      <Pill color={C.teal}>{coupon.type?.replace("_", " ") || "Coupon"}</Pill>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 12, borderTop: `1px solid ${C.border}`, fontSize: 11 }}>
        <span style={{ color: urgent ? C.error : C.muted }}>⏱ {days}d left</span>
        <span style={{ color: C.muted }}>👁 {coupon.views}</span>
      <span style={{ color: C.amber }}>⭐ {coupon.seller?.rating || "0"} · {coupon.seller?.name || coupon.seller?.username || "Unknown"}</span>
      </div>
    </div>
  );
}
