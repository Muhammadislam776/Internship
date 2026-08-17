# 🔐 SecureGate — JWT Authentication & Protected API

> **"Secure Every Request. Protect Every Route."**

SecureGate is a production-grade full-stack security platform built with Node.js, Express, and React. It features a custom **Express `authMiddleware`** that verifies JSON Web Tokens (JWT) sent via the `Authorization: Bearer <token>` header, enforces HTTP 401 error standards, and attaches authenticated user context to `req.user`.

---

## 🎯 Core Technical Highlight: Express `authMiddleware`

The core highlight of SecureGate is the `authMiddleware.js` function located at `server/middleware/authMiddleware.js`:

```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1. Check Authorization header existence
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is required."
      });
    }

    // 2. Check Bearer scheme format
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format."
      });
    }

    // 3. Extract Token
    const token = parts[1];
    if (!token || token.trim() === '') {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format."
      });
    }

    // 4. Verify JWT using process.env.JWT_SECRET
    const secret = process.env.JWT_SECRET;
    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token."
      });
    }

    // 5. Find user in database
    const user = User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token."
      });
    }

    // 6. Attach safe user to req.user & continue
    req.user = User.toSafeUser(user);
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token."
    });
  }
};
```

---

## 🔄 Complete Authentication Workflow

```
User (React Web App)
  │
  ├─► Enter Email + Password (LoginPage / RegisterPage)
  │
  ├─► POST /api/auth/login
  │      ├─► Validate credentials against DB (bcryptjs match)
  │      └─► Generate JWT signed with process.env.JWT_SECRET
  │
  ├─► Frontend receives JWT & stores in AuthContext
  │
  └─► Request Protected Endpoint: GET /api/auth/me
         │
         ├─► Header: Authorization: Bearer <JWT>
         │
         ├─► Express authMiddleware
         │      ├─► Check Header Exists (401 if missing)
         │      ├─► Check Bearer Scheme (401 if malformed)
         │      ├─► jwt.verify(token, process.env.JWT_SECRET)
         │      └─► Attach req.user & call next()
         │
         └─► Return HTTP 200 OK + User JSON Payload -> Dashboard UI
```

---

## 🎨 Tech Stack & Visual Design System

- **Backend**: Node.js, Express.js, `jsonwebtoken`, `bcryptjs`, `cors`, `dotenv`.
- **Database**: File-backed JSON DB engine with atomic persistence (`server/data/users.json`).
- **Frontend**: React 18 (Vite), Lucide Icons, Vanilla CSS Design System.
- **Design Aesthetic**: Modern SaaS Glassmorphism
  - **Midnight Navy** (`#071A2B`): Header, Sidebar, Dark Sections, Footer
  - **Electric Blue** (`#2563EB`): Primary Action Buttons, Links
  - **Cyber Cyan** (`#22D3EE`): Security Indicators, Glowing Borders, Active Pipeline
  - **Vibrant Orange** (`#FF7A18`): Login CTA, Alert Badges
  - **Success / Error**: `#22C55E` / `#EF4444`

---

## 📁 Project Structure

```
task19/
├── client/                     # Vite + React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ApiTester.jsx           # Live authMiddleware Sandbox
│   │   │   ├── ApiVisualizer.jsx       # Interactive HTTP Visualizer
│   │   │   ├── AuthActivityLog.jsx     # Security Audit Event Stream
│   │   │   ├── FlipCards.jsx           # 3D Interactive Flip Cards
│   │   │   ├── Footer.jsx              # Dark Navy Footer
│   │   │   ├── HeroWorkflow.jsx        # Animated Security Pipeline
│   │   │   ├── HowItWorksModal.jsx     # 7-Step Step-by-Step Guide Modal
│   │   │   ├── Navbar.jsx              # Fixed Glassmorphism Header
│   │   │   └── SecurityStatusCard.jsx  # Security Verification Checklist
│   │   ├── context/
│   │   │   └── AuthContext.jsx         # React Auth Context
│   │   ├── pages/
│   │   │   ├── ApiDocsPage.jsx         # Interactive REST API Spec
│   │   │   ├── DashboardPage.jsx       # Protected User Dashboard
│   │   │   ├── LandingPage.jsx         # SaaS Landing Hero
│   │   │   ├── LoginPage.jsx           # Sign In Form
│   │   │   └── RegisterPage.jsx        # User Registration Form
│   │   ├── services/
│   │   │   └── api.js                  # Fetch API Wrapper with Bearer Auth
│   │   ├── App.jsx
│   │   ├── index.css                   # Custom CSS Design System
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Node.js + Express Backend
│   ├── config/
│   │   └── database.js         # JSON Database Persistence Layer
│   ├── controllers/
│   │   ├── authController.js   # register, login, getMe
│   │   └── userController.js   # getProfile, getActivity
│   ├── data/
│   │   └── users.json          # Persisted user storage
│   ├── middleware/
│   │   └── authMiddleware.js   # Express JWT Authorization Middleware
│   ├── models/
│   │   └── User.js             # User Entity & Bcrypt Helper
│   ├── routes/
│   │   ├── authRoutes.js       # /api/auth routes
│   │   └── userRoutes.js       # /api/users routes
│   ├── tests/
│   │   └── auth.test.js        # Integration Test Suite
│   ├── utils/
│   │   └── generateToken.js    # JWT Generator
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── package.json                # Workspace Orchestration Script
└── README.md
```

---

## 🔑 Environment Variables

The server requires configuration via `server/.env`:

```env
PORT=5000
JWT_SECRET=securegate_jwt_secret_key_2026_super_secure_987654
DATABASE_URL=file:./data/users.json
```

*(Refer to `server/.env.example` for template)*

---

## ⚡ Installation & Quick Start

### 1. Install Dependencies
```bash
# Install root, backend, and frontend packages
npm run install:all
```

### 2. Run Application
```bash
# Start Express Server (Port 5000) and React Client (Port 3000) concurrently
npm run dev
```

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

---

## 🌐 REST API Endpoints

| Method | Endpoint | Access | Header Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | None | Registers new user & returns JWT |
| `POST` | `/api/auth/login` | Public | None | Authenticates password & returns JWT |
| `GET` | `/api/auth/me` | Protected | `Authorization: Bearer <JWT>` | Returns current authenticated user |
| `GET` | `/api/users/profile` | Protected | `Authorization: Bearer <JWT>` | Returns user security profile |
| `GET` | `/api/users/activity` | Protected | `Authorization: Bearer <JWT>` | Returns user security activity log |

---

## 🧪 Integration Testing

Execute the backend integration test suite verifying all 8 security scenarios:

```bash
npm test
```

### Verified Test Cases:
1. **TEST 1**: Register user -> Returns 201 Created & JWT.
2. **TEST 2**: Login with valid credentials -> Returns 200 OK & JWT.
3. **TEST 3**: Call `GET /api/auth/me` with `Authorization: Bearer <valid JWT>` -> 200 OK.
4. **TEST 4**: Call protected route without Authorization header -> 401 `"Authentication token is required."`
5. **TEST 5**: Send `Authorization: Bearer invalid-token` -> 401 `"Invalid or expired token."`
6. **TEST 6**: Send malformed header (`Authorization: Token <token>`) -> 401 `"Invalid authorization format."`
7. **TEST 7**: Send expired JWT -> 401 `"Invalid or expired token."`
8. **TEST 8**: Logout -> Frontend clears auth state & invalidates protected dashboard access.

---

## 🔐 Security Principles Followed

- **Secret Protection**: JWT secret is injected via `process.env.JWT_SECRET`.
- **Salted Password Hashing**: Passwords are hashed with `bcryptjs` (salt factor 10) prior to DB write. Passwords are never returned in API payloads.
- **Strict Scheme Verification**: `authMiddleware` accepts ONLY `Authorization: Bearer <JWT>`.
- **Zero Raw Exceptions**: Errors are handled cleanly to prevent internal server stack trace exposure.
