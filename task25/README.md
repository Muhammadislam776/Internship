# ⚡ TaskForge — Smart Productivity & Testing Dashboard

> **"Plan Smarter. Build Faster. Test Everything."**

TaskForge is a modern full-stack developer productivity dashboard and automated testing showcase. It combines a high-performance **React + Vite** frontend with a robust **Node.js Express REST API** backend, featuring a light translucent **Glassmorphism design system**, real-time task CRUD workflows, interactive analytics, and comprehensive **Vitest unit & integration test suites** for both frontend React components and backend Express API routes.

---

## 🌟 Key Features

- 💎 **Modern Light & Transparent Design System**: Built with semi-transparent frosted glass cards, purple & cyan radial ambient glows, crisp typography, and responsive Bootstrap 5 integration.
- 🎯 **Full Task Lifecycle Management**: Create, edit, delete, filter, sort, search, and mark tasks as complete with real-time UI updates and Toast feedback.
- ⚡ **Interactive Testing Dashboard**: Dedicated showcase page tracking 27 automated Vitest unit & Supertest API integration tests with visual status badges (`PASS`) and live test execution simulation.
- 📊 **Productivity Analytics & Charts**: Visual statistics including weekly task completion output (Mon → Sun), status breakdown (Todo, In Progress, Completed), priority distribution (Low, Medium, High, Critical), and productivity scores.
- 🌓 **Instant Theme Switcher**: Toggle between default Light Glassmorphism and Dark Mode cleanly.
- 📱 **Fully Responsive Layout**: Seamless UI experience across desktop, laptop, tablet, and mobile with sticky navigation header and mobile drawer.
- 🛡️ **Clean Architecture & Error Handling**: Modular Express REST API with unified error middleware, status code standardizing (`200`, `201`, `400`, `404`, `500`), and json response envelopes (`{ success, message, data }`).

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Bootstrap 5 + Custom Glassmorphism CSS Design System
- **Icons**: React Icons (Feather / FontAwesome set)
- **Test Runner & Utilities**: Vitest + React Testing Library + `@testing-library/jest-dom` + `jsdom`

### Backend
- **Runtime**: Node.js
- **Web Framework**: Express.js REST API
- **API Testing**: Vitest + Supertest HTTP Assertions
- **Data Layer**: In-Memory Store with initial developer seed data & reset state helpers

---

## 📁 Project Structure

```text
taskforge/
│
├── client/                      # React Vite Frontend Application
│   ├── src/
│   │   ├── components/          # Reusable UI Components
│   │   │   ├── Navbar.jsx       # Header & Sticky Navigation
│   │   │   ├── Hero.jsx         # Developer Welcome Banner & Primary CTAs
│   │   │   ├── StatsCards.jsx   # 4 Metric Highlight Cards with Hover Lift
│   │   │   ├── TaskCard.jsx     # Task Item Card with Status Badges & Actions
│   │   │   ├── TaskList.jsx     # Search, Filters, Category Tabs & Grid
│   │   │   ├── TaskModal.jsx    # Glassmorphism Form Modal with Validation
│   │   │   ├── Toast.jsx        # Notification System Overlay
│   │   │   └── Counter.jsx      # Vitest Tested Counter Component
│   │   ├── pages/               # Main Application Views
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── TasksPage.jsx
│   │   │   ├── AnalyticsPage.jsx
│   │   │   ├── TestingDashboardPage.jsx
│   │   │   └── SettingsPage.jsx
│   │   ├── services/            # API REST Client
│   │   │   └── api.js
│   │   ├── styles/              # Design System CSS
│   │   │   └── custom.css
│   │   ├── tests/               # Vitest React Unit Tests
│   │   │   ├── setup.js
│   │   │   ├── TaskCard.test.jsx
│   │   │   ├── TaskList.test.jsx
│   │   │   ├── TaskForm.test.jsx
│   │   │   ├── Dashboard.test.jsx
│   │   │   └── Counter.test.jsx
│   │   ├── App.jsx              # Main Application Container
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/                      # Node.js Express REST API
│   ├── controllers/             # Request Controllers
│   │   └── taskController.js
│   ├── routes/                  # Express Routes Mapping
│   │   └── taskRoutes.js
│   ├── middleware/              # Error Middleware & Not Found Handlers
│   │   └── errorHandler.js
│   ├── data/                    # In-Memory Seed Data & State Reset
│   │   └── tasksData.js
│   ├── tests/                   # Vitest & Supertest Integration Tests
│   │   └── tasks.test.js
│   ├── app.js                   # Express Application Instance
│   ├── server.js                # HTTP Server Entry Point
│   ├── vitest.config.js
│   └── package.json
│
├── package.json                 # Root Orchestration Scripts
└── README.md
```

---

## ⚡ Quick Start & Installation Guide

### Prerequisites
- Node.js `v18+` or `v20+`
- `npm` `v9+`

### 1. Install All Dependencies
Run from root directory:
```bash
npm run install:all
```
*Or install separately:*
```bash
# Backend dependencies
cd server && npm install

# Frontend dependencies
cd ../client && npm install
```

---

## 🚀 Running the Application

### Option A: Run Backend & Frontend Concurrently
```bash
# Terminal 1: Launch Express API Server (Port 5000)
npm run dev:server

# Terminal 2: Launch React Vite App (Port 5173)
npm run dev:client
```

Navigate to `http://localhost:5173` in your browser.

---

## 🧪 Automated Testing Strategy

TaskForge includes 27 working Vitest test assertions covering frontend component interactions and backend API HTTP contracts.

### 1. Run All Test Suites
```bash
npm test
```

### 2. Run React Component Unit Tests Only
```bash
npm run test:client
```
*Executes:*
- `TaskCard.test.jsx`: Renders title, priority badge, status badge, handles completion toggle & deletion callbacks.
- `TaskList.test.jsx`: Renders list grid, empty state fallback, search input filtering, and status filter pills.
- `TaskForm.test.jsx`: Renders input fields, handles user typing, triggers submit callback, and validates non-empty title.
- `Dashboard.test.jsx`: Renders stats cards, hero banner, and CTA triggers cleanly.
- `Counter.test.jsx`: Renders count value, handles increment, decrement, and reset actions.

### 3. Run Express REST API Tests Only
```bash
npm run test:server
```
*Executes Supertest assertions for:*
- `GET /api/tasks`: Asserts 200 status code, JSON response envelope, and task array.
- `GET /api/tasks/:id`: Asserts 200 OK for valid ID & 404 for invalid ID.
- `POST /api/tasks`: Asserts 201 Created for valid task & 400 Bad Request if title is missing.
- `PUT /api/tasks/:id`: Asserts 200 OK for valid updates & 404 for missing task.
- `DELETE /api/tasks/:id`: Asserts 200 OK for deletion & 404 on subsequent lookups.
- `GET /api/stats`: Asserts 200 OK with analytics object & test coverage metrics.

---

## 📡 API Endpoints Reference

| Method | Endpoint | Description | Status Codes |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/tasks` | Fetch tasks (supports `search`, `status`, `priority`, `category`) | `200 OK` |
| **GET** | `/api/tasks/:id` | Fetch single task by ID | `200 OK`, `404 Not Found` |
| **POST** | `/api/tasks` | Create new task item | `201 Created`, `400 Bad Request` |
| **PUT** | `/api/tasks/:id` | Update existing task details | `200 OK`, `400 Bad Request`, `404 Not Found` |
| **DELETE**| `/api/tasks/:id` | Delete task by ID | `200 OK`, `404 Not Found` |
| **GET** | `/api/stats` | Retrieve metrics, coverage, and chart data | `200 OK` |

### API Response Format
```json
{
  "success": true,
  "message": "Tasks fetched successfully",
  "data": []
}
```

---

## 📈 Future Enhancements
- Persistent database integration with MongoDB / PostgreSQL using Prisma ORM.
- OAuth2 & JWT user login authentication.
- Drag-and-drop Kanban board view (`dnd-kit` / React Beautiful DnD).
- Webhooks & GitHub integration for automatic task synchronization.

---

## 📄 License
Licensed under the [MIT License](LICENSE). Built for developer portfolio and Vitest React Testing showcases.
