import React, { useState, useEffect } from "react";
import { C, font, fmt } from "../theme";
import { Btn } from "../components/Shared";

export default function ProfilePage({ user, setPage, setUser }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetch("/api/users/dashboard", {
      headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
      credentials: "include",
    })
      .then(async res => {
        let data;
        try { data = await res.json(); } catch(e) {}
        if (res.ok) setStats(data?.data);
      })
      .catch(err => console.error("Failed to load profile stats", err))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) return <div style={{ textAlign: "center", padding: 80, color: C.muted }}>🔒 Login to view profile</div>;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setPage("home");
  };

  const purchases = stats?.recentPurchases || [];

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 28px", fontFamily: font }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: C.text }}>My Profile</h1>
        <Btn variant="danger" size="sm" onClick={handleLogout}>🚪 Logout</Btn>
      </div>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, marginBottom: 36 }}>
        {/* Profile Info */}
        <div style={{ background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 20, padding: 32, textAlign: "center" }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%", margin: "0 auto 16px",
            background: `linear-gradient(135deg, ${C.primary}, ${C.amber})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 32, fontWeight: 900, color: "#fff",
          }}>
            {/* Safely defaults to "U" if name properties are missing */}
            {(user?.name || user?.username || "U")[0]?.toUpperCase() || "U"}
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 6 }}>{user?.name || user?.username || "User"}</h2>
          <p style={{ color: C.muted, fontSize: 14, marginBottom: 24 }}>{user?.email || "No email provided"}</p>
          <div style={{ background: `${C.primary}15`, color: C.primary, padding: "8px 16px", borderRadius: 12, display: "inline-block", fontSize: 13, fontWeight: 700 }}>
            {user?.admin ? "👑 Admin User" : "✅ Verified Member"}
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 20, padding: 24, flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ fontSize: 13, color: C.muted, marginBottom: 6, textTransform: "uppercase", fontWeight: 700 }}>Total Purchases</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: C.text }}>{loading ? "..." : purchases.length}</div>
          </div>
          <div style={{ background: `linear-gradient(135deg, ${C.primaryGlow}, ${C.amberGlow})`, border: `1.5px solid ${C.primary}33`, borderRadius: 20, padding: 24, flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ fontSize: 13, color: C.primary, marginBottom: 6, textTransform: "uppercase", fontWeight: 700 }}>Wallet Balance</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: C.text }}>{loading ? "..." : fmt(stats?.walletBalance || 0)}</div>
          </div>
        </div>
      </div>

      {/* Order History */}
      <h2 style={{ fontSize: 20, fontWeight: 800, color: C.text, marginBottom: 16 }}>Order History</h2>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 32, textAlign: "center", color: C.muted }}>Loading purchases...</div>
        ) : purchases.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🛒</div>
            <div style={{ color: C.text, fontWeight: 700, fontSize: 16 }}>No purchases yet</div>
            <div style={{ color: C.muted, fontSize: 14, marginTop: 4 }}>When you buy coupons, they will appear here.</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {purchases.map((order, i) => (
              <div key={order._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: i < purchases.length - 1 ? `1px solid ${C.border}` : "none", background: C.card }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <span style={{ fontSize: 32 }}>{order.coupon?.emoji || "🏷️"}</span>
                  <div>
                    <div style={{ fontWeight: 700, color: C.text, fontSize: 15, marginBottom: 4 }}>{order.coupon?.title || "Coupon"}</div>
                    <div style={{ fontSize: 12, color: C.muted }}>{new Date(order.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 800, color: C.primary, fontSize: 16, marginBottom: 4 }}>{fmt(order.amountPaid || order.coupon?.sellingPrice || 0)}</div>
                  <div style={{ fontSize: 12, color: C.success, fontWeight: 700 }}>Completed</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
