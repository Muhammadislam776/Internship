import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import TasksPage from './pages/TasksPage.jsx';
import AnalyticsPage from './pages/AnalyticsPage.jsx';
import TestingDashboardPage from './pages/TestingDashboardPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import TaskModal from './components/TaskModal.jsx';
import Toast from './components/Toast.jsx';

import { 
  fetchTasks, 
  createTask as apiCreateTask, 
  updateTask as apiUpdateTask, 
  deleteTask as apiDeleteTask, 
  fetchStats 
} from './services/api.js';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/custom.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState('light');
  
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Toast Notifications State
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    showToast(`Switched to ${nextTheme} theme`);
  };

  // Initial Data Fetching
  const loadData = async () => {
    setLoading(true);
    try {
      const [tasksRes, statsRes] = await Promise.all([
        fetchTasks(),
        fetchStats()
      ]);

      if (tasksRes.success) setTasks(tasksRes.data);
      if (statsRes.success) setStats(statsRes.data);
    } catch (err) {
      showToast('Error loading tasks. Using fallback mode.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    loadData();
  }, []);

  // CRUD Handlers
  const handleCreateOrUpdateTask = async (formData) => {
    try {
      if (editingTask) {
        const res = await apiUpdateTask(editingTask.id, formData);
        if (res.success) {
          showToast('Task updated successfully 🎉');
          loadData();
        }
      } else {
        const res = await apiCreateTask(formData);
        if (res.success) {
          showToast('Task created successfully 🎉');
          loadData();
        }
      }
    } catch (err) {
      showToast(err.message || 'Operation failed', 'error');
    } finally {
      setEditingTask(null);
    }
  };

  const handleToggleComplete = async (task) => {
    const newStatus = task.status === 'Completed' ? 'Todo' : 'Completed';
    try {
      const res = await apiUpdateTask(task.id, { status: newStatus });
      if (res.success) {
        if (newStatus === 'Completed') {
          showToast('Task completed successfully ✓');
        } else {
          showToast('Task marked as pending');
        }
        loadData();
      }
    } catch (err) {
      showToast('Failed to update task status', 'error');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const res = await apiDeleteTask(id);
      if (res.success) {
        showToast('Task deleted successfully');
        loadData();
      }
    } catch (err) {
      showToast('Failed to delete task', 'error');
    }
  };

  const handleOpenEdit = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  return (
    <div className="min-vh-100 d-flex flex-column" data-testid="app-root">
      
      {/* Sticky Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenSearch={() => setActiveTab('tasks')}
        onOpenCreateModal={handleOpenCreate}
      />

      {/* Main Content Area */}
      <main className="container-fluid px-3 px-md-4 py-3 flex-grow-1">
        {activeTab === 'dashboard' && (
          <DashboardPage
            stats={stats}
            tasks={tasks}
            loading={loading}
            onToggleComplete={handleToggleComplete}
            onEdit={handleOpenEdit}
            onDelete={handleDeleteTask}
            onOpenCreateModal={handleOpenCreate}
            onNavigateToTasks={() => setActiveTab('tasks')}
            onNavigateToAnalytics={() => setActiveTab('analytics')}
          />
        )}

        {activeTab === 'tasks' && (
          <TasksPage
            tasks={tasks}
            loading={loading}
            onToggleComplete={handleToggleComplete}
            onEdit={handleOpenEdit}
            onDelete={handleDeleteTask}
            onOpenCreateModal={handleOpenCreate}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsPage stats={stats} tasks={tasks} />
        )}

        {activeTab === 'testing' && (
          <TestingDashboardPage />
        )}

        {activeTab === 'settings' && (
          <SettingsPage
            theme={theme}
            toggleTheme={toggleTheme}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Global Task Creation/Editing Modal */}
      <TaskModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleCreateOrUpdateTask}
        initialTask={editingTask}
      />

      {/* Toast Notifications Overlay */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

    </div>
  );
}

export default App;
