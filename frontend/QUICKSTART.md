# Quick Start Guide - SellMyCoupon Platform

## 🚀 Getting Started in 2 Minutes

### Step 1: Install & Run
```bash
cd frontend
npm install
npm run dev
```

### Step 2: Open in Browser
```
http://localhost:5174/
```

That's it! Your coupon platform is live! 🎉

---

## 📱 What You're Looking At

### Navbar (Top)
- **Logo**: Centered emoji icon with gradient circle
- **Name**: "SellMyCoupon"
- **Tagline**: "Buy & Sell Coupons Securely"
- **Notification**: Bell icon with red dot

### Bottom Navigation (Footer)
Click to navigate between:
1. **Home** 🏠 - Browse all coupons
2. **Add** ➕ - List a new coupon
3. **Dashboard** 📊 - View your stats & listings
4. **Profile** 👤 - Manage your account

### Main Pages

#### 🏠 Home Page
- Search for coupons by brand name
- Filter by category (Electronics, Fashion, Food, Travel)
- Browse coupon cards showing:
  - Discount percentage
  - Brand name
  - Price in ₹
  - Expiry date
  - "Buy Now" button

#### ➕ Add Coupon Page
- Form to submit your coupon
- Fields: Brand, Discount %, Code, Expiry Date, Price, Description
- Submit button to add coupon

#### 📊 Dashboard Page
- View your key metrics:
  - Total coupons listed
  - Coupons sold
  - Total earnings
- See your listed coupons with status (Active/Sold/Expired)
- Quick links to analytics and add new coupon

#### 👤 Profile Page
- Your profile info (name, email, phone)
- Quick stats (purchases, savings, member since)
- Order history
- Settings and account options

---

## 🎨 Design Highlights

✨ **Modern & Minimal**
- Clean white background
- Soft shadows and rounded corners
- Blue-Purple gradient theme

📱 **Mobile-First**
- Designed for 390px width
- Fully responsive layout
- Touch-friendly buttons

🎯 **Professional Feel**
- Inter & Poppins fonts
- Smooth animations
- Consistent spacing (8px grid)

---

## 🛠️ Development Tips

### Add a New Page
```tsx
// 1. Create file: src/pages/NewPage.tsx
import React from 'react'

function NewPage() {
  return (
    <div className="pt-32 pb-24 px-4">
      <div className="max-w-md mx-auto">
        {/* Your content here */}
      </div>
    </div>
  )
}

export default NewPage

// 2. Add route in App.tsx
<Route path="/newpage" element={<NewPage />} />

// 3. Add navigation item in BottomNav.tsx (optional)
```

### Customize Colors
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

### Change Fonts
Update `src/style.css`:
```css
@import url('your-font-url');

body {
  font-family: 'Your Font', sans-serif;
}
```

### Add New Component
```tsx
// src/components/YourComponent.tsx
interface YourComponentProps {
  title: string
  onClick?: () => void
}

function YourComponent({ title, onClick }: YourComponentProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4">
      <h3 className="font-semibold text-gray-900">{title}</h3>
    </div>
  )
}

export default YourComponent
```

---

## 📦 Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable components
│   │   ├── Navbar.tsx
│   │   ├── BottomNav.tsx
│   │   ├── CouponCard.tsx
│   │   └── FilterChip.tsx
│   ├── pages/           # Full page components
│   │   ├── Home.tsx
│   │   ├── AddCoupon.tsx
│   │   ├── Dashboard.tsx
│   │   └── Profile.tsx
│   ├── App.tsx          # Main app & routing
│   ├── main.tsx         # Entry point
│   └── style.css        # Global styles
├── index.html           # HTML file
├── package.json         # Dependencies
├── tailwind.config.js   # Tailwind config
├── vite.config.ts       # Vite config
└── tsconfig.json        # TypeScript config
```

---

## 🎯 Key Features

✅ **Navbar with Notifications**
- Fixed at top
- Centered branding
- Notification indicator

✅ **Bottom Navigation**
- Fixed at bottom
- 4 navigation items
- Active state highlighting

✅ **Coupon Cards**
- Brand info and logo
- Discount percentage (big & bold)
- Price and expiry date
- Buy button

✅ **Search & Filter**
- Real-time search
- Category filtering
- Interactive chips

✅ **Forms**
- Add coupon form with validation fields
- Date picker
- Textarea for description

✅ **Dashboard**
- Metric cards with gradients
- Coupon status badges
- User statistics

✅ **Profile**
- User info display
- Order history
- Settings options

---

## 🔗 Links & Resources

- **Development Server**: `http://localhost:5174/`
- **Tailwind CSS Docs**: https://tailwindcss.com/docs
- **React Docs**: https://react.dev
- **Lucide Icons**: https://lucide.dev
- **React Router**: https://reactrouter.com

---

## 📝 Common Tasks

### Change Active Navbar Item
The bottom nav actively highlights based on current route using `useNavigate()` from React Router.

### Update Coupon Data
Edit the `coupons` array in `src/pages/Home.tsx` to add more coupon examples.

### Style a Specific Element
Add Tailwind classes like:
- `bg-gradient-to-r from-blue-600 to-purple-600` - Gradient
- `rounded-2xl` - Large border radius
- `shadow-lg` - Large shadow
- `hover:shadow-md` - Hover effect

### Make Something Responsive
Use Tailwind breakpoints:
```tsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
```

### Add an Icon
```tsx
import { Heart, Share2, Bell } from 'lucide-react'

<Heart size={24} />
<Share2 size={24} />
```

---

## 🎨 Color Quick Reference

- **Primary Gradient**: `from-blue-600 to-purple-600`
- **Success**: `text-green-600 bg-green-100`
- **Error**: `text-red-600 bg-red-100`
- **Info**: `text-blue-600 bg-blue-100`
- **Subtle BG**: `bg-gray-50`
- **Border**: `border-gray-100 or border-gray-200`

---

## ⚡ Performance Tips

1. **Lazy Load Pages**: Use React Router lazy loading
2. **Memoize Components**: Use `React.memo()` for expensive components
3. **Use Images**: Replace emoji with actual images for logos
4. **Optimize Tailwind**: Tailwind already purges unused styles

---

## 🚀 Next Steps

1. **Connect Backend**: Integrate with your API
2. **Add Authentication**: Login/signup pages
3. **Implement Real Data**: Replace mock data with API calls
4. **Add Tests**: Write unit & integration tests
5. **Deploy**: Push to Vercel, Netlify, or your server

---

## ❓ Troubleshooting

### Port 5173 Already in Use
- Dev server will use 5174 automatically
- Or kill the process using the port

### TypeScript Errors
- Run `npm run build` to check
- Some `any` types in components are okay for MVP

### Styles Not Updating
- Make sure you saved the file
- Check browser console for errors
- Hard refresh (Ctrl+Shift+R on Windows)

### Components Not Showing
- Check that layout has proper spacing (`pt-32 pb-24`)
- Verify component imports
- Check terminal for build errors

---

## 📞 Support Files

- `DOCUMENTATION.md` - Full documentation
- `DESIGN_SYSTEM.md` - Design guidelines
- `README.md` (root) - Project overview

---

**Happy Building! 🚀**

Need help? Check the documentation files or check individual component files for inline comments.
