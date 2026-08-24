let tasksStore = [
  {
    id: "task-1",
    title: "Implement Authentication UI",
    description: "Design and build responsive light glassmorphism login and signup screens with form validation.",
    priority: "High",
    status: "Completed",
    category: "Frontend",
    dueDate: "2026-08-25",
    createdAt: "2026-08-15T09:30:00.000Z"
  },
  {
    id: "task-2",
    title: "Write Vitest React Unit Tests",
    description: "Create comprehensive unit tests for TaskCard, TaskList, TaskForm, and Dashboard components.",
    priority: "Critical",
    status: "In Progress",
    category: "Testing",
    dueDate: "2026-08-22",
    createdAt: "2026-08-16T14:15:00.000Z"
  },
  {
    id: "task-3",
    title: "Optimize API Performance",
    description: "Implement query optimization, payload compression, and request caching for Express REST endpoints.",
    priority: "Medium",
    status: "Todo",
    category: "Backend",
    dueDate: "2026-08-28",
    createdAt: "2026-08-17T11:00:00.000Z"
  },
  {
    id: "task-4",
    title: "Refactor Glassmorphism Design System",
    description: "Apply light translucent backdrop blurs, soft cyan highlights, and responsive typography across all views.",
    priority: "High",
    status: "Completed",
    category: "UI/UX",
    dueDate: "2026-08-20",
    createdAt: "2026-08-18T08:45:00.000Z"
  },
  {
    id: "task-5",
    title: "Create Express API Integration Tests",
    description: "Use Supertest and Vitest to test CRUD REST API endpoints and verify status codes & error formats.",
    priority: "Critical",
    status: "Completed",
    category: "Testing",
    dueDate: "2026-08-21",
    createdAt: "2026-08-18T16:20:00.000Z"
  },
  {
    id: "task-6",
    title: "Deploy TaskForge Production Build",
    description: "Set up CI/CD pipeline, run automated test suites, and generate optimized production bundle.",
    priority: "Low",
    status: "Todo",
    category: "DevOps",
    dueDate: "2026-08-30",
    createdAt: "2026-08-19T10:00:00.000Z"
  }
];

export const getTasksData = () => tasksStore;

export const resetTasksData = (initialData = null) => {
  if (initialData) {
    tasksStore = [...initialData];
  } else {
    tasksStore = [
      {
        id: "task-1",
        title: "Implement Authentication UI",
        description: "Design and build responsive light glassmorphism login and signup screens with form validation.",
        priority: "High",
        status: "Completed",
        category: "Frontend",
        dueDate: "2026-08-25",
        createdAt: "2026-08-15T09:30:00.000Z"
      },
      {
        id: "task-2",
        title: "Write Vitest React Unit Tests",
        description: "Create comprehensive unit tests for TaskCard, TaskList, TaskForm, and Dashboard components.",
        priority: "Critical",
        status: "In Progress",
        category: "Testing",
        dueDate: "2026-08-22",
        createdAt: "2026-08-16T14:15:00.000Z"
      },
      {
        id: "task-3",
        title: "Optimize API Performance",
        description: "Implement query optimization, payload compression, and request caching for Express REST endpoints.",
        priority: "Medium",
        status: "Todo",
        category: "Backend",
        dueDate: "2026-08-28",
        createdAt: "2026-08-17T11:00:00.000Z"
      },
      {
        id: "task-4",
        title: "Refactor Glassmorphism Design System",
        description: "Apply light translucent backdrop blurs, soft cyan highlights, and responsive typography across all views.",
        priority: "High",
        status: "Completed",
        category: "UI/UX",
        dueDate: "2026-08-20",
        createdAt: "2026-08-18T08:45:00.000Z"
      },
      {
        id: "task-5",
        title: "Create Express API Integration Tests",
        description: "Use Supertest and Vitest to test CRUD REST API endpoints and verify status codes & error formats.",
        priority: "Critical",
        status: "Completed",
        category: "Testing",
        dueDate: "2026-08-21",
        createdAt: "2026-08-18T16:20:00.000Z"
      },
      {
        id: "task-6",
        title: "Deploy TaskForge Production Build",
        description: "Set up CI/CD pipeline, run automated test suites, and generate optimized production bundle.",
        priority: "Low",
        status: "Todo",
        category: "DevOps",
        dueDate: "2026-08-30",
        createdAt: "2026-08-19T10:00:00.000Z"
      }
    ];
  }
};
