import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import CreateTaskModal from './components/CreateTaskModal';
import TaskDetailsModal from './components/TaskDetailsModal';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import BoardPage from './pages/BoardPage';
import MyTasksPage from './pages/MyTasksPage';
import CalendarPage from './pages/CalendarPage';
import AnalyticsPage from './pages/AnalyticsPage';
import TeamPage from './pages/TeamPage';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { projectService } from './services/projectService';
import { authService } from './services/authService';
import { taskService } from './services/taskService';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const MainLayout = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [defaultColumnStatus, setDefaultColumnStatus] = useState('TODO');
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { addToast } = useToast();

  useEffect(() => {
    fetchSharedData();
  }, []);

  const fetchSharedData = async () => {
    try {
      const [projRes, userRes] = await Promise.all([
        projectService.getProjects(),
        authService.getUsers()
      ]);
      if (projRes.success) setProjects(projRes.projects);
      if (userRes.success) setUsers(userRes.users);
    } catch (err) {
      console.warn('Layout data load:', err);
    }
  };

  const handleOpenCreateTask = (columnOrProjectId) => {
    if (typeof columnOrProjectId === 'string' && ['BACKLOG', 'TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'].includes(columnOrProjectId)) {
      setDefaultColumnStatus(columnOrProjectId);
    } else {
      setDefaultColumnStatus('TODO');
    }
    setIsCreateOpen(true);
  };

  const handleSelectTask = (task) => {
    setSelectedTask(task);
    setIsDetailsOpen(true);
  };

  const handleDeleteTask = async (task) => {
    if (window.confirm(`Delete task "${task.title}"?`)) {
      try {
        const res = await taskService.deleteTask(task._id);
        if (res.success) {
          addToast('Task deleted successfully', 'success');
          setIsDetailsOpen(false);
          // Refresh window location or trigger refresh event if needed
          window.location.reload();
        }
      } catch (err) {
        addToast('Failed to delete task', 'error');
      }
    }
  };

  return (
    <div className="min-h-screen bg-midnight-dark text-slate-100 flex flex-col font-sans">
      {/* Fixed Glass Header */}
      <Header
        onOpenCreateTask={() => handleOpenCreateTask()}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Workspace Body */}
      <div className="flex pt-16 flex-1 max-w-[1920px] w-full mx-auto">
        <Sidebar projects={projects} />

        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden min-w-0">
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard
                    searchQuery={searchQuery}
                    onOpenCreateTask={handleOpenCreateTask}
                    onSelectTask={handleSelectTask}
                    onDeleteTask={handleDeleteTask}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard
                    searchQuery={searchQuery}
                    onOpenCreateTask={handleOpenCreateTask}
                    onSelectTask={handleSelectTask}
                    onDeleteTask={handleDeleteTask}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects"
              element={
                <ProtectedRoute>
                  <Projects />
                </ProtectedRoute>
              }
            />
            <Route
              path="/board"
              element={
                <ProtectedRoute>
                  <BoardPage
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onOpenCreateTask={handleOpenCreateTask}
                    onSelectTask={handleSelectTask}
                    onDeleteTask={handleDeleteTask}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/:projectId/board"
              element={
                <ProtectedRoute>
                  <BoardPage
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onOpenCreateTask={handleOpenCreateTask}
                    onSelectTask={handleSelectTask}
                    onDeleteTask={handleDeleteTask}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-tasks"
              element={
                <ProtectedRoute>
                  <MyTasksPage
                    onSelectTask={handleSelectTask}
                    onDeleteTask={handleDeleteTask}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/calendar"
              element={
                <ProtectedRoute>
                  <CalendarPage onSelectTask={handleSelectTask} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <AnalyticsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/team"
              element={
                <ProtectedRoute>
                  <TeamPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>

      {/* Global Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        projects={projects}
        users={users}
        defaultStatus={defaultColumnStatus}
        onTaskCreated={(task) => {
          setIsCreateOpen(false);
          window.location.reload();
        }}
      />

      {/* Global Task Details Modal */}
      <TaskDetailsModal
        task={selectedTask}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onTaskUpdated={(updatedTask) => setSelectedTask(updatedTask)}
        onDeleteTask={handleDeleteTask}
      />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/*" element={<MainLayout />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
