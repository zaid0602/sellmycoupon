import React, { useState } from "react";
import { C, mono, fmt } from "../theme";
import { Btn, TextInput } from "./Shared";

export function AuthModal({ mode, onClose, onLogin }) {
  const [isLogin, setIsLogin] = useState(mode === "login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const submit = async (e) => {
    if (e) e.preventDefault();
    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const payload = isLogin ? { email, password: pass } : { name, username: name.replace(/\s+/g, "").toLowerCase() + Math.floor(Math.random() * 10000), email, password: pass };
      
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include"
      });
      
      let data;
      try { data = await res.json(); } catch (err) {}
      if (!res.ok) throw new Error(data?.error || data?.message || "Authentication failed");
      
      if (data?.token) localStorage.setItem("token", data.token);
      
      const userData = data?.data || data?.user || { name: isLogin ? email.split("@")[0] : name, email, admin: email === "admin@sellmycoupon.in" };
      if (userData.password) delete userData.password;
      localStorage.setItem("user", JSON.stringify(userData));

      onLogin(userData);
      onClose();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000000BB", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={onClose}>
      <form onSubmit={submit} style={{ background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 24, padding: 40, width: "100%", maxWidth: 400, position: "relative" }} onClick={e => e.stopPropagation()}>
        <button type="button" onClick={onClose} style={{ position: "absolute", top: 16, right: 18, background: "none", border: "none", color: C.muted, fontSize: 20, cursor: "pointer" }}>✕</button>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 30, marginBottom: 10 }}>🏷️</div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: C.text, marginBottom: 4 }}>{isLogin ? "Welcome back!" : "Join sellmycoupon.in"}</h2>
          <p style={{ fontSize: 14, color: C.muted }}>{isLogin ? "Sign in to your account" : "Create a free account today"}</p>
        </div>
        {!isLogin && <TextInput label="Full Name" value={name} onChange={setName} placeholder="Rahul Kumar" required icon="👤" />}
        <TextInput label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" required icon="📧" />
        <TextInput label="Password" type="password" value={pass} onChange={setPass} placeholder="••••••••" required icon="🔒" />
        {isLogin && <p style={{ fontSize: 12, color: C.primary, textAlign: "right", marginTop: -10, marginBottom: 16, cursor: "pointer" }}>Forgot password?</p>}
        <Btn full type="submit" sx={{ marginBottom: 16 }}>{isLogin ? "🔑 Sign In" : "🚀 Create Account"}</Btn>
        <p style={{ textAlign: "center", fontSize: 13, color: C.muted }}>
          {isLogin ? "Don't have an account? " : "Already have one? "}
          <span style={{ color: C.primary, cursor: "pointer", fontWeight: 700 }} onClick={() => setIsLogin(!isLogin)}>{isLogin ? "Sign Up" : "Sign In"}</span>
        </p>
        {isLogin && <p style={{ textAlign: "center", fontSize: 11, color: C.muted, marginTop: 10 }}>💡 Use admin@sellmycoupon.in for admin panel access</p>}
      </form>
    </div>
  );
}

export function PaymentModal({ coupon, onClose }) {
  const [step, setStep] = useState(1);
  const [code, setCode] = useState("CODE-HIDDEN-BY-BACKEND");
  const price = coupon.sellingPrice || coupon.price || 0;

  const pay = async () => {
    setStep(2);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ couponId: coupon._id || coupon.id })
      });
      
      let data;
      try { data = await res.json(); } catch(err) {}
      if (!res.ok) throw new Error(data?.error || data?.message || "Payment initiation failed");

      // If backend returns a Stripe Checkout Session URL, redirect to it
      if (data?.url || data?.checkoutUrl) {
        window.location.href = data.url || data.checkoutUrl;
        return;
      }
      
      // Otherwise, unlock the code immediately (useful for testing or full-balance wallet payments)
      setCode(data?.couponCode || data?.order?.couponCode || data?.data?.couponCode || coupon.couponCode || "SUCCESS-CODE");
      setStep(3);
    } catch (err) {
      alert("Error: " + err.message);
      setStep(1);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000000CC", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={onClose}>
      <div style={{ background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 24, padding: 40, width: "100%", maxWidth: 380 }} onClick={e => e.stopPropagation()}>
        {step === 1 && (
          <>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: C.text, marginBottom: 24 }}>🔐 Secure Checkout</h2>
            <div style={{ background: C.surface, borderRadius: 14, padding: 18, marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <span style={{ fontSize: 30 }}>{coupon.emoji}</span>
                <div><div style={{ fontWeight: 800, color: C.text }}>{coupon.brand}</div><div style={{ fontSize: 13, color: C.muted }}>{coupon.title}</div></div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: C.muted, fontSize: 13 }}>Amount</span>
                <span style={{ fontWeight: 900, color: C.primary, fontSize: 22 }}>{fmt(price)}</span>
              </div>
            </div>
            <div style={{ background: `${C.success}10`, borderRadius: 10, padding: 12, marginBottom: 20, fontSize: 13, color: C.success }}>🔒 Payment secured by Stripe · Code revealed after confirmation</div>
            <Btn full size="lg" onClick={pay} sx={{ marginBottom: 10 }}>Pay {fmt(price)} via Stripe</Btn>
            <Btn full variant="ghost" onClick={onClose}>Cancel</Btn>
          </>
        )}
        {step === 2 && (
          <div style={{ textAlign: "center", padding: "30px 0" }}>
            <div style={{ fontSize: 52, marginBottom: 18, display: "inline-block", animation: "spin 1s linear infinite" }}>⏳</div>
            <div style={{ color: C.text, fontWeight: 700, fontSize: 16 }}>Processing payment…</div>
            <div style={{ color: C.muted, fontSize: 13, marginTop: 8 }}>Do not close this window</div>
          </div>
        )}
        {step === 3 && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
            <h2 style={{ color: C.success, fontWeight: 900, fontSize: 22, marginBottom: 10 }}>Payment Successful!</h2>
            <p style={{ color: C.muted, marginBottom: 22, fontSize: 14 }}>Your coupon code is now unlocked</p>
            <div style={{ background: `${C.success}12`, border: `1.5px solid ${C.success}44`, borderRadius: 14, padding: 22, marginBottom: 26 }}>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 10, textTransform: "uppercase", fontWeight: 700 }}>🔑 Your Coupon Code</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: C.success, letterSpacing: "0.12em", fontFamily: mono }}>{code}</div>
            </div>
            <Btn full onClick={onClose}>Done</Btn>
          </div>
        )}
      </div>
    </div>
  );
}