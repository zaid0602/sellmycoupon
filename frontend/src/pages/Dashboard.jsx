import React, { useState, useEffect } from "react";
import { C, fmt, font } from "../theme";
import { Pill, Btn } from "../components/Shared";

export default function DashboardPage({ user }) {
  const [tab, setTab] = useState("listings");
  const [listings, setListings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loadingListings, setLoadingListings] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [dashboardError, setDashboardError] = useState("");
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [viewingCode, setViewingCode] = useState(null);
  
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawAmt, setWithdrawAmt] = useState("");
  const [bankDetails, setBankDetails] = useState("");
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoadingListings(true);
    setDashboardError("");

    fetch("/api/coupons/my", {
      headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
      credentials: "include",
    })
      .then(async (res) => {
        let data;
        try { data = await res.json(); } catch (err) {}
        if (!res.ok) throw new Error(data?.error || data?.message || `Server error: ${res.status} ${res.statusText}`);
        setListings(data?.data || []);
      })
      .catch((err) => {
        console.error("Dashboard load error", err);
        setDashboardError(err.message);
      })
      .finally(() => setLoadingListings(false));
  }, [user]);

  useEffect(() => {
    if (!user) return;
    setLoadingStats(true);
    setDashboardError("");

    fetch("/api/users/dashboard", {
      headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
      credentials: "include",
    })
      .then(async (res) => {
        let data;
        try { data = await res.json(); } catch (err) {}
        if (!res.ok) throw new Error(data?.error || data?.message || `Server error: ${res.status} ${res.statusText}`);
        setStats(data?.data || null);
      })
      .catch((err) => {
        console.error("Dashboard stats load error", err);
        setDashboardError(err.message);
      })
      .finally(() => setLoadingStats(false));
  }, [user]);

  const handleRemove = async (id) => {
    if (!window.confirm("Are you sure you want to remove this listing?")) return;
    
    try {
      const res = await fetch(`/api/coupons/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
        credentials: "include",
      });
      let data;
      try { data = await res.json(); } catch (err) {}
      if (!res.ok) throw new Error(data?.error || data?.message || "Failed to remove coupon");
      
      setListings((prev) => prev.filter((c) => c._id !== id && c.id !== id));
      setStats((prev) => prev ? { ...prev, activeListings: Math.max(0, (prev.activeListings || 1) - 1) } : prev);
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const id = editingCoupon._id || editingCoupon.id;
      const res = await fetch(`/api/coupons/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        credentials: "include",
        body: JSON.stringify({
          title: editingCoupon.title,
          brand: editingCoupon.brand,
          price: editingCoupon.sellingPrice || editingCoupon.price,
          sellingPrice: editingCoupon.sellingPrice || editingCoupon.price,
          faceValue: editingCoupon.faceValue,
        }),
      });
      let data;
      try { data = await res.json(); } catch (err) {}
      if (!res.ok) throw new Error(data?.error || data?.message || "Failed to update listing");
      
      setListings((prev) => prev.map((c) => ((c._id || c.id) === id ? { ...c, ...editingCoupon } : c)));
      setEditingCoupon(null);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setIsWithdrawing(true);
    try {
      const res = await fetch("/api/wallet/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ amount: Number(withdrawAmt), bankDetails })
      });
      let data;
      try { data = await res.json(); } catch(err) {}
      if (!res.ok) throw new Error(data?.error || data?.message || "Failed to request withdrawal");
      
      alert("Withdrawal requested successfully!");
      setShowWithdraw(false);
      setWithdrawAmt("");
      setBankDetails("");
      setStats(prev => prev ? { ...prev, walletBalance: Math.max(0, prev.walletBalance - Number(withdrawAmt)) } : prev);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setIsWithdrawing(false);
    }
  };

  const handleOpenHistory = async () => {
    setShowHistory(true);
    setLoadingHistory(true);
    try {
      const res = await fetch("/api/wallet/transactions", { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } });
      let data;
      try { data = await res.json(); } catch(err) {}
      if (!res.ok) throw new Error(data?.error || data?.message || "Failed to fetch history");
      setTransactions(data?.data || []);
    } catch (err) {
      alert("Error: " + err.message);
    } finally { setLoadingHistory(false); }
  };

  if (!user) return <div style={{ textAlign: "center", padding: 80, color: C.muted }}>🔒 Login to view dashboard</div>;

  const myListings = listings;
  const purchases = stats?.recentPurchases || [];
  const loading = loadingListings || loadingStats;

  return (
    <div style={{ maxWidth: 920, margin: "0 auto", padding: "36px 28px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: C.text }}>Welcome, {user?.name || user?.username || "User"}! 👋</h1>
          <p style={{ color: C.muted, fontSize: 14 }}>Manage your listings and earnings</p>
        </div>
        <Pill color={user.admin ? C.amber : C.teal} size="md">{user.admin ? "👑 Admin" : "✅ Verified"}</Pill>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28 }}>
        {loading ? (
          <div style={{ gridColumn: "1 / -1", padding: 20, background: C.card, borderRadius: 16, color: C.muted }}>Loading dashboard stats...</div>
        ) : dashboardError ? (
          <div style={{ gridColumn: "1 / -1", padding: 20, background: C.card, borderRadius: 16, color: C.error }}>{dashboardError}</div>
        ) : (
          [["📋", "Active Listings", stats?.activeListings ?? "0", C.primary], ["💰", "Completed Sales", stats?.completedSales ?? "0", C.success], ["🏦", "Total Earned", stats?.totalEarned ? `₹${stats.totalEarned}` : "₹0", C.amber], ["⭐", "Rating", stats?.averageRating != null ? Number(stats.averageRating).toFixed(1) : "—", C.teal]].map(([ico, l, v, col]) => (
            <div key={l} style={{ background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{ico}</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: col }}>{v}</div>
              <div style={{ fontSize: 12, color: C.muted }}>{l}</div>
            </div>
          ))
        )}
      </div>

      {/* Wallet */}
      <div style={{ background: `linear-gradient(150deg, ${C.primaryGlow}, ${C.amberGlow})`, border: `1.5px solid ${C.primary}33`, borderRadius: 18, padding: 24, marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 4 }}>Wallet Balance</div>
            <div style={{ fontSize: 38, fontWeight: 900, color: C.primary }}>₹{stats?.walletBalance ?? "0"}</div>
            <div style={{ fontSize: 12, color: C.muted }}>Available for withdrawal</div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn variant="white" onClick={() => setShowWithdraw(true)}>Withdraw to Bank</Btn>
            <Btn variant="ghost" onClick={handleOpenHistory}>History</Btn>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${C.border}`, marginBottom: 22 }}>
        {[["listings", "📋 My Listings"], ["purchases", "🛒 Purchases"], ["analytics", "📊 Analytics"]].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)} style={{ background: "none", border: "none", borderBottom: `2px solid ${tab === t ? C.primary : "transparent"}`, padding: "10px 20px", color: tab === t ? "#fff" : C.muted, fontWeight: tab === t ? 700 : 500, fontSize: 14, cursor: "pointer", fontFamily: font, marginBottom: -1, transition: "all 0.18s" }}>{l}</button>
        ))}
      </div>

      {tab === "listings" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
          {loadingListings ? (
            <div style={{ gridColumn: "1 / -1", padding: 20, background: C.card, borderRadius: 16, color: C.muted }}>Loading your listings...</div>
          ) : dashboardError ? (
            <div style={{ gridColumn: "1 / -1", padding: 20, background: C.card, borderRadius: 16, color: C.error }}>{dashboardError}</div>
          ) : myListings.length === 0 ? (
            <div style={{ gridColumn: "1 / -1", padding: 20, background: C.card, borderRadius: 16, color: C.muted }}>You have no listed coupons yet.</div>
          ) : (
            myListings.map(c => (
              <div key={c._id} style={{ background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span>{c.emoji || "🏷️"}</span><span style={{ fontWeight: 700, color: C.text, fontSize: 14 }}>{c.brand}</span></div>
                  <Pill color={c.status === "active" ? C.success : C.warning}>{c.status?.replace(/\b\w/g, l => l.toUpperCase())}</Pill>
                </div>
                <div style={{ fontSize: 13, color: C.muted, marginBottom: 14 }}>{c.title}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 800, color: C.primary, fontSize: 16 }}>{fmt(c.sellingPrice || c.price || 0)}</span>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Btn variant="ghost" size="sm" onClick={() => setEditingCoupon({ ...c })}>Edit</Btn>
                    <Btn variant="danger" size="sm" onClick={() => handleRemove(c._id || c.id)}>Remove</Btn>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === "purchases" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {loading ? (
            <div style={{ padding: 20, background: C.card, borderRadius: 16, color: C.muted }}>Loading purchases...</div>
          ) : dashboardError ? (
            <div style={{ padding: 20, background: C.card, borderRadius: 16, color: C.error }}>{dashboardError}</div>
          ) : purchases.length === 0 ? (
            <div style={{ padding: 20, background: C.card, borderRadius: 16, color: C.muted }}>No recent purchases to show.</div>
          ) : (
            purchases.map((order) => (
              <div key={order._id} style={{ background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 14, padding: 18, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ fontSize: 28 }}>{order.coupon?.emoji || "🏷️"}</span>
                  <div>
                    <div style={{ fontWeight: 700, color: C.text, fontSize: 14 }}>{order.coupon?.title || "Coupon"}</div>
                    <div style={{ fontSize: 12, color: C.muted }}>Purchased · {new Date(order.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontWeight: 800, color: C.primary }}>{fmt(order.amountPaid || order.coupon?.sellingPrice || 0)}</span>
                  <Btn variant="outline" size="sm" onClick={() => {
                    alert("To dispute this purchase, your email client will open. Please attach screenshots proving the code is invalid.");
                    window.location.href = `mailto:disputes@sellmycoupon.in?subject=Dispute for Order ${order._id}&body=Order ID: ${order._id}%0A%0AExplanation of issue:%0A%0A[Please attach your proof/screenshots here]`;
                  }}>Support</Btn>
                  <Btn variant="success" size="sm" onClick={() => setViewingCode(order.couponCode || order.coupon?.couponCode || "CODE-HIDDEN-BY-BACKEND")}>View Code</Btn>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === "analytics" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {loading ? (
            <div style={{ gridColumn: "1 / -1", padding: 20, background: C.card, borderRadius: 16, color: C.muted }}>Loading analytics...</div>
          ) : dashboardError ? (
            <div style={{ gridColumn: "1 / -1", padding: 20, background: C.card, borderRadius: 16, color: C.error }}>{dashboardError}</div>
          ) : (
            [
              ["Total Views", stats?.totalViews ?? 0, "All time views"], 
              ["Conversion Rate", `${stats?.conversionRate ?? 0}%`, "Sales per view"], 
              ["Avg Sale Price", fmt(stats?.avgSalePrice ?? 0), "Average sold price"], 
              ["Pending Payouts", fmt(stats?.pendingPayouts ?? 0), "Awaiting processing"]
            ].map(([l, v, t]) => (
              <div key={l} style={{ background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 14, padding: 22 }}>
                <div style={{ fontSize: 13, color: C.muted, marginBottom: 8 }}>{l}</div>
                <div style={{ fontSize: 26, fontWeight: 900, color: C.text }}>{v}</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 5 }}>{t}</div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Edit Coupon Modal */}
      {editingCoupon && (
        <div style={{ position: "fixed", inset: 0, background: "#000000BB", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={() => setEditingCoupon(null)}>
          <div style={{ background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 24, padding: 32, width: "100%", maxWidth: 450, position: "relative" }} onClick={e => e.stopPropagation()}>
            <button type="button" onClick={() => setEditingCoupon(null)} style={{ position: "absolute", top: 16, right: 18, background: "none", border: "none", color: C.muted, fontSize: 20, cursor: "pointer" }}>✕</button>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: C.text, marginBottom: 20 }}>Edit Listing</h2>
            <form onSubmit={handleEditSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 6, textTransform: "uppercase" }}>Title</label>
                <input value={editingCoupon.title || ""} onChange={e => setEditingCoupon({...editingCoupon, title: e.target.value})} style={{ width: "100%", padding: "10px 14px", background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 10, color: C.text, outline: "none", fontFamily: font }} required />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 6, textTransform: "uppercase" }}>Brand</label>
                <input value={editingCoupon.brand || ""} onChange={e => setEditingCoupon({...editingCoupon, brand: e.target.value})} style={{ width: "100%", padding: "10px 14px", background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 10, color: C.text, outline: "none", fontFamily: font }} required />
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 6, textTransform: "uppercase" }}>Face Value (₹)</label>
                  <input type="number" value={editingCoupon.faceValue || ""} onChange={e => setEditingCoupon({...editingCoupon, faceValue: Number(e.target.value)})} style={{ width: "100%", padding: "10px 14px", background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 10, color: C.text, outline: "none", fontFamily: font }} required />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 6, textTransform: "uppercase" }}>Selling Price (₹)</label>
                  <input type="number" value={editingCoupon.sellingPrice || editingCoupon.price || ""} onChange={e => setEditingCoupon({...editingCoupon, sellingPrice: Number(e.target.value), price: Number(e.target.value)})} style={{ width: "100%", padding: "10px 14px", background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 10, color: C.text, outline: "none", fontFamily: font }} required />
                </div>
              </div>
              <Btn type="submit" disabled={isSaving} full>{isSaving ? "Saving..." : "Save Changes"}</Btn>
            </form>
          </div>
        </div>
      )}

      {/* View Code Modal */}
      {viewingCode && (
        <div style={{ position: "fixed", inset: 0, background: "#000000BB", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={() => setViewingCode(null)}>
          <div style={{ background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 24, padding: 32, width: "100%", maxWidth: 400, position: "relative", textAlign: "center" }} onClick={e => e.stopPropagation()}>
            <button type="button" onClick={() => setViewingCode(null)} style={{ position: "absolute", top: 16, right: 18, background: "none", border: "none", color: C.muted, fontSize: 20, cursor: "pointer" }}>✕</button>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: C.text, marginBottom: 8 }}>Your Coupon Code</h2>
            <p style={{ fontSize: 14, color: C.muted, marginBottom: 24 }}>Here is the code you purchased. Enjoy your savings!</p>
            <div style={{ background: `${C.success}12`, border: `1.5px dashed ${C.success}55`, borderRadius: 16, padding: "20px", fontSize: 28, fontWeight: 900, color: C.success, letterSpacing: "0.1em", fontFamily: "monospace", marginBottom: 24 }}>{viewingCode}</div>
            <Btn full onClick={() => setViewingCode(null)}>Done</Btn>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdraw && (
        <div style={{ position: "fixed", inset: 0, background: "#000000BB", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={() => setShowWithdraw(false)}>
          <div style={{ background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 24, padding: 32, width: "100%", maxWidth: 400, position: "relative" }} onClick={e => e.stopPropagation()}>
            <button type="button" onClick={() => setShowWithdraw(false)} style={{ position: "absolute", top: 16, right: 18, background: "none", border: "none", color: C.muted, fontSize: 20, cursor: "pointer" }}>✕</button>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: C.text, marginBottom: 8 }}>Withdraw Funds</h2>
            <p style={{ color: C.muted, fontSize: 14, marginBottom: 20 }}>Available Balance: <strong style={{ color: C.primary }}>{fmt(stats?.walletBalance || 0)}</strong></p>
            <form onSubmit={handleWithdraw} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 6, textTransform: "uppercase" }}>Amount (₹)</label>
                <input type="number" value={withdrawAmt} onChange={e => setWithdrawAmt(e.target.value)} max={stats?.walletBalance || 0} style={{ width: "100%", padding: "10px 14px", background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 10, color: C.text, outline: "none", fontFamily: font }} required />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 6, textTransform: "uppercase" }}>Bank Details / UPI ID</label>
                <input type="text" value={bankDetails} onChange={e => setBankDetails(e.target.value)} placeholder="e.g. user@upi or AC: 1234, IFSC: ABCD" style={{ width: "100%", padding: "10px 14px", background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 10, color: C.text, outline: "none", fontFamily: font }} required />
              </div>
              <Btn type="submit" disabled={isWithdrawing || !withdrawAmt || withdrawAmt <= 0 || withdrawAmt > (stats?.walletBalance || 0)} full>{isWithdrawing ? "Processing..." : "Request Withdrawal"}</Btn>
            </form>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistory && (
        <div style={{ position: "fixed", inset: 0, background: "#000000BB", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={() => setShowHistory(false)}>
          <div style={{ background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 24, padding: 32, width: "100%", maxWidth: 500, maxHeight: "80vh", display: "flex", flexDirection: "column", position: "relative" }} onClick={e => e.stopPropagation()}>
            <button type="button" onClick={() => setShowHistory(false)} style={{ position: "absolute", top: 16, right: 18, background: "none", border: "none", color: C.muted, fontSize: 20, cursor: "pointer" }}>✕</button>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: C.text, marginBottom: 20 }}>Wallet History</h2>
            <div style={{ overflowY: "auto", flex: 1, paddingRight: 8, display: "flex", flexDirection: "column", gap: 12 }}>
              {loadingHistory ? (
                <div style={{ color: C.muted, textAlign: "center", padding: 20 }}>Loading transactions...</div>
              ) : transactions.length === 0 ? (
                <div style={{ color: C.muted, textAlign: "center", padding: 20 }}>No transactions yet.</div>
              ) : (
                transactions.map(t => (
                  <div key={t._id || Math.random()} style={{ background: C.surface, padding: 16, borderRadius: 14, border: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: 700, color: C.text, fontSize: 14, marginBottom: 4 }}>{t.description || (t.type === "credit" ? "Credit" : "Debit")}</div>
                      <div style={{ fontSize: 12, color: C.muted }}>{new Date(t.createdAt).toLocaleDateString()} · {new Date(t.createdAt).toLocaleTimeString()}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 900, color: t.type === "credit" ? C.success : C.error, fontSize: 16 }}>{t.type === "credit" ? "+" : "-"}{fmt(t.amount)}</div>
                      <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>Bal: {fmt(t.balanceAfter || 0)}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
