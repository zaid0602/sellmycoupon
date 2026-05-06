import React, { useState, useEffect } from "react";
import { C, CATS, savings, font } from "../theme";
import CouponCard from "../components/CouponCard";

export default function BrowsePage({ setPage, setCoupon }) {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("all");
  const [sort, setSort] = useState("popular");
  const [priceFilter, setPriceFilter] = useState("all");
  const [COUPONS, setCOUPONS] = useState([]);

  useEffect(() => {
    fetch("/api/coupons")
      .then(res => res.json())
      .then(data => setCOUPONS(Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : [])))
      .catch(err => console.error("Failed to load coupons", err));
  }, []);

  const filtered = COUPONS.filter(c => {
    const q = search.trim().toLowerCase();
    const ms = q === "" || String(c.title || c.description || c.desc || "").toLowerCase().includes(q) || String(c.brand || c.brandName || "").toLowerCase().includes(q);
    const mc = cat === "all" || (c.category || c.cat) === cat;
    const price = c.sellingPrice || c.price || 0;
    const mp = priceFilter === "all" || (priceFilter === "lt500" && price < 500) || (priceFilter === "500-1000" && price >= 500 && price <= 1000) || (priceFilter === "gt1000" && price > 1000);
    return ms && mc && mp;
  }).sort((a, b) => {
    const priceA = a.sellingPrice || a.price || 0;
    const priceB = b.sellingPrice || b.price || 0;
    const faceA = a.faceValue || 0;
    const faceB = b.faceValue || 0;
    return sort === "price_asc" ? priceA - priceB : sort === "price_desc" ? priceB - priceA : sort === "savings" ? savings(faceB, priceB) - savings(faceA, priceA) : (b.views || 0) - (a.views || 0);
  });

  return (
    <div style={{ padding: "32px 28px", maxWidth: 1200, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: 900, color: C.text, marginBottom: 28 }}>Browse Coupons</h1>

      {/* Filters */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 22 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍  Search brand or coupon..."
          style={{ flex: 1, minWidth: 200, padding: "11px 16px", background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 10, color: C.text, fontSize: 14, fontFamily: font, outline: "none" }} />
        {[
          { v: sort, fn: setSort, opts: [["popular", "Popular"], ["price_asc", "Price ↑"], ["price_desc", "Price ↓"], ["savings", "Best Savings"]] },
          { v: priceFilter, fn: setPriceFilter, opts: [["all", "All Prices"], ["lt500", "Under ₹500"], ["500-1000", "₹500–₹1000"], ["gt1000", "Above ₹1000"]] },
        ].map(({ v, fn, opts }, i) => (
          <select key={i} value={v} onChange={e => fn(e.target.value)}
            style={{ padding: "11px 14px", background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 10, color: C.text, fontSize: 13, fontFamily: font, cursor: "pointer", appearance: "none" }}>
            {opts.map(([val, lbl]) => <option key={val} value={val} style={{ background: C.surface }}>{lbl}</option>)}
          </select>
        ))}
      </div>

      {/* Category pills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 26 }}>
        {CATS.map(c => (
          <button key={c.id} onClick={() => setCat(c.id)} style={{
            padding: "6px 14px", borderRadius: 99, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: font, transition: "all 0.18s",
            background: cat === c.id ? C.primary : "transparent",
            color: cat === c.id ? "#fff" : C.muted,
            border: cat === c.id ? "none" : `1px solid ${C.border}`,
          }}>{c.emoji} {c.label}</button>
        ))}
      </div>

      <div style={{ fontSize: 12, color: C.muted, marginBottom: 18 }}>Showing {filtered.length} coupon{filtered.length !== 1 ? "s" : ""}</div>

      {filtered.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: 16 }}>
          {filtered.map(c => <CouponCard key={c._id || c.id} coupon={c} onClick={(cp) => { setCoupon(cp); setPage("detail"); }} />)}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "70px 28px" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: C.text }}>No coupons found</div>
          <div style={{ color: C.muted, marginTop: 8 }}>Try adjusting your search or filters</div>
        </div>
      )}
    </div>
  );
}