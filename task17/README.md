# 🛡️ ShieldForm — Secure User Validation Platform

> **"Validate First. Trust Every Request."**

ShieldForm is a cybersecurity-inspired full-stack application demonstrating request validation in **Node.js** and **Express.js** using **Zod**. Every incoming user request is intercepted and validated by custom Express middleware (`validateUser`) before reaching controller logic.

---

## 🚀 Key Technical Features

- **Express.js Middleware (`validateUser.js`)**: Reusable middleware function using Zod's `safeParseAsync` to validate `req.body`.
- **Zod Schema Validation (`userSchema.js`)**: Enforces string bounds, email formats, strong password complexity, age limits (`age >= 18`), phone format regex, role enums, and confirmation field matching.
- **Strict Error Handling**: Short-circuits invalid requests with `400 Bad Request` and structured field-level error messages. Prevents invalid data from reaching database handlers.
- **Cybersecurity Glassmorphism UI**: React + Vite frontend with Deep Space Navy, Electric Indigo, Cyber Cyan, and Vibrant Orange aesthetic.
- **Live API Visualizer**: Animated pipeline diagram depicting request entry into Zod Validator node → Controller execution vs HTTP 400 rejection.
- **Interactive Testbench**: Pre-configured test presets (Valid User, Weak Password, Bad Email, Underage) and raw custom JSON payload tester.
- **3D Flip Cards & Error Cards**: Statistical flip metrics and interactive common error cards with hover lift and glow effects.
- **Step-by-Step Architecture Demo**: Interactive modal walkthrough explaining the Request → Middleware → Zod → Controller pipeline.
- **Audit Logs & Valid Users Directory**: Real-time log table tracking execution times and field rejections, alongside a validated user directory.

---

## 📁 Repository Structure

```
task17/
├── backend/
│   ├── package.json
│   └── src/
│       ├── server.js
│       ├── schemas/
│       │   └── userSchema.js
│       ├── middleware/
│       │   └── validateUser.js
│       ├── controllers/
│       │   └── userController.js
│       ├── routes/
│       │   └── userRoutes.js
│       └── utils/
│           ├── store.js
│           ├── validationErrors.js
│           └── testApi.js
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── index.css
        ├── services/
        │   └── api.js
        ├── components/
        │   ├── Header.jsx
        │   ├── Hero.jsx
        │   ├── ApiVisualizer.jsx
        │   ├── RegistrationForm.jsx
        │   ├── ValidationResult.jsx
        │   ├── StatsCards.jsx
        │   ├── ValidationLogs.jsx
        │   ├── FlipCard.jsx
        │   ├── DemoCard.jsx
        │   ├── DemoModal.jsx
        │   ├── SecurityStatus.jsx
        │   ├── InteractiveErrorCards.jsx
        │   └── Footer.jsx
        └── pages/
            ├── Home.jsx
            ├── Validation.jsx
            ├── Users.jsx
            ├── ApiDocs.jsx
            ├── Activity.jsx
            └── Settings.jsx
```

---

## ⚡ Quick Start

### 1. Start Backend Server
```bash
cd backend
npm install
node src/server.js
```
*Backend runs at http://localhost:5050*

### 2. Start Frontend Dev Server
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs at http://localhost:3000*

### 3. Run Automated Middleware Tests
```bash
cd backend
node src/utils/testApi.js
```
