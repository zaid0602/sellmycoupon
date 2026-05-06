# SellMyCoupon - Modern Coupon Buying & Selling Platform

A modern, clean, and professional mobile-first web application UI built with React, TypeScript, and Tailwind CSS.

## 🎨 Design Features

### Visual Design
- **Mobile-first responsive layout** (390px base width)
- **Modern minimal design** with soft shadows and rounded corners (12-16px radius)
- **Light theme** with white background
- **Blue-Purple gradient** primary colors
- **Inter/Poppins typography** for clean, professional appearance
- **8px grid system** for consistent spacing

### Color Palette
- **Primary**: Blue to Purple gradient (`from-blue-600 to-purple-600`)
- **Secondary**: Light gray (`bg-gray-100`)
- **Accents**: Gradient overlays and soft shadows

## 📱 Page Structure

### 1. **Navbar/Header** (Fixed Top)
- Centered logo icon with gradient background
- Website name: "SellMyCoupon"
- Tagline: "Buy & Sell Coupons Securely"
- Notification bell icon with unread indicator
- Fixed positioning with shadow

### 2. **Home Page** (`/`)
- **Search Bar**: "Search coupons (Amazon, Flipkart, Myntra...)"
- **Filter Chips**: Electronics, Fashion, Food, Travel
- **Coupon Cards** displaying:
  - Brand logo/icon
  - Discount percentage (big & bold)
  - Short description
  - Expiry date
  - Price in ₹
  - "Buy Now" button with gradient background

### 3. **Add Coupon Page** (`/add`)
- **Form Fields**:
  - Brand Name input
  - Discount percentage
  - Coupon Code
  - Expiry Date picker
  - Selling Price
  - Description textarea
- Large "Submit Coupon" button
- Back navigation

### 4. **Dashboard Page** (`/dashboard`)
- **Key Metrics Cards**:
  - Total Coupons Listed
  - Coupons Sold
  - Total Earnings
- **My Listed Coupons Section** with:
  - Coupon name and discount
  - Listing date
  - Status badge (Active/Sold/Expired)
- Action buttons: "View Analytics" and "Add New Coupon"

### 5. **Profile Page** (`/profile`)
- **Profile Card**:
  - Avatar circle with gradient
  - Name, email, phone
  - Edit button
  - "Edit Profile" and "Logout" buttons
- **Quick Stats**:
  - Total Purchases
  - Total Savings
  - Member Since
- **Order History**:
  - List of past purchases
  - Coupon name, price, purchase date, status
- **Settings Section**:
  - Account Security
  - Settings
  - Help & Support
  - Delete Account button

### 6. **Bottom Navigation** (Fixed Footer)
- 4 equally spaced navigation items with icons:
  - 🏠 Home
  - ➕ Add
  - 📊 Dashboard
  - 👤 Profile
- Active tab highlighted in gradient
- Inactive tabs in gray
- Icons above labels
- Mobile app style with rounded top corners

## 🛠️ Tech Stack

- **Frontend Framework**: React 18+ with JSX
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.2+
- **Build Tool**: Vite 8.0+
- **Icons**: Lucide React (20+ icon components)
- **Routing**: React Router DOM 7.14+
- **Fonts**: Inter, Poppins (Google Fonts)

## 📦 Project Structure

```
src/
├── components/
│   ├── Navbar.tsx          # Fixed top navbar with logo & notifications
│   ├── BottomNav.tsx       # Fixed bottom navigation bar
│   ├── CouponCard.tsx      # Reusable coupon display card
│   └── FilterChip.tsx      # Filter category chips
├── pages/
│   ├── Home.tsx            # Home page with search & coupons
│   ├── AddCoupon.tsx       # Add new coupon form
│   ├── Dashboard.tsx       # User dashboard & stats
│   └── Profile.tsx         # User profile & settings
├── App.tsx                 # Main app with routing
├── main.tsx                # React entry point
└── style.css               # Global Tailwind CSS
```

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
# Server runs on http://localhost:5174/ (or 5173 if available)
```

### Build for Production

```bash
npm run build
# Creates optimized build in `dist/` folder
```

### Preview Production Build

```bash
npm run preview
```

## 🎯 Key Components

### CouponCard Component
- Displays individual coupon with brand, discount, price, and CTA
- Gradient backgrounds and hover effects
- Responsive padding and spacing
- Props: `id`, `brandName`, `discount`, `description`, `expiryDate`, `price`, `logoUrl`

### FilterChip Component
- Toggleable filter buttons with active/inactive states
- Smooth transitions and gradient highlights
- Props: `label`, `isActive`, `onClick`

### Navbar Component
- Fixed positioning with shadow
- Centered branding with logo emoji
- Notification indicator
- Responsive padding

### BottomNav Component
- Fixed bottom navigation with React Router integration
- Active state highlighting with gradient
- Icon + label layout
- Props: `activeNav`, `setActiveNav`

## 💡 Design System

### Spacing (8px grid)
- `p-2` = 8px, `p-4` = 16px, `p-6` = 24px, etc.
- Consistent padding around all components

### Typography
- **Headings**: Poppins, bold (font-bold)
- **Body**: Inter, medium (font-medium)
- **Labels**: Inter, semibold (font-semibold)
- 16px base font size on mobile

### Shadows
- Soft shadows: `shadow-sm`, `shadow-md`, `shadow-lg`
- Hover effects with smooth transitions

### Border Radius
- Small: `rounded-lg` = 8px
- Medium: `rounded-xl` = 12px
- Large: `rounded-2xl` = 16px

## 🎨 Customization

### Change Primary Colors
Edit `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: {
        600: '#your-color'
      }
    }
  }
}
```

### Update Fonts
Modify Google Fonts import in `src/style.css`

### Adjust Spacing
Use Tailwind's `px-*` and `py-*` utilities throughout components

## 📱 Responsive Design

- **Mobile-First Approach**: Designed for 390px width
- **Tailwind Breakpoints**: `md:` (768px), `lg:` (1024px), `xl:` (1280px)
- **Fixed Headers/Footers**: Navbar (top) and BottomNav (bottom) stay visible
- **Content Padding**: `pb-24` (bottom nav) and `pt-32` (top navbar) for content spacing

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 5173/5174 |
| `npm run build` | Build optimized production bundle |
| `npm run preview` | Preview the production build locally |

## 📦 Dependencies

```json
{
  "react": "^latest",
  "react-dom": "^latest",
  "react-router-dom": "^7.14.1",
  "lucide-react": "^1.8.0",
  "tailwindcss": "^4.2.2",
  "vite": "^8.0.4"
}
```

## ✨ Features Implemented

✅ Fully responsive mobile layout (390px)  
✅ Fixed navbar with branding and notifications  
✅ Fixed bottom navigation (4 tabs)  
✅ Search functionality UI  
✅ Category filter chips  
✅ Coupon card component with brand info  
✅ Add coupon form with validation fields  
✅ Dashboard with metric cards  
✅ User profile page with settings  
✅ Order history display  
✅ Smooth transitions and hover effects  
✅ Blue-Purple gradient color scheme  
✅ TypeScript type safety  
✅ React Router navigation  
✅ Lucide React icons  

## 🎯 Mock Data

Each page includes sample mock data:
- **Home**: 6 coupon examples (Amazon, Flipkart, Myntra, Swiggy, MakeMyTrip, Netflix)
- **Dashboard**: 4 listed coupons with different statuses
- **Profile**: Sample user data with order history

## 🚀 Next Steps for Production

1. **Backend Integration**: Connect to API endpoints for real data
2. **Authentication**: Add login/signup pages with protected routes
3. **State Management**: Implement Redux or Context API
4. **API Calls**: Replace mock data with real backend calls
5. **Error Handling**: Add error boundaries and error states
6. **Loading States**: Add skeleton loaders during data fetching
7. **Testing**: Add Jest and React Testing Library tests
8. **Deployment**: Deploy to Vercel, Netlify, or your preferred host

## 📋 Component Props & Usage

### CouponCard
```tsx
<CouponCard
  id="1"
  brandName="Amazon"
  discount={40}
  description="40% off on Electronics"
  expiryDate="30 Apr"
  price={199}
  logoUrl="📱"
/>
```

### FilterChip
```tsx
<FilterChip
  label="Electronics"
  isActive={true}
  onClick={() => setCategory('Electronics')}
/>
```

### BottomNav
```tsx
<BottomNav
  activeNav={activeNav}
  setActiveNav={setActiveNav}
/>
```

## 📝 License

This project is open source and available for commercial or personal use.

---

**Created with React + TypeScript + Tailwind CSS ✨**  
**Live at http://localhost:5174/**
