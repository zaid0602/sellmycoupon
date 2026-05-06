import React, { useState } from "react";
import { C, CATS, fmt, savings } from "../theme";
import { Btn, TextInput, SelectInput } from "../components/Shared";

export default function SellPage({ user, setAuthMode, setPage }) {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ title: "", brand: "", cat: "shopping", type: "discount_code", face: "", price: "", code: "", expires: "", desc: "" });
  const f = k => v => setForm(p => ({ ...p, [k]: v }));

  if (!user) return (
    <div style={{ textAlign: "center", padding: "90px 28px" }}>
      <div style={{ fontSize: 52 }}>🔑</div>
      <h2 style={{ color: C.text, marginBottom: 10, fontWeight: 800, marginTop: 16 }}>Login Required</h2>
      <p style={{ color: C.muted, marginBottom: 28 }}>You need to be logged in to sell coupons</p>
      <Btn onClick={() => setAuthMode("login")}>Login Now</Btn>
    </div>
  );

  if (done) return (
    <div style={{ textAlign: "center", padding: "90px 28px" }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
      <h2 style={{ color: C.success, fontWeight: 900, fontSize: 28, marginBottom: 10 }}>Coupon Listed!</h2>
      <p style={{ color: C.muted, marginBottom: 8 }}>Your coupon is now live and visible to buyers.</p>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 36 }}>You'll receive payment within 24h of a successful sale.</p>
      <div style={{ display: "flex", gap: 14, justifyContent: "center" }}>
        <Btn onClick={() => { setDone(false); setStep(1); setForm({ title: "", brand: "", cat: "shopping", type: "discount_code", face: "", price: "", code: "", expires: "", desc: "" }); }}>List Another</Btn>
        <Btn variant="ghost" onClick={() => setPage("dashboard")}>View Dashboard</Btn>
      </div>
    </div>
  );

  const steps = ["Coupon Info", "Pricing & Code", "Review"];

  const submitListing = async () => {
    setError("");
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        credentials: "include",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          title: form.title,
          brand: form.brand,
          description: form.desc,
          category: form.cat,
          couponType: form.type,
          faceValue: Number(form.face),
          sellingPrice: Number(form.price),
          couponCode: form.code,
          expiresAt: form.expires,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || "Failed to list coupon");
      setDone(true);
    } catch (err) {
      setError(err.message || "Unable to list coupon");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 580, margin: "0 auto", padding: "36px 28px" }}>
      <h1 style={{ fontSize: 28, fontWeight: 900, color: C.text, marginBottom: 6 }}>Sell Your Coupon</h1>
      <p style={{ color: C.muted, marginBottom: 36 }}>List your unused coupon and earn real cash</p>

      {/* Steps */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 36 }}>
        {steps.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#fff", flexShrink: 0, background: i + 1 < step ? C.success : i + 1 === step ? C.primary : C.border }}>{i + 1 < step ? "✓" : i + 1}</div>
              <span style={{ fontSize: 12, fontWeight: 700, color: i + 1 === step ? C.primary : C.muted, whiteSpace: "nowrap" }}>{s}</span>
            </div>
            {i < steps.length - 1 && <div style={{ flex: 1, height: 1, background: i + 1 < step ? C.success : C.border, margin: "0 10px" }} />}
          </div>
        ))}
      </div>

      <div style={{ background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 22, padding: 32 }}>
        {step === 1 && (
          <>
            <TextInput label="Coupon Title" value={form.title} onChange={f("title")} placeholder="e.g. Amazon 20% Off Electronics" required icon="🏷️" />
            <TextInput label="Brand Name" value={form.brand} onChange={f("brand")} placeholder="e.g. Amazon, Swiggy, Myntra" required icon="🏢" />
            <SelectInput label="Category" value={form.cat} onChange={f("cat")} options={CATS.filter(c => c.id !== "all").map(c => ({ v: c.id, l: `${c.emoji} ${c.label}` }))} required />
            <SelectInput label="Coupon Type" value={form.type} onChange={f("type")} options={[{ v: "discount_code", l: "🏷️ Discount Code" }, { v: "gift_card", l: "🎁 Gift Card" }, { v: "one_time", l: "🎯 One-Time Coupon" }]} required />
            <TextInput label="Description" type="textarea" value={form.desc} onChange={f("desc")} placeholder="Describe the coupon, terms, conditions, minimum order…" />
            <Btn full onClick={() => form.title && form.brand && setStep(2)} disabled={!form.title || !form.brand}>Next: Pricing & Code →</Btn>
          </>
        )}

        {step === 2 && (
          <>
            <TextInput label="Face Value (₹)" type="number" value={form.face} onChange={f("face")} placeholder="e.g. 500" required icon="💰" />
            <TextInput label="Your Selling Price (₹)" type="number" value={form.price} onChange={f("price")} placeholder="e.g. 350" required icon="💸" />
            {form.face && form.price && +form.face > +form.price && (
              <div style={{ background: `${C.success}10`, border: `1px solid ${C.success}30`, borderRadius: 10, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: C.success }}>
                ✅ Buyer saves {savings(+form.face, +form.price)}% · You earn {fmt(Math.floor(+form.price * 0.9))} after 10% fee
              </div>
            )}
            <TextInput label="Coupon Code" value={form.code} onChange={f("code")} placeholder="e.g. AMZN20OFF" required icon="🔑" />
            <TextInput label="Expiry Date" type="date" value={form.expires} onChange={f("expires")} required icon="📅" />
            <div style={{ display: "flex", gap: 12 }}>
              <Btn variant="ghost" onClick={() => setStep(1)}>← Back</Btn>
              <Btn onClick={() => form.face && form.price && form.code && form.expires && setStep(3)} disabled={!form.face || !form.price || !form.code || !form.expires}>Review →</Btn>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h3 style={{ color: C.text, fontWeight: 800, marginBottom: 20, fontSize: 17 }}>Review Your Listing</h3>
            {[["Title", form.title], ["Brand", form.brand], ["Category", CATS.find(c => c.id === form.cat)?.label], ["Face Value", fmt(+form.face)], ["Selling Price", fmt(+form.price)], ["Expires", form.expires]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.border}`, fontSize: 14 }}>
                <span style={{ color: C.muted }}>{k}</span>
                <span style={{ fontWeight: 700, color: C.text }}>{v}</span>
              </div>
            ))}
            <div style={{ background: `${C.warning}12`, borderRadius: 10, padding: "12px 16px", margin: "18px 0", fontSize: 12, color: C.warning }}>⚠️ Coupon code stays hidden until buyer pays. 10% platform fee applies.</div>
            <div style={{ display: "flex", gap: 12 }}>
              <Btn variant="ghost" onClick={() => setStep(2)}>← Edit</Btn>
              <Btn onClick={submitListing} disabled={isSubmitting}>
                {isSubmitting ? "Listing..." : "🚀 List Now"}
              </Btn>
            </div>
            {error && <div style={{ color: C.error, marginTop: 14 }}>{error}</div>}
          </>
        )}
      </div>
    </div>
  );
}