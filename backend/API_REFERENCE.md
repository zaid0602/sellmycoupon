# sellmycoupon.in — Backend API Reference

Base URL: `https://api.sellmycoupon.in/api`  
Auth: `Authorization: Bearer <JWT>`

---

## Auth `/api/auth`
| Method | Path              | Auth | Description               |
|--------|-------------------|------|---------------------------|
| POST   | /register         | ❌   | Register new user          |
| POST   | /login            | ❌   | Login, returns JWT         |
| GET    | /me               | ✅   | Get current user           |
| PUT    | /password         | ✅   | Change password            |

---

## Coupons `/api/coupons`
| Method | Path              | Auth | Description                        |
|--------|-------------------|------|------------------------------------|
| GET    | /                 | ❌   | Browse (search, filter, paginate)  |
| GET    | /featured         | ❌   | Featured coupons for homepage      |
| GET    | /my               | ✅   | Seller's own listings              |
| GET    | /:id              | ❌   | Coupon detail (code hidden)        |
| POST   | /                 | ✅   | List a new coupon                  |
| PUT    | /:id              | ✅   | Edit own coupon                    |
| DELETE | /:id              | ✅   | Remove own coupon                  |

**GET / Query Params:** `search`, `category`, `couponType`, `minPrice`, `maxPrice`, `sort` (newest|price_asc|price_desc|savings|popular), `page`, `limit`

---

## Payments `/api/payments`
| Method | Path              | Auth | Description                          |
|--------|-------------------|------|--------------------------------------|
| POST   | /create-order     | ✅   | Step 1 — create Stripe Checkout session |
| POST   | /verify           | ✅   | Step 2 — verify Stripe payment, reveal code |
| POST   | /webhook          | ❌   | Stripe server-to-server webhook      |

---

## Orders `/api/orders`
| Method | Path              | Auth | Description                          |
|--------|-------------------|------|--------------------------------------|
| GET    | /                 | ✅   | My purchase history                  |
| GET    | /:id              | ✅   | Single order + coupon code (if paid) |
| POST   | /:id/refund       | ✅   | Request refund                       |

---

## Wallet `/api/wallet`
| Method | Path              | Auth | Description             |
|--------|-------------------|------|-------------------------|
| GET    | /                 | ✅   | Current balance         |
| GET    | /transactions     | ✅   | Transaction history     |
| POST   | /withdraw         | ✅   | Request bank withdrawal |

---

## Users `/api/users`
| Method | Path              | Auth | Description              |
|--------|-------------------|------|--------------------------|
| GET    | /:id              | ❌   | Public seller profile    |
| PUT    | /profile          | ✅   | Update own profile       |
| GET    | /dashboard        | ✅   | Aggregated seller stats  |

---

## Admin `/api/admin` — 🔒 Admin only
| Method | Path                       | Description                   |
|--------|----------------------------|-------------------------------|
| GET    | /stats                     | Platform overview dashboard   |
| GET    | /users                     | All users                     |
| PUT    | /users/:id/suspend         | Toggle user suspension        |
| GET    | /coupons                   | All coupons (inc. removed)    |
| PUT    | /coupons/:id/approve       | Approve coupon                |
| PUT    | /coupons/:id/featured      | Toggle featured               |
| DELETE | /coupons/:id               | Remove coupon                 |
| GET    | /orders                    | All orders                    |
| POST   | /orders/:id/refund         | Admin-initiated refund        |

---

## Payment Flow (Razorpay)

```
Client                    Backend                  Razorpay
  │                          │                         │
  │── POST /payments/create-order ──►│                 │
  │                          │── Create order ────────►│
  │                          │◄── { order_id } ────────│
  │◄── { razorpayOrderId } ──│                         │
  │                          │                         │
  │── Open Razorpay checkout ──────────────────────────►│
  │◄── payment success (paymentId, signature) ─────────│
  │                          │                         │
  │── POST /payments/verify ─►│                        │
  │                          │── HMAC verify sig       │
  │                          │── Mark order paid       │
  │                          │── Reveal coupon code    │
  │                          │── Credit seller wallet  │
  │◄── { code: "AMZN20OFF" }─│                         │
```

---

## Security Checklist
- ✅ JWT auth on all private routes
- ✅ Coupon code field: `select: false` — never leaked in queries
- ✅ Code revealed only after HMAC signature verified
- ✅ Seller cannot buy own coupon
- ✅ Admin-only routes behind `adminOnly` middleware
- ✅ bcrypt password hashing (salt rounds: 12)
- ✅ Rate limiting: 200 req/15min global, 10 req/15min on auth
- ✅ Helmet.js security headers
- ✅ Input validation on all write endpoints (express-validator)
- ✅ Suspended user check on every authenticated request
