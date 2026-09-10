# 📚 Shivaji Library — Membership & Management Platform

A modern, full-stack web application designed for **Shivaji Library**, a newly opened study space and reference library in Tagore Garden Extension, New Delhi.

---

## 📍 Library Official Information (Source of Truth)

- **Name:** Shivaji Library
- **Address:** Plot No. F-4, near Gurudwara, Mehta Chowk, Block FC, Shivaji Enclave, Tagore Garden Extension, New Delhi, Delhi 110027
- **Google Maps Link:** [https://maps.app.goo.gl/7iusFAvcd2ZNShiL8](https://maps.app.goo.gl/7iusFAvcd2ZNShiL8)
- **Timings:** Open 7 Days (Monday to Sunday) • 7:00 AM – 10:00 PM
- **Key Amenities:** Air Conditioned Reading Halls, Dedicated Desk Power Sockets, High-Speed Fiber Wi-Fi, RO Filtered Water, Curated Book Reference Collection, Discussion Lounge.

---

## 🏛️ Architecture & Three-Part System

1. **Public Website**
   - **Home Page:** Hero banner, study room photo gallery, timings, embedded interactive Google Map, featured book showcase, transparent pricing cards.
   - **Book Catalog / Showcase:** Searchable and filterable catalog with live availability badges and category filtering (UPSC, JEE, Science, History, Self-Help).
   - **About Section:** Library vision, quiet study mission, student amenities, and code of conduct.
   - **Location & Contact:** Interactive Google Maps embed, metro transit guide (Tagore Garden / Rajouri Garden Blue line), inquiry message form.
   - **Registration:** Instant sign-up with real-time fee calculator (monthly ₹800, quarterly ₹2,200, yearly ₹8,000). Creates account with status `pending` until initial payment.

2. **Member Self-Service Portal**
   - **Member Authentication:** JWT login stored in `httpOnly` secure cookies.
   - **Live Membership Card:** Displays current plan, join date, validity expiry date, and real-time days remaining countdown.
   - **Status Badges:** Color-coded indicators (`active`, `expiring`, `expired`, `pending`, `suspended`).
   - **One-Click Online Renewal:** Core non-loss business logic extends `membershipEndDate` from *whichever is later* — today's date or the current expiry date.
   - **Payment History:** Complete record of all previous fees, receipt IDs, transaction amounts, and valid periods covered.
   - **Edit Profile:** Update name, mobile number, and residential address.

3. **Admin Control Portal**
   - **Admin Authentication:** Secure role-restricted login (`owner` / `staff`).
   - **Analytics Dashboard:** Real-time metrics for total members, active members, members expiring in next 7 days, expired/pending count, and current month's revenue (₹).
   - **Member Directory:** Full table with search (name, email, phone, address), filter tabs by status (`all`, `active`, `expiring`, `expired`, `pending`, `suspended`), and multi-attribute sorting.
   - **Member Detail View:** Full member profile along with complete payment transaction history.
   - **Manual Fee Entry:** Record desk payments made via Cash, UPI, Card, or Bank transfer; automatically extends membership cycle and logs receipt.
   - **Status Override:** Suspend, activate, or adjust member account statuses.
   - **CSV Export:** Download complete member roster as a `.csv` file.
   - **Automated Expiry & Reminders:** Node-cron scheduled job running daily to flag members expiring in <= 7 days and dispatch email alerts. Also includes an instant **"Trigger Reminders Now"** admin button.
   - **Book Catalog Manager:** Admin interface to add new books or remove catalog items.

---

## 🛠️ Tech Stack

- **Frontend:** React 18 (Vite) + Tailwind CSS + Lucide React + React Router v6
- **Backend:** Node.js + Express.js (REST API, ES Modules)
- **Database:** MongoDB (Atlas or local) with Mongoose
- **Authentication & Security:** JWT in `httpOnly` cookies + Bearer token fallback, `bcryptjs` password hashing, `express-rate-limit` brute-force protection, input validation.
- **Email Dispatch:** Nodemailer (integrated with SMTP, with fallback console logs / preview mode when SMTP credentials are not configured).
- **Scheduled Jobs:** `node-cron` for automated daily expiration auditing and reminder dispatch.

---

## 📁 Project Directory Structure

```
shivaji-library/
├── client/                      # React (Vite) Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/          # Navbar, Footer, StatusBadge, ProtectedRoute
│   │   ├── context/             # AuthContext (login, register, logout, session)
│   │   ├── pages/
│   │   │   ├── public/          # Home, BookCatalog, About, LocationContact, Register
│   │   │   ├── member/          # MemberLogin, MemberDashboard
│   │   │   └── admin/           # AdminLogin, AdminDashboard, AdminMembers, AdminBooks
│   │   ├── services/            # Axios API client withCredentials
│   │   ├── App.jsx              # Routes & navigation structure
│   │   ├── index.css            # Tailwind directives
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── server/                      # Node.js + Express API
│   ├── src/
│   │   ├── config/              # MongoDB connection & membership plans pricing
│   │   ├── controllers/         # authController, memberController, adminController, bookController
│   │   ├── middleware/          # JWT auth verification, roles, rate limiter
│   │   ├── models/              # Member, Payment, Admin, Book Mongoose models
│   │   ├── routes/              # publicRoutes, memberRoutes, adminRoutes
│   │   ├── scripts/             # seedAdmin.js, seedData.js
│   │   ├── services/            # cronService (node-cron daily checks)
│   │   ├── utils/               # token.js, emailService.js
│   │   └── server.js            # Main Express app & middleware
│   ├── .env.example
│   └── package.json
│
├── .env.example
├── package.json
└── README.md
```

---

## ⚡ Quick Start Guide

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn
- MongoDB connection string (MongoDB Atlas or local MongoDB instance)

### 1. Configure Server Environment
In `server/.env` (copied from `server/.env.example`):
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/shivaji_library?retryWrites=true&w=majority
JWT_SECRET=shivaji_library_super_secret_jwt_key_2026_secure
CLIENT_URL=http://localhost:5173
NODE_ENV=development

# Optional SMTP settings (emails will log formatted text preview to console if left blank)
EMAIL_HOST=
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASS=
EMAIL_FROM=Shivaji Library <noreply@shivajilibrary.com>
```

### 2. Seed Admin & Sample Data
From `server/` directory:
```bash
# Seed default admin account
npm run seed:admin

# Or seed admin + sample books + sample members across all states
npm run seed
```

### 3. Start Backend Server
```bash
cd server
npm install
npm run dev
# Server runs on http://localhost:5000
```

### 4. Start Frontend Client
```bash
cd ../client
npm install
npm run dev
# Client runs on http://localhost:5173
```

---

## 🔑 Default Demo Accounts

| Role | Username / Email | Password | Description |
|---|---|---|---|
| **Admin (Owner)** | `admin` | `Admin@123` | Full access to dashboard, members, payments, and book manager |
| **Member (Active)** | `rohan@example.com` | `Member@123` | Active Monthly Pass (10 days remaining) |
| **Member (Expiring)** | `pooja@example.com` | `Member@123` | Expiring Quarterly Pass (4 days remaining) |
| **Member (Expired)** | `aman@example.com` | `Member@123` | Expired Monthly Pass |
| **Member (Pending)** | `simran@example.com` | `Member@123` | Registered Annual Pass, pending initial payment |

---

## 📡 Key API Endpoints

### Public
- `POST /api/register` — New member registration (creates account with `pending` status)
- `POST /api/member/login` — Member login (issues JWT in `httpOnly` cookie)
- `POST /api/member/logout` — Clears auth cookie
- `GET  /api/books` — Get book catalog with search, genre, and availability filters
- `POST /api/contact` — Submit visitor inquiry or book a desk tour

### Member (Protected)
- `GET  /api/member/me` — Fetch logged-in member profile and current status
- `PUT  /api/member/me` — Update member phone, address, and name
- `GET  /api/member/payments` — Fetch all previous fee receipts
- `POST /api/member/renew` — Renew membership (extends validity from max(today, endDate))

### Admin (Protected)
- `POST  /api/admin/login` — Admin login
- `GET   /api/admin/dashboard/stats` — Metrics (total, active, expiring soon, revenue)
- `GET   /api/admin/members` — Member directory with search, filter, and sort
- `GET   /api/admin/members/:id` — Single member full details and payment history
- `POST  /api/admin/members/:id/payment` — Record manual payment (Cash/UPI/Card) & extend pass
- `PATCH /api/admin/members/:id/status` — Override member status (e.g. suspend)
- `GET   /api/admin/members/export` — Export members list as CSV file
- `POST  /api/admin/trigger-reminders` — Run daily expiry audit and reminder emails on-demand
- `POST  /api/admin/books` — Add new book to catalog
- `DELETE /api/admin/books/:id` — Delete book from catalog