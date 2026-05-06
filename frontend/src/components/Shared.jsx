import React, { useState } from "react";
import { C, font } from "../theme";

export function Pill({ children, color = C.primary, size = "sm" }) {
  const p = size === "sm" ? "3px 9px" : "5px 14px";
  const fs = size === "sm" ? "10px" : "12px";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", padding: p, borderRadius: 99,
      fontSize: fs, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
      color, background: `${color}18`, border: `1px solid ${color}33`,
    }}>{children}</span>
  );
}

export function Btn({ children, onClick, variant = "primary", size = "md", full, disabled, style: sx }) {
  const [hover, setHover] = useState(false);
  const vs = {
    primary: { bg: hover ? C.primaryDark : C.primary, color: "#ffffff", border: "none", textShadow: "0 1px 2px rgba(0,0,0,0.3)" },
    outline: { bg: hover ? `${C.primary}12` : "transparent", color: C.primary, border: `1.5px solid ${C.primary}` },
    ghost: { bg: hover ? `${C.border}88` : "transparent", color: C.muted, border: `1px solid ${C.border}` },
    danger: { bg: hover ? "#EF444422" : "#EF444415", color: C.error, border: `1px solid #EF444433` },
    success: { bg: hover ? "#22C55E22" : "#22C55E15", color: C.success, border: `1px solid #22C55E33` },
    white: { bg: hover ? "#E2E8F0" : "#FFFFFF", color: "#0F172A", border: "none" },
  }[variant];
  const pad = size === "sm" ? "6px 14px" : size === "lg" ? "14px 32px" : "10px 22px";
  const fs = size === "sm" ? "12px" : size === "lg" ? "16px" : "14px";
  return (
    <button
      onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        ...vs, padding: pad, borderRadius: 10, fontSize: fs, fontWeight: 700,
        cursor: disabled ? "not-allowed" : "pointer", width: full ? "100%" : "auto",
        opacity: disabled ? 0.45 : 1, transition: "all 0.18s", fontFamily: font,
        boxShadow: variant === "primary" && hover ? `0 6px 20px ${C.primary}40` : "none",
        ...sx,
      }}
    >{children}</button>
  );
}

export function TextInput({ label, type = "text", value, onChange, placeholder, icon, required }) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}{required && <span style={{ color: C.primary }}> *</span>}</label>}
      <div style={{ position: "relative" }}>
        {icon && <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 15, pointerEvents: "none" }}>{icon}</span>}
        {type === "textarea" ? (
          <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3}
            onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
            style={{ width: "100%", padding: "12px 14px", background: C.surface, border: `1.5px solid ${focus ? C.primary : C.border}`, borderRadius: 10, color: C.text, fontSize: 14, fontFamily: font, resize: "vertical", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }} />
        ) : (
          <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
            onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
            style={{ width: "100%", padding: icon ? "11px 14px 11px 38px" : "11px 14px", background: C.surface, border: `1.5px solid ${focus ? C.primary : C.border}`, borderRadius: 10, color: C.text, fontSize: 14, fontFamily: font, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }} />
        )}
      </div>
    </div>
  );
}

export function SelectInput({ label, value, onChange, options, required }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}{required && <span style={{ color: C.primary }}> *</span>}</label>}
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{ width: "100%", padding: "11px 14px", background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 10, color: C.text, fontSize: 14, fontFamily: font, outline: "none", cursor: "pointer", appearance: "none" }}>
        {options.map(o => <option key={o.v} value={o.v} style={{ background: C.surface }}>{o.l}</option>)}
      </select>
    </div>
  );
}

export function Footer({ setPage }) {
  return (
    <footer style={{ borderTop: `1px solid ${C.border}`, padding: "32px 28px", marginTop: 40, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 18 }}>🏷️</span>
        <span style={{ fontWeight: 900, color: C.text, fontSize: 15 }}>sellmycoupon.in</span>
      </div>
      <div style={{ fontSize: 12, color: C.muted, textAlign: "center" }}>
         Secured by STRIPE
      </div>
      <div style={{ display: "flex", gap: 18 }}>
        {["Terms", "Privacy", "Support", "About"].map(l => <span key={l} onClick={() => setPage?.(l.toLowerCase())} style={{ fontSize: 12, color: C.muted, cursor: "pointer", transition: "color 0.2s" }} onMouseEnter={e => e.target.style.color = C.text} onMouseLeave={e => e.target.style.color = C.muted}>{l}</span>)}
      </div>
    </footer>
  );
}