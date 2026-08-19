# 💳 PayFlow — Smart Checkout Experience

> **Choose your plan. Checkout securely. Pay with confidence.**

PayFlow is a portfolio-ready full-stack payment platform built with **React (Vite, Tailwind CSS)** on the frontend and **Node.js (Express, Stripe Server SDK)** on the backend. It features an ultra-modern light visual design system (Light Slate, Electric Blue `#2563EB`, Sunset Orange `#F97316`, Crisp White), transparent glassmorphism navbar, interactive 3D card flip effects, right-side sliding checkout preview drawer, real-time transaction history, revenue analytics, and an official **`POST /create-payment`** Stripe Checkout Session creation API.

---

## 🚀 Key Features

- **`POST /create-payment` Backend Integration**:
  - Secure server-side price validation (never trusts client-submitted prices).
  - Stripe SDK integration creating Checkout Sessions (`mode: "payment"`).
  - Handles `line_items`, `success_url`, `cancel_url`, and metadata.
  - Exposes `.env` and `.env.example` without hardcoding secret keys.
  - Built-in fallback mode for instant local testing when live Stripe keys are pending.
- **🎨 Modern Design System**:
  - Light Slate backdrop (`#F8FAFC`), Vibrant Electric Blue (`#2563EB`), Sunset Orange (`#F97316`), and Crisp White translucent cards.
  - Transparent glassmorphism header (`backdrop-blur-md`).
  - Fully responsive across Mobile, Tablet, Laptop, and PC displays.
- **🔄 Interactive 3D Flip Product Cards**:
  - **FRONT**: High quality image, category, title, price badge, rating, and flip button.
  - **BACK**: Features checklist, security badges, payment logos (Visa, Mastercard, Apple Pay, Google Pay), and checkout trigger.
- **🛒 Sliding Checkout Panel (Drawer)**:
  - Right-side drawer on desktop, bottom sheet on mobile.
  - Shows order breakdown (Subtotal, Tax, Total), security badges, and loading states (`Creating Secure Checkout...`).
- **🎉 Success & Cancel Pages**:
  - Payment Success screen with checkmark animation, order ID `#PF-XXXXX`, confetti celebration, and session verification.
  - Friendly Cancellation screen with quick retry functionality.
- **📊 Dashboard & Transaction Audit Log**:
  - Metric cards ($1,284 total volume, 18 paid, 1 pending, 2 cancelled).
  - Searchable transaction table (search by ID, plan, email, or status).
  - Revenue analytics chart breakdown by product tier.
- **🎓 Interactive "How Stripe Checkout Works" Diagram**:
  - Step-by-step technical architecture guide for interviewers.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Effects**: Canvas Confetti & CSS 3D Transforms

### Backend
- **Server**: Node.js + Express.js
- **Payment Engine**: Official Stripe Node SDK (`stripe`)
- **Config**: Dotenv + CORS
- **Storage**: JSON File Persistence (`data/transactions.json`)

---

## ⚙️ Quick Setup & Running Locally

### 1. Backend Setup
```bash
cd backend
npm install
```

Configure `backend/.env`:
```env
PORT=5001
CLIENT_URL=http://localhost:5173
STRIPE_SECRET_KEY=sk_test_51...
STRIPE_PUBLISHABLE_KEY=pk_test_51...
```
*(If no secret key is added, PayFlow automatically uses simulated checkout fallback mode for smooth offline testing).*

Start Backend Server:
```bash
npm run dev
# Server will start on http://localhost:5001
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
# App will start on http://localhost:5173
```

---

## 🧪 Testing `POST /create-payment` Endpoint

You can test the backend API directly via cURL or PowerShell:

```bash
curl -X POST http://localhost:5001/create-payment \
  -H "Content-Type: application/json" \
  -d '{"productId": "pro"}'
```

**Expected Response**:
```json
{
  "success": true,
  "message": "Checkout Session created successfully",
  "url": "https://checkout.stripe.com/c/pay/cs_test_...",
  "sessionId": "cs_test_...",
  "isSimulated": false,
  "product": {
    "id": "pro",
    "name": "Pro Flow",
    "price": 49,
    "currency": "usd"
  }
}
```

---

## 📁 Project Structure

```text
task24/
├── backend/
│   ├── config/
│   │   └── stripe.js          # Stripe SDK initialization
│   ├── controllers/
│   │   └── paymentController.js# POST /create-payment & transaction logic
│   ├── data/
│   │   ├── products.js        # Server-side authoritative product definitions
│   │   └── transactions.json  # Transaction persistence store
│   ├── routes/
│   │   └── paymentRoutes.js   # API routes
│   ├── services/
│   │   └── stripeService.js   # Stripe Checkout Session builder
│   ├── server.js              # Express server entry point (Port 5001)
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Transparent glassmorphism header
│   │   │   ├── ProductCard.jsx     # 3D Flip product card
│   │   │   ├── CheckoutPreview.jsx # Sliding checkout panel
│   │   │   ├── SecurityPanel.jsx   # Bank-grade security section
│   │   │   ├── HowItWorks.jsx      # Technical flow diagram
│   │   │   ├── MetricCard.jsx      # Animated metric cards
│   │   │   └── Toast.jsx           # Notification toast
│   │   ├── pages/
│   │   │   ├── Landing.jsx         # Hero & product grid
│   │   │   ├── ProductsPage.jsx    # Catalog filter & search
│   │   │   ├── Dashboard.jsx       # Analytics overview & spending chart
│   │   │   ├── Success.jsx         # Payment completion & confetti
│   │   │   ├── Cancelled.jsx       # Friendly cancel screen
│   │   │   ├── Transactions.jsx    # Audit table
│   │   │   ├── Analytics.jsx       # Financial charts
│   │   │   └── Settings.jsx        # Preferences
│   │   ├── services/
│   │   │   └── paymentApi.js       # Client API requester
│   │   ├── context/
│   │   │   └── AppContext.jsx      # Global React state
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css           # Tailwind & 3D CSS utilities
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```
