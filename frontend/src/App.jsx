import React, { useState } from "react";
import { C, font } from "./theme";
import Navbar from "./components/Navbar";
import { Footer } from "./components/Shared";
import { AuthModal, PaymentModal } from "./components/Modals";
import HomePage from "./pages/Home";
import BrowsePage from "./pages/Browse";
import DetailPage from "./pages/Detail";
import SellPage from "./pages/Sell";
import DashboardPage from "./pages/Dashboard";
import AdminPage from "./pages/Admin";
import TermsPage from "./pages/Terms";
import PrivacyPage from "./pages/Privacy";
import SupportPage from "./pages/Support";
import AboutPage from "./pages/About";
import ProfilePage from "./pages/Profile";

export default function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [authMode, setAuthMode] = useState(null);
  const [coupon, setCoupon] = useState(null);
  const [payCoupon, setPayCoupon] = useState(null);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: font }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }
        select option { background: ${C.surface}; }
        ::placeholder { color: ${C.muted}; opacity: 0.8; }
        @keyframes spin { to { transform: rotate(360deg); } }
        button:hover { opacity: 0.92; }
      `}</style>

      <Navbar page={page} setPage={setPage} user={user} setUser={setUser} setAuthMode={setAuthMode} />

      <main>
        {page === "home" && <HomePage setPage={setPage} setCoupon={setCoupon} />}
        {page === "browse" && <BrowsePage setPage={setPage} setCoupon={setCoupon} />}
        {page === "detail" && <DetailPage coupon={coupon} setPage={setPage} user={user} setAuthMode={setAuthMode} setPayCoupon={setPayCoupon} />}
        {page === "sell" && <SellPage user={user} setAuthMode={setAuthMode} setPage={setPage} />}
        {page === "dashboard" && <DashboardPage user={user} />}
        {page === "admin" && <AdminPage user={user} />}
        {page === "terms" && <TermsPage />}
        {page === "privacy" && <PrivacyPage />}
        {page === "support" && <SupportPage />}
        {page === "about" && <AboutPage />}
        {page === "profile" && <ProfilePage user={user} setPage={setPage} setUser={setUser} />}
      </main>

      <Footer setPage={setPage} />

      {authMode && <AuthModal mode={authMode} onClose={() => setAuthMode(null)} onLogin={u => { setUser(u); setAuthMode(null); }} />}
      {payCoupon && <PaymentModal coupon={payCoupon} onClose={() => setPayCoupon(null)} />}
    </div>
  );
}
