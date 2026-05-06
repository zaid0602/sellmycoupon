import React, { useState, useEffect } from "react";
import { C, fmt, font } from "../theme";
import { Pill, Btn } from "../components/Shared";

export default function AdminPage({ user }) {
  const [tab, setTab] = useState("coupons");
  const [coupons, setCoupons] = useState([]);
  const [orders, setOrders] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    const headers = { "Authorization": `Bearer ${localStorage.getItem("token")}` };
    Promise.all([
      fetch("/api/admin/coupons", { headers }).then(r => r.json()),
      fetch("/api/admin/orders", { headers }).then(r => r.json()),
      fetch("/api/admin/withdrawals", { headers }).then(r => r.json()),
      fetch("/api/admin/stats", { headers }).then(r => r.json())
    ]).then(([c, o, w, s]) => {
      if (c.success) setCoupons(c.data);
      if (o.success) setOrders(o.data);
      if (w.success) setWithdrawals(w.data);
      if (s.success) setStats(s.data);
      setLoading(false);
    }).catch(err => console.error("Admin load error", err));
  };

  useEffect(() => {
    if (user?.role === "admin" || user?.admin) loadData();
  }, [user]);

  if (user?.role !== "admin" && !user?.admin) return <div style={{ textAlign: "center", padding: 80 }}><div style={{ fontSize: 48 }}>🚫</div><p style={{ color: C.error, fontWeight: 700, marginTop: 16 }}>Access Denied</p></div>;

  const handleRemoveCoupon = async (id) => {
    if (!window.confirm("Remove this coupon?")) return;
    const res = await fetch(`/api/admin/coupons/${id}`, { method: "DELETE", headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } });
    const data = await res.json();
    if (data.success) loadData(); else alert(data.error || "Failed to remove");
  };

  const handleRefund = async (id) => {
    const reason = window.prompt("Enter reason for refunding the buyer:");
    if (!reason) return;
    const res = await fetch(`/api/admin/orders/${id}/refund`, { method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}` }, body: JSON.stringify({ reason }) });
    const data = await res.json();
    if (data.success) { alert("Refund processed!"); loadData(); } else alert(data.error || "Refund failed");
  };

  const handleWithdrawal = async (id, action) => {
    if (!window.confirm(`Are you sure you want to ${action} this payment?`)) return;
    const res = await fetch(`/api/admin/withdrawals/${id}/${action}`, { method: "PUT", headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } });
    const data = await res.json();
    if (data.success) loadData(); else alert(data.error || `Failed to ${action}`);
  };

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "36px 28px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div><h1 style={{ fontSize: 26, fontWeight: 900, color: C.text }}>⚙️ Admin Panel</h1><p style={{ color: C.muted, fontSize: 14 }}>sellmycoupon.in management console</p></div>
        <Pill color={C.amber} size="md">👑 Super Admin</Pill>
      </div>

      <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${C.border}`, marginBottom: 22 }}>
        {[["coupons", "🏷️ Listed Coupons"], ["disputes", "⚠️ Disputes"], ["withdrawals", "🏦 Pending Payments"], ["revenue", "💰 Revenue"]].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)} style={{ background: "none", border: "none", borderBottom: `2px solid ${tab === t ? C.primary : "transparent"}`, padding: "10px 20px", color: tab === t ? "#fff" : C.muted, fontWeight: tab === t ? 700 : 500, fontSize: 14, cursor: "pointer", fontFamily: font, marginBottom: -1, transition: "all 0.18s" }}>{l}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: C.muted }}>Loading admin data...</div>
      ) : (
        <>
          {tab === "coupons" && coupons.map(c => (
            <div key={c._id || c.id} style={{ background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 12, padding: 16, marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 22 }}>{c.emoji || "🏷️"}</span>
                <div><div style={{ fontWeight: 700, color: C.text, fontSize: 14 }}>{c.title}</div><div style={{ fontSize: 12, color: C.muted }}>by {c.seller?.name || c.seller?.username || "Unknown"} · {c.category || c.cat} · {fmt(c.sellingPrice || c.price || 0)}</div></div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Pill color={c.status === "active" ? C.success : C.warning}>{c.status}</Pill>
                <Btn variant="danger" size="sm" onClick={() => handleRemoveCoupon(c._id)}>Remove</Btn>
              </div>
            </div>
          ))}

          {tab === "disputes" && orders.filter(o => o.status === "completed" || o.status === "refunded").map(o => (
            <div key={o._id} style={{ background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 12, padding: 16, marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 22 }}>🛒</span>
                <div>
                  <div style={{ fontWeight: 700, color: C.text, fontSize: 14 }}>Order {o._id.slice(-6).toUpperCase()} · {o.coupon?.title}</div>
                  <div style={{ fontSize: 12, color: C.muted }}>Buyer: {o.buyer?.name || "Unknown"} | Seller: {o.seller?.name || "Unknown"}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontWeight: 800, color: C.primary, fontSize: 15 }}>{fmt(o.amountPaid)}</span>
                <Pill color={o.status === "refunded" ? C.error : C.success}>{o.status}</Pill>
                {o.status === "completed" && <Btn variant="danger" size="sm" onClick={() => handleRefund(o._id)}>Refund Buyer</Btn>}
              </div>
            </div>
          ))}

          {tab === "withdrawals" && withdrawals.map(w => (
            <div key={w._id} style={{ background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 12, padding: 16, marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 22 }}>🏦</span>
                <div>
                  <div style={{ fontWeight: 700, color: C.text, fontSize: 14 }}>{w.user?.name || "Unknown"}</div>
                  <div style={{ fontSize: 12, color: C.muted }}>{w.description}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontWeight: 800, color: C.primary, fontSize: 15, marginRight: 10 }}>{fmt(w.amount)}</span>
                <Btn variant="success" size="sm" onClick={() => handleWithdrawal(w._id, "approve")}>Approve</Btn>
                <Btn variant="danger" size="sm" onClick={() => handleWithdrawal(w._id, "reject")}>Reject</Btn>
              </div>
            </div>
          ))}
          {tab === "withdrawals" && withdrawals.length === 0 && <div style={{ color: C.muted, textAlign: "center", padding: 20 }}>No pending withdrawal requests.</div>}

          {tab === "revenue" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div style={{ background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 14, padding: 22 }}>
                <div style={{ fontSize: 13, color: C.muted, marginBottom: 8 }}>Gross App Revenue (30d)</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: C.text }}>{fmt(stats?.revenue?.gross30d || 0)}</div>
              </div>
              <div style={{ background: `${C.success}10`, border: `1.5px solid ${C.success}33`, borderRadius: 14, padding: 22 }}>
                <div style={{ fontSize: 13, color: C.success, marginBottom: 8 }}>Platform Commission (30d)</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: C.success }}>{fmt(stats?.revenue?.commission30d || 0)}</div>
              </div>
              <div style={{ background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 14, padding: 22 }}>
                <div style={{ fontSize: 13, color: C.muted, marginBottom: 8 }}>Total Paid Orders (30d)</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: C.text }}>{stats?.orders?.paid30d || 0}</div>
              </div>
              <div style={{ background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 14, padding: 22 }}>
                <div style={{ fontSize: 13, color: C.muted, marginBottom: 8 }}>Active Listings</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: C.text }}>{stats?.coupons?.active || 0}</div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}