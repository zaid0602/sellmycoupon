import React from "react";
import { C, font } from "../theme";

export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "60px 28px", fontFamily: font }}>
      <h1 style={{ fontSize: 32, fontWeight: 900, color: C.text, marginBottom: 24 }}>Privacy Policy</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 24, color: C.muted, lineHeight: 1.7, fontSize: 15 }}>
        <p>Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.</p>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8 }}>1. Information We Collect</h2>
          <p>We collect information you provide directly, such as your name, email, and payment details when you register or perform transactions.</p>
        </div>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8 }}>2. How We Use Information</h2>
          <p>Your data is used to facilitate transactions, provide customer support, and improve the platform's security and user experience.</p>
        </div>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8 }}>3. Data Security</h2>
          <p>We implement strict security measures including encryption to ensure your personal and payment data is kept safe. We do not store full credit card details on our servers.</p>
        </div>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8 }}>4. Third-Party Services</h2>
          <p>We use Stripe for payment processing. Your payment data is handled according to Stripe's privacy policies.</p>
        </div>
      </div>
    </div>
  );
}