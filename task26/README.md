# DevPulse — Real-Time API Health & Error Intelligence Dashboard

**DevPulse** is a developer observability platform designed to monitor API request traffic, aggregate telemetry metrics, catch and process operational errors globally, and persist structured JSON logs to disk using Winston.

---

## Key Features

- **Winston File Transports**: Machine-readable JSON logs saved automatically into `backend/logs/` (`combined.log`, `error.log`, `exceptions.log`, `rejections.log`).
- **Winston Daily Rotate File**: Automated log file rotation by date and file size bounds.
- **Global Express Error Handler**: Intercepts operational errors (`AppError`) and uncaught JS exceptions, returning clean JSON payloads while logging stack traces to disk.
- **Sub-Millisecond Request Logging**: Custom Express request logger tracking HTTP methods, status codes, response latencies (`process.hrtime`), and client IPs.
- **Real-Time Observability Dashboard**: Built with React, Vite, Bootstrap 5, and Recharts. Features dark-themed observability UI, interactive volume charts, status code pie distribution, error log inspection modals, and live metrics.
- **Interactive Error Sandbox**: Dedicated page allowing developers to trigger 404, 422, 500 errors and uncaught exceptions with one click to verify Winston file logging.
- **Live Traffic Generator**: Single-click traffic simulation endpoint (`POST /api/test/simulate-traffic`) to immediately populate logs.

---

## Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **UI Components & Styling**: Bootstrap 5, Bootstrap Icons, Custom Dark Observability CSS
- **Charts & Visualizations**: Recharts (AreaChart, PieChart)
- **HTTP Client**: Axios with global response interceptors
- **Routing**: React Router DOM (v6)

### Backend
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Logging**: Winston 3 + Winston Daily Rotate File
- **Utilities**: CORS, dotenv, express-async-errors

---

## Project Structure

```text
task26/
├── backend/
│   ├── logs/
│   │   ├── combined.log        # All HTTP requests & application events (JSON format)
│   │   ├── error.log           # HTTP 4xx & 5xx error events with stack traces
│   │   ├── exceptions.log      # Node.js uncaughtException events
│   │   └── rejections.log      # Node.js unhandledRejection events
│   ├── src/
│   │   ├── config/
│   │   │   └── logger.js       # Winston logger configuration & transports
│   │   ├── middleware/
│   │   │   ├── errorHandler.js # Express global error middleware
│   │   │   ├── notFound.js     # 404 catch-all handler
│   │   │   └── requestLogger.js# Sub-millisecond HTTP request logger
│   │   ├── routes/
│   │   │   ├── health.js       # GET /api/health
│   │   │   ├── users.js        # GET/POST /api/users
│   │   │   ├── logs.js         # GET /api/logs, GET /api/logs/errors
│   │   │   ├── metrics.js      # GET /api/metrics
│   │   │   └── testErrors.js   # Intentional error testing endpoints
│   │   ├── utils/
│   │   │   ├── AppError.js     # Custom operational error class
│   │   │   └── logReader.js    # JSON log file parser & metrics aggregator
│   │   ├── app.js              # Express app setup
│   │   └── server.js           # Server startup & process event handlers
│   ├── .env
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/         # MetricCard, ErrorModal, Navbar, Sidebar, StatusBadge
    │   ├── context/            # ToastContext notification engine
    │   ├── pages/              # Dashboard, ApiHealth, RequestLogs, ErrorLogs, Metrics, TestErrors, Settings
    │   ├── services/           # Axios API service client
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

---

## Installation & Running

### 1. Running the Backend Server

```bash
cd backend
npm install
npm run dev
```

The backend server will start at `http://localhost:5000`.

### 2. Running the Frontend Dashboard

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server will start at `http://localhost:5173`.

---

## Environment Variables

### Backend (`backend/.env`)

```ini
PORT=5000
NODE_ENV=development
LOG_LEVEL=info
CORS_ORIGIN=http://localhost:5173
```

---

## Winston Logging Architecture

Winston is configured as the central logging mechanism (`backend/src/config/logger.js`).

| Log File | Purpose | Format |
| --- | --- | --- |
| `combined.log` | Records all incoming HTTP requests (`info`, `warn`, `error`). | Structured JSON |
| `error.log` | Records only HTTP 4xx/5xx failures, validation errors, and uncaught exceptions with full stack traces. | Structured JSON |
| `exceptions.log` | Captures uncaught synchronous Node.js exceptions (`uncaughtException`). | Structured JSON |
| `rejections.log` | Captures unhandled promise rejections (`unhandledRejection`). | Structured JSON |

---

## API Endpoints

### Health & Telemetry
- `GET /api/health` — System uptime, heap memory usage, process details, and operational status.
- `GET /api/metrics` — Aggregated stats (total requests, error rate %, avg response time, status distribution, slowest endpoints).

### Log Inspection
- `GET /api/logs` — Reads and parses `combined.log` with query filters (`level`, `method`, `status`, `search`, `limit`, `page`).
- `GET /api/logs/errors` — Reads and parses `error.log` with stack traces.
- `DELETE /api/logs` — Truncates log files for clean demo slate.

### Users API
- `GET /api/users` — Returns list of users.
- `GET /api/users/:id` — Gets user by ID (returns 404 AppError if not found).
- `POST /api/users` — Creates user (returns 422 AppError if validation fails).

### Testing Error Handling
- `GET /api/test/error` — Triggers a 500 AppError.
- `GET /api/test/not-found` — Triggers a 404 AppError.
- `GET /api/test/validation-error` — Triggers a 422 Validation Error with detailed field rules.
- `GET /api/test/server-error` — Triggers an uncaught JavaScript `TypeError`.
- `POST /api/test/simulate-traffic` — Generates 15+ simulated API requests into Winston log files.

---

## Verification & Testing

1. Open `http://localhost:5173/test-errors` in your browser.
2. Click **Trigger 500 Error** or **Trigger Validation Error**.
3. Observe the clean toast alert in the frontend.
4. Navigate to **Request Logs** or **Error Logs** to view the newly created log entry written by Winston into `backend/logs/error.log`.
5. Click on any log row to inspect full request metadata and formatted stack traces.
