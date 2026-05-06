import React from "react";
import { C, CATS, fmt, savings, daysLeft, font, mono } from "../theme";
import { Pill, Btn } from "../components/Shared";

export default function DetailPage({ coupon, setPage, user, setAuthMode, setPayCoupon }) {
  if (!coupon) return null;
  const price = coupon.sellingPrice || coupon.price || 0;
  const faceValue = coupon.faceValue || 0;
  const pct = savings(faceValue, price);
  const days = daysLeft(coupon.expiresAt);

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "32px 28px" }}>
      <button onClick={() => setPage("browse")} style={{ background: "none", border: "none", color: C.primary, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: font, marginBottom: 28, display: "flex", alignItems: "center", gap: 4 }}>← Back to Browse</button>

      <div style={{ background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 22, overflow: "hidden" }}>
        <div style={{ padding: "36px 36px 28px", background: `linear-gradient(160deg, ${C.primaryGlow}, ${C.amberGlow})`, borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ fontSize: 52 }}>{coupon.emoji}</span>
              <div>
                <div style={{ fontSize: 26, fontWeight: 900, color: C.text }}>{coupon.brand || coupon.brandName || "Brand"}</div>
                <Pill color={C.teal}>{coupon.type?.replace("_", " ") || "Coupon"}</Pill>
              </div>
            </div>
            <Pill color={C.amber} size="md">{pct}% SAVINGS</Pill>
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: C.text, marginBottom: 12 }}>{coupon.title || coupon.description || "Special Discount"}</h1>
          <p style={{ color: C.muted, lineHeight: 1.7, fontSize: 14 }}>{coupon.desc || coupon.description}</p>
        </div>

        <div style={{ padding: 36 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 30 }}>
            <div style={{ background: C.surface, borderRadius: 14, padding: 20 }}>
              <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.07em", marginBottom: 6 }}>Face Value</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: C.muted, textDecoration: "line-through" }}>{fmt(faceValue)}</div>
            </div>
            <div style={{ background: `${C.primary}12`, border: `1.5px solid ${C.primary}33`, borderRadius: 14, padding: 20 }}>
              <div style={{ fontSize: 11, color: C.primary, textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.07em", marginBottom: 6 }}>You Pay</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: C.text }}>{fmt(price)}</div>
            </div>
          </div>

          {[["📅 Expires", coupon.expiresAt], ["⏳ Days Left", `${days} days`, days < 7 ? C.error : C.success], ["🏷️ Category", CATS.find(c => c.id === (coupon.category || coupon.cat))?.label], ["👁️ Views", coupon.views]].map(([k, v, col]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 13, color: C.muted }}>{k}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: col || C.text }}>{v}</span>
            </div>
          ))}

          <div style={{ background: C.surface, borderRadius: 14, padding: 18, margin: "24px 0" }}>
            <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>Seller Info</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg, ${C.primary}, ${C.amber})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "#fff" }}>{(coupon.seller?.name || coupon.seller?.username || "U")[0]}</div>
                <div>
                  <div style={{ fontWeight: 700, color: C.text, fontSize: 14 }}>{coupon.seller?.name || coupon.seller?.username || "Unknown"}</div>
                  <div style={{ fontSize: 12, color: C.muted }}>{coupon.seller?.sales || 0} coupons sold</div>
                </div>
              </div>
              <Pill color={C.amber}>⭐ {coupon.seller?.rating || "N/A"}</Pill>
            </div>
          </div>

          <Btn full size="lg" onClick={() => user ? setPayCoupon(coupon) : setAuthMode("login")}
            sx={{ borderRadius: 14 }}>
            {user ? `🔐 Buy for ${fmt(price)}` : "🔑 Login to Buy"}
          </Btn>
          <p style={{ textAlign: "center", fontSize: 12, color: C.muted, marginTop: 12 }}>🔒 Secured by Stripe · Code revealed only after payment</p>
        </div>
      </div>
    </div>
  );
}