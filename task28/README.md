# 🚀 FlowBoard

> **"Plan Better. Move Faster. Get Things Done."**

FlowBoard is a modern, collaborative full-stack project management application engineered for speed, focus, and visual elegance. Built with React, Vite, Express, and MongoDB, FlowBoard delivers an interactive Kanban experience with real-time optimistic state sync, persistent drag-and-drop position reordering, 3D statistic perspective cards, multi-column search & filtering, interactive workflow architecture demo, and comprehensive project analytics.

---

## 🌟 Key Features

- 📌 **Interactive Kanban Board with Real Drag & Drop**:
  - 5 Column Pipeline: `BACKLOG`, `TO DO`, `IN PROGRESS`, `IN REVIEW`, `DONE`.
  - Built with `@dnd-kit/core` and `@dnd-kit/sortable` for reliable, accessible, drag-and-drop interaction.
  - Cyan and Electric Blue glowing insertion indicators and drop targets.
  - **Persistent Dragging**: Frontend optimistic state update → `PATCH /api/tasks/:id` with `{ status, position }` → MongoDB document and position index updates → Retains order after browser refresh!
  - **Automatic Rollback**: If network or API connection fails, the UI rolls back to previous position with error toast notification and retry option.

- 🃏 **3D Perspective Flip Statistic Cards**:
  - Interactive metric cards featuring smooth 3D `rotateY` perspective flips on hover/tap.
  - Displays Total Tasks, Completion Rate, In Progress metrics, and Overdue deliverables.

- ▶️ **Interactive Workflow Play Card**:
  - "How FlowBoard Works" demonstration card with interactive Play button.
  - Step-by-step animated modal demonstrating data flow: `CREATE TASK` → `KANBAN BOARD` → `DRAG TASK` → `EXPRESS API` → `DATABASE` → `UPDATED BOARD`.

- 📋 **Project Workspaces**:
  - Project cards with cover images, computed progress bars, team avatars, and milestone deadlines.

- 🔍 **Instant Search & Multi-Filter Engine**:
  - Global real-time search across task title, description, and tags.
  - Filter by Priority (`ALL`, `LOW`, `MEDIUM`, `HIGH`, `URGENT`), Assignee, Status, or Project.
  - Sort by Newest, Oldest, Due Date, Priority, or Alphabetical.

- 📝 **Subtasks & Comments Thread**:
  - Subtask checklist with progress bar (`0/4 completed`). Add, toggle, and delete subtasks.
  - Interactive comment thread with team member avatars and timestamps (`POST /api/tasks/:id/comments`).

- 📅 **Calendar & Analytics Dashboard**:
  - Deadline calendar view displaying upcoming tasks synced with the database.
  - Interactive Recharts visualization (Task Status donut distribution, Team Workload bar chart, Project Progress velocity line chart).

- 👥 **Team Workload Management**:
  - Member workspace overview displaying assigned tasks count, workload completion ratio, and role titles.

- 🎨 **Midnight Productivity Theme**:
  - `Midnight Navy` (`#071A2B`), `Electric Blue` (`#2563EB`), `Cyber Cyan` (`#22D3EE`), `Vibrant Orange` (`#FF7A18`), `Soft White` (`#F8FAFC`).
  - Glassmorphic panels, floating cards, ambient glows, smooth shadows, micro-interactions, and modern typography (`Plus Jakarta Sans`).

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **Routing**: React Router DOM (v6)
- **Drag and Drop**: `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`
- **Styling**: Tailwind CSS v3 + Custom Glassmorphism & 3D CSS
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose ORM
- **Authentication**: JSON Web Tokens (JWT) + bcryptjs
- **Middleware**: CORS, Dotenv, Custom Error Handling

---

## 📁 Repository Structure

```
task27/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── projectController.js
│   │   │   ├── taskController.js
│   │   │   ├── userController.js
│   │   │   └── seedController.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   └── errorMiddleware.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Project.js
│   │   │   └── Task.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── projectRoutes.js
│   │   │   ├── taskRoutes.js
│   │   │   ├── userRoutes.js
│   │   │   └── seedRoutes.js
│   │   └── server.js
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── KanbanBoard.jsx
│   │   │   ├── KanbanColumn.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   ├── TaskModal.jsx
│   │   │   ├── TaskDetailsModal.jsx
│   │   │   ├── CreateTaskModal.jsx
│   │   │   ├── ProjectCard.jsx
│   │   │   ├── StatsCards.jsx
│   │   │   ├── FlipCard.jsx
│   │   │   ├── PlayCard.jsx
│   │   │   ├── WorkflowModal.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── FilterBar.jsx
│   │   │   ├── NotificationCenter.jsx
│   │   │   └── Toast.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── BoardPage.jsx
│   │   │   ├── MyTasksPage.jsx
│   │   │   ├── CalendarPage.jsx
│   │   │   ├── AnalyticsPage.jsx
│   │   │   ├── TeamPage.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── taskService.js
│   │   │   ├── projectService.js
│   │   │   └── authService.js
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ToastContext.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## 🌐 Express REST API Endpoints

### Tasks API
- `GET /api/tasks` — List tasks with optional `project_id`, `status`, `priority`, `search` query parameters
- `GET /api/tasks/:id` — Get single task with subtasks and comments
- `POST /api/tasks` — Create task document
- `PUT /api/tasks/:id` — Full update task document
- `PATCH /api/tasks/:id` — Drag & Drop position & status update (`{ status, position }`)
- `DELETE /api/tasks/:id` — Delete task and re-index sibling task positions
- `POST /api/tasks/:id/comments` — Add comment to task
- `POST /api/tasks/:id/subtasks` — Add subtask item
- `PATCH /api/tasks/:id/subtasks/:subtaskId` — Toggle subtask completion status
- `DELETE /api/tasks/:id/subtasks/:subtaskId` — Delete subtask item

### Projects API
- `GET /api/projects` — List projects with computed progress percentage
- `GET /api/projects/:id` — Get single project details
- `POST /api/projects` — Create project
- `PUT /api/projects/:id` — Update project
- `DELETE /api/projects/:id` — Delete project & associated tasks

### Users & Auth API
- `POST /api/auth/register` — Register user account
- `POST /api/auth/login` — Login user account & return JWT token
- `GET /api/auth/me` — Get authenticated user details
- `GET /api/users` — List team members with assigned tasks workload
- `POST /api/seed` — Seed MongoDB with realistic initial project and task data

---

## 🗄️ Database Schema (MongoDB Mongoose)

```javascript
// Task Model
{
  project_id: ObjectId (ref: Project),
  title: String,
  description: String,
  status: Enum ['BACKLOG', 'TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'],
  priority: Enum ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
  position: Number,
  assignee_id: ObjectId (ref: User),
  due_date: Date,
  cover_image: String,
  tags: [String],
  subtasks: [{ title: String, completed: Boolean }],
  comments: [{ user_id: ObjectId, content: String, createdAt: Date }],
  timestamps: true
}
```

---

## ⚡ Setup & Installation

### Prerequisites
- Node.js (v18+)
- npm (v9+)
- MongoDB running locally on `mongodb://127.0.0.1:27017/flowboard`

### 1. Clone & Install Dependencies
```bash
# Install Backend Dependencies
cd backend
npm install

# Install Frontend Dependencies
cd ../frontend
npm install
```

### 2. Environment Variables
Backend `.env` file (`backend/.env`):
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/flowboard
JWT_SECRET=flowboard_super_secret_jwt_key_2026_midnight_productivity
NODE_ENV=development
```

### 3. Start Backend Server & Seed Database
```bash
cd backend
npm run dev
# Server runs at http://localhost:5000
```
To seed initial data, send a `POST` request to `http://localhost:5000/api/seed` or click "Switch to Demo User" in the header.

### 4. Start Frontend Development Server
```bash
cd frontend
npm run dev
# Application runs at http://localhost:3000
```

---

## 🧪 Testing Verification Checklist

1. **Create Task Test**: Open Create Task modal → Fill details → Click Submit → Task appears immediately in selected column.
2. **Drag & Drop Test**: Drag card from `TODO` to `IN_PROGRESS` → UI updates instantly → `PATCH /api/tasks/:id` request is sent to Express → MongoDB updates.
3. **Refresh Persistence Test**: Refresh page after drag → Task remains in `IN_PROGRESS` column and target position.
4. **Vertical Reorder Test**: Drag task vertically within column → Position updates in database.
5. **Move to DONE Test**: Move task to `DONE` → Status updates → Overall project progress % recalculates automatically.
6. **API Failure Rollback Test**: Simulate API disconnect during drag → Task reverts to original column with error toast and Retry button.
7. **Search Test**: Type query in search bar → Card list filters instantly across titles and tags.
8. **Priority Filter Test**: Select `URGENT` or `HIGH` pill → Board filters cards matching selected priority.
9. **Delete Task Test**: Open task menu → Click Delete → Confirmation modal → Task removed from UI and MongoDB.

---

## 🛡️ Security Best Practices
- Password hashing with `bcryptjs` (salt rounds: 10).
- JWT session tokens passed via `Authorization: Bearer <token>` headers.
- Input validation and sanitized error responses without leaking internal stack traces in production.
- Protected API routes and fallback handlers for unauthenticated sessions.

---

## 🏆 Final Result
FlowBoard provides a production-grade, portfolio-ready full-stack SaaS experience combining speed, persistent drag-and-drop state, original Midnight Navy visual identity, 3D metric cards, and comprehensive team analytics.
