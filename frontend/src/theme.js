export const C = {
  bg: "#08090F", surface: "#10141F", card: "#181E2E", cardHover: "#1F2840",
  border: "#252D42", borderHover: "#3A4560",
  primary: "#4F46E5", primaryDark: "#3730A3", primaryGlow: "#4F46E525",
  amber: "#F5A623", amberGlow: "#F5A62320",
  teal: "#00C9A7", tealGlow: "#00C9A720",
  text: "#FFFFFF", muted: "#A1B0CC", faint: "#596A8A",
  success: "#22C55E", error: "#EF4444", warning: "#F59E0B",
};

export const font = "'Plus Jakarta Sans', 'DM Sans', system-ui, sans-serif";
export const mono = "'JetBrains Mono', 'Fira Code', monospace";

export const CATS = [
  { id: "all", label: "All", emoji: "✦" },
  { id: "food", label: "Food & Dining", emoji: "🍔" },
  { id: "shopping", label: "Shopping", emoji: "🛍️" },
  { id: "travel", label: "Travel", emoji: "✈️" },
  { id: "electronics", label: "Electronics", emoji: "📱" },
  { id: "entertainment", label: "Entertainment", emoji: "🎬" },
  { id: "beauty", label: "Beauty", emoji: "💄" },
  { id: "health", label: "Health & Fitness", emoji: "💪" },
];

export const COUPONS = [
  { id: 1, title: "20% Off Electronics", brand: "Amazon", cat: "electronics", emoji: "📦", faceValue: 1000, price: 750, expiresAt: "2025-09-30", type: "discount_code", views: 1420, desc: "20% off on electronics purchases above ₹5000. Valid on mobiles, laptops, and accessories.", seller: { name: "Rahul K.", rating: 4.8, sales: 23 } },
  { id: 2, title: "₹200 Off Order", brand: "Swiggy", cat: "food", emoji: "🍕", faceValue: 200, price: 120, expiresAt: "2025-06-15", type: "discount_code", views: 890, desc: "Flat ₹200 off on orders above ₹599. Valid on all restaurants. One-time use.", seller: { name: "Priya S.", rating: 4.9, sales: 45 } },
  { id: 3, title: "₹1500 Flight Discount", brand: "MakeMyTrip", cat: "travel", emoji: "✈️", faceValue: 1500, price: 900, expiresAt: "2025-08-31", type: "gift_card", views: 634, desc: "Flat ₹1500 off on domestic flight bookings above ₹8000.", seller: { name: "Amit V.", rating: 4.7, sales: 12 } },
  { id: 4, title: "30% Off Fashion", brand: "Myntra", cat: "shopping", emoji: "👗", faceValue: 600, price: 390, expiresAt: "2025-07-20", type: "discount_code", views: 778, desc: "30% off on all fashion and accessories. Min cart ₹1500.", seller: { name: "Sneha R.", rating: 4.6, sales: 34 } },
  { id: 5, title: "Gold 3-Month Pass", brand: "Zomato", cat: "food", emoji: "🍱", faceValue: 399, price: 250, expiresAt: "2025-07-01", type: "gift_card", views: 2103, desc: "Zomato Gold membership for 3 months — unlimited free deliveries, dine-out deals, and more.", seller: { name: "Karan M.", rating: 5.0, sales: 8 } },
  { id: 6, title: "SuperCoin ₹300 Credit", brand: "Flipkart", cat: "shopping", emoji: "🛒", faceValue: 300, price: 200, expiresAt: "2025-06-30", type: "gift_card", views: 445, desc: "₹300 SuperCoin credit on Flipkart. No minimum order value.", seller: { name: "Divya P.", rating: 4.5, sales: 19 } },
  { id: 7, title: "Gift Card ₹2000", brand: "Apple", cat: "electronics", emoji: "🍎", faceValue: 2000, price: 1700, expiresAt: "2025-12-31", type: "gift_card", views: 3210, desc: "Apple Store gift card worth ₹2000. Valid on apps, music, iCloud, and accessories.", seller: { name: "Ankit J.", rating: 4.9, sales: 7 } },
  { id: 8, title: "₹500 Show Voucher", brand: "BookMyShow", cat: "entertainment", emoji: "🎬", faceValue: 500, price: 380, expiresAt: "2025-09-30", type: "gift_card", views: 987, desc: "Gift voucher worth ₹500 for movies, events, plays, and sports.", seller: { name: "Neha K.", rating: 4.7, sales: 28 } },
  { id: 9, title: "25% Beauty Discount", brand: "Nykaa", cat: "beauty", emoji: "💄", faceValue: 400, price: 280, expiresAt: "2025-06-30", type: "discount_code", views: 721, desc: "25% off on all beauty products — makeup, skincare, haircare. Min cart ₹799.", seller: { name: "Riya G.", rating: 4.8, sales: 41 } },
  { id: 10, title: "3-Month Fitness Pass", brand: "Cult.fit", cat: "health", emoji: "🏋️", faceValue: 2999, price: 2200, expiresAt: "2025-08-15", type: "gift_card", views: 512, desc: "3-month live fitness pass — unlimited HIIT, yoga, dance, and more.", seller: { name: "Vikash T.", rating: 4.6, sales: 5 } },
  { id: 11, title: "₹100 Off x5 Rides", brand: "Uber", cat: "travel", emoji: "🚗", faceValue: 500, price: 350, expiresAt: "2025-06-01", type: "discount_code", views: 400, desc: "₹100 off on 5 consecutive Uber rides. Valid on UberGo and UberX.", seller: { name: "Rohit S.", rating: 4.4, sales: 16 } },
  { id: 12, title: "₹600 Shopping Credit", brand: "AJIO", cat: "shopping", emoji: "🧥", faceValue: 600, price: 420, expiresAt: "2025-07-15", type: "discount_code", views: 560, desc: "Flat ₹600 off on AJIO brands. Min cart value ₹2000.", seller: { name: "Meera L.", rating: 4.7, sales: 22 } },
];

export const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
export const savings = (face, price) => Math.round(((face - price) / face) * 100);
export const daysLeft = (d) => Math.max(0, Math.ceil((new Date(d) - new Date()) / 86400000));