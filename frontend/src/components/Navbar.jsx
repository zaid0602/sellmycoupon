import React from "react";
import { C, font } from "../theme";
import { Btn } from "./Shared";

export default function Navbar({ page, setPage, user, setUser, setAuthMode }) {
  return (
    <nav style={{
      background: `${C.surface}F0`, backdropFilter: "blur(20px)",
      borderBottom: `1px solid ${C.border}`,
      padding: "0 28px", height: 62, display: "flex", alignItems: "center",
      justifyContent: "space-between", position: "sticky", top: 0, zIndex: 200,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => setPage("home")}>
        <span style={{ fontSize: 22 }}>🏷️</span>
        <span style={{ fontSize: 18, fontWeight: 900, color: "#fff" }}>
          sellmycoupon.in
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {[["home", "🏠 Home"], ["browse", "🔍 Browse"]]
          .filter(([p]) => page !== "admin" || p === "home")
          .map(([p, label]) => (
            <button key={p} onClick={() => setPage(p)} style={{
              background: page === p ? `${C.primary}25` : "none",
              color: page === p ? "#fff" : C.muted,
              border: "none", padding: "7px 14px", borderRadius: 8,
              fontSize: 13, fontWeight: page === p ? 700 : 500,
              cursor: "pointer", fontFamily: font, transition: "all 0.18s",
            }}>{label}</button>
          ))}

        {user && (
          <>
            {page !== "admin" && (
              <button onClick={() => setPage("sell")} style={{
                background: `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`,
                color: "#ffffff", border: "none", padding: "7px 16px", borderRadius: 9,
                fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: font,
                textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                boxShadow: `0 4px 14px ${C.primary}40`,
              }}>+ Sell Coupon</button>
            )}

            {[["dashboard", "📊"], ["admin", "⚙️"]]
              .filter(([p]) => page !== "admin" || p === "admin")
              .map(([p, ico]) => (
                user.role === "admin" || user.admin || p !== "admin" ? (
                  <button key={p} onClick={() => setPage(p)} style={{
                    background: page === p ? `${C.teal}18` : "none",
                    color: page === p ? C.teal : C.muted,
                    border: "none", padding: "7px 12px", borderRadius: 8,
                    fontSize: 13, cursor: "pointer", fontFamily: font, fontWeight: 600,
                  }}>{ico}</button>
                ) : null
              ))}

            <div
              onClick={() => setPage("profile")}
              style={{ display: "flex", alignItems: "center", gap: 7, cursor: "pointer", marginLeft: 4 }}
            >
              <div style={{
                width: 30, height: 30, borderRadius: "50%",
                background: `linear-gradient(135deg, ${C.primary}, ${C.amber})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 800, color: "#fff",
              }}>{(user?.name || user?.username || "U")[0].toUpperCase()}</div>
              <span style={{ fontSize: 13, color: "#fff", fontWeight: 600 }}>Profile</span>
            </div>
          </>
        )}

        {!user && (
          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="ghost" size="sm" onClick={() => setAuthMode("login")}>Login</Btn>
            <Btn size="sm" onClick={() => setAuthMode("signup")}>Sign Up</Btn>
          </div>
        )}
      </div>
    </nav>
  );
}
