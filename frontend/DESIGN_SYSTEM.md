# SellMyCoupon - Design System & Component Guide

## 🎨 Color Palette

### Primary Colors
- **Gradient**: `from-blue-600 to-purple-600`
  - Blue: `#2563eb` (600)
  - Purple: `#9333ea` (600)
- **Usage**: Buttons, active states, highlights, CTAs

### Secondary Colors
- **Light Gray**: `#f3f4f6` (100)
  - Backgrounds for inactive elements
- **Medium Gray**: `#e5e7eb` (200)
  - Borders and dividers
- **Dark Gray**: `#6b7280` (600)
  - Secondary text

### Semantic Colors
- **Success**: `#10b981` (green)
- **Warning**: `#f59e0b` (amber)
- **Error**: `#ef4444` (red)
- **Info**: `#3b82f6` (blue)

## 📐 Typography

### Font Family
- **Primary**: Inter (400, 500, 600, 700 weights)
- **Secondary**: Poppins (600, 700 weights)
- **Web**: Google Fonts import

### Font Sizes & Scales
```
Headings:
- H1: 2xl (24px) - Bold page titles
- H2: lg (18px) - Section titles
- H3: base (16px) - Subsection titles

Body:
- Large: base (16px) - Main text
- Normal: sm (14px) - Labels, descriptions
- Small: xs (12px) - Secondary info, timestamps
```

### Font Weights
- Body text: `font-medium` (500)
- Labels: `font-semibold` (600)
- Headings: `font-bold` (700)

## 📏 Spacing System

Using 8px base unit (Tailwind px-* system)

```
px-2  = 8px     py-2  = 8px
px-3  = 12px    py-3  = 12px
px-4  = 16px    py-4  = 16px
px-6  = 24px    py-6  = 24px
```

### Common Spacing Patterns
- **Card padding**: `p-4` or `p-6`
- **Section padding**: `py-6` or `py-8`
- **Grid gaps**: `gap-3` or `gap-4`
- **Item spacing**: `mb-3` or `mb-4`

## 🎛️ Components

### Button Styles

**Primary Button**
```tsx
className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition"
```

**Secondary Button**
```tsx
className="bg-gray-100 text-gray-900 px-6 py-3 rounded-xl font-semibold border border-gray-200 hover:bg-gray-200 transition"
```

**Danger Button**
```tsx
className="bg-red-50 text-red-600 px-6 py-3 rounded-xl font-semibold border border-red-200 hover:bg-red-100 transition"
```

### Card Styles

**Default Card**
```tsx
className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition"
```

**Gradient Card**
```tsx
className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-gray-100"
```

### Input Styles

**Text Input**
```tsx
className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
```

**Search Input**
```tsx
className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
```

## 🎯 Border Radius

```
rounded-lg    = 8px    (small elements, buttons)
rounded-xl    = 12px   (cards, inputs, chips)
rounded-2xl   = 16px   (large cards, sections)
rounded-full  = 50%    (circles, pills)
```

## 🌊 Shadows

```
shadow-sm     = 0 1px 2px rgba(0,0,0,0.05)
shadow        = 0 1px 3px rgba(0,0,0,0.1)
shadow-md     = 0 4px 6px rgba(0,0,0,0.1)
shadow-lg     = 0 10px 15px rgba(0,0,0,0.1)
```

### Usage
- **Default**: `shadow-sm` on cards
- **Hover**: `hover:shadow-md` on interactive elements
- **Active**: `shadow-lg` on focused/selected items

## 🎬 Transitions & Animations

### Standard Transition
```tsx
className="transition-all duration-200"
```

### Hover Effects
```tsx
className="hover:shadow-md hover:bg-gray-50 transition"
```

### Active States
```tsx
className="active:scale-95 transition-transform"
```

## 📱 Responsive Patterns

### Breakpoints
- Mobile: 320px - 640px (no prefix)
- Tablet: 641px - 1024px (md:)
- Desktop: 1025px+ (lg:)

### Mobile-First Approach
```tsx
// Mobile by default, tablet size up
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
```

### Padding for Navigation
```tsx
// Navbar: pt-24 or pt-32
// BottomNav: pb-24 or pb-28
className="pt-32 pb-24"
```

## 🎨 Component Library

### Navbar Component
- Fixed top position
- White background with border-bottom
- Centered content
- Max-width container with mx-auto
- Notification badge in top-right

### BottomNav Component
- Fixed bottom position
- White background with border-top
- 4 equal columns
- Active gradient highlight
- Icons above labels

### CouponCard Component
- Gradient header section (blue-50 to purple-50)
- Brand info on left
- Icon on right
- Bold discount percentage
- Expiry date with icon
- Grid layout for price and button

### FilterChip Component
- Toggle-able state
- Active: gradient background + white text
- Inactive: gray background + gray text
- Icons on sides
- Pill-shaped (rounded-full)

## 🔄 State Management Colors

### Status Badges
- **Active**: `bg-green-100 text-green-700`
- **Sold**: `bg-blue-100 text-blue-700`
- **Expired**: `bg-red-100 text-red-700`
- **Pending**: `bg-amber-100 text-amber-700`

## 📋 Form Elements

### Input Types
- **Text**: Standard border, focus ring
- **Date**: Date picker styling
- **Number**: Number input with +/- controls
- **Textarea**: Larger input field, resizable

### Required Indicators
- Red asterisk `*` after labels
- Or marked with `required` attribute

### Validation States
- **Error**: Red border and text
- **Success**: Green border and checkmark
- **Warning**: Amber border and icon

## 🎯 Spacing Guidelines

### Section Spacing
```
Outside container: px-4          (16px mobile padding)
Between sections: py-6           (24px vertical space)
Between elements: gap-4          (16px gap)
Card internal: p-4 or p-6        (16px or 24px padding)
```

### Component Spacing
```
Header to content: mb-6          (24px)
Content items: space-y-4         (16px between items)
Text and icon: gap-2 or gap-3    (8px or 12px)
Form fields: gap-4               (16px)
```

## 🎨 Gradient Effects

### Primary Gradient Button
```
from-blue-600 to-purple-600
```

### Soft Gradient Background
```
from-blue-50 to-purple-50
```

### Metric Card Gradients
- Blue: `from-blue-500 to-blue-600`
- Green: `from-green-500 to-green-600`
- Purple: `from-purple-500 to-purple-600`

## 💡 Best Practices

1. **Consistency**: Use predefined colors, spacing, and fonts
2. **Hierarchy**: Use font sizes and weights for visual hierarchy
3. **Spacing**: Use 8px grid system consistently
4. **Shadows**: Apply soft shadows, avoid harsh shadows
5. **Transitions**: Add smooth transitions to interactive elements
6. **Accessibility**: Maintain sufficient color contrast
7. **Responsive**: Test on mobile, tablet, and desktop
8. **Icons**: Use Lucide React icons (20-24px size)

## 🚀 Quick Component Creation Template

```tsx
export interface ComponentProps {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary'
}

export function Component({ label, onClick, variant = 'primary' }: ComponentProps) {
  const baseClasses = 'px-4 py-2 rounded-xl font-semibold transition'
  const variantClasses = variant === 'primary'
    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
    : 'bg-gray-100 text-gray-900 border border-gray-200 hover:bg-gray-200'

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses}`}
    >
      {label}
    </button>
  )
}
```

---

**Reference this guide when building new components or pages!**
