import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import KanbanBoard from '../components/KanbanBoard';
import FilterBar from '../components/FilterBar';
import { taskService } from '../services/taskService';
import { projectService } from '../services/projectService';
import { authService } from '../services/authService';
import { Kanban, Plus, Sparkles, FolderKanban } from 'lucide-react';
import { TaskSkeleton } from '../components/LoadingSkeleton';

const BoardPage = ({
  searchQuery,
  setSearchQuery,
  onOpenCreateTask,
  onSelectTask,
  onEditTask,
  onDeleteTask
}) => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [assigneeFilter, setAssigneeFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchInitialData();
  }, [projectId]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [projRes, userRes] = await Promise.all([
        projectService.getProjects(),
        authService.getUsers()
      ]);

      if (projRes.success) {
        setProjects(projRes.projects);
        if (projectId) {
          const found = projRes.projects.find((p) => p._id === projectId);
          setCurrentProject(found || projRes.projects[0]);
        } else if (projRes.projects.length > 0) {
          setCurrentProject(projRes.projects[0]);
        }
      }

      if (userRes.success) setUsers(userRes.users);

      const targetProjId = projectId || (projRes.projects[0]?._id);
      if (targetProjId) {
        const taskRes = await taskService.getTasks({ project_id: targetProjId });
        if (taskRes.success) setTasks(taskRes.tasks);
      }
    } catch (err) {
      console.error('BoardPage fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectChange = async (newProjId) => {
    navigate(`/projects/${newProjId}/board`);
  };

  // Filter & Sort tasks client-side
  let processedTasks = tasks.filter((t) => {
    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchDesc = t.description && t.description.toLowerCase().includes(q);
      const matchTag = t.tags && t.tags.some((tag) => tag.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchTag) return false;
    }

    // Priority filter
    if (priorityFilter !== 'ALL' && t.priority !== priorityFilter) {
      return false;
    }

    // Assignee filter
    if (assigneeFilter !== 'ALL') {
      if (!t.assignee_id || t.assignee_id._id !== assigneeFilter) {
        return false;
      }
    }

    return true;
  });

  // Sorting
  processedTasks.sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortBy === 'dueDate') {
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      return new Date(a.due_date) - new Date(b.due_date);
    }
    if (sortBy === 'priority') {
      const priorityOrder = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
      return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
    }
    if (sortBy === 'alphabetical') return a.title.localeCompare(b.title);
    return 0;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Board Top Header */}
      <div className="glass-card rounded-3xl p-6 border border-cyber/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-electric/15 text-cyber border border-cyber/30">
            <Kanban className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-white">
                {currentProject ? currentProject.name : 'FlowBoard Kanban'}
              </h1>
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-cyber/20 text-cyber border border-cyber/30 rounded-full">
                Interactive Drag & Drop
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {currentProject?.description || 'Drag tasks between columns to persist status and order in Express & MongoDB'}
            </p>
          </div>
        </div>

        {/* Project Selector & Add Task */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={currentProject?._id || ''}
            onChange={(e) => handleProjectChange(e.target.value)}
            className="px-4 py-2.5 bg-midnight border border-cyber/30 rounded-2xl text-xs font-bold text-white focus:outline-none focus:border-cyber cursor-pointer"
          >
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                📁 {p.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => onOpenCreateTask && onOpenCreateTask(currentProject?._id)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-vibrant to-amber-500 hover:from-vibrant-hover text-white text-xs font-bold rounded-2xl shadow-orange-glow transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <FilterBar
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        assigneeFilter={assigneeFilter}
        setAssigneeFilter={setAssigneeFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        users={users}
        onResetFilters={() => {
          setPriorityFilter('ALL');
          setAssigneeFilter('ALL');
          setSortBy('newest');
          setSearchQuery && setSearchQuery('');
        }}
      />

      {/* Main Kanban Board */}
      {loading ? (
        <div className="flex gap-4 overflow-x-auto">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-72 shrink-0 glass-panel rounded-3xl p-4 min-h-[500px]">
              <TaskSkeleton />
            </div>
          ))}
        </div>
      ) : (
        <KanbanBoard
          tasks={processedTasks}
          setTasks={setTasks}
          onSelectTask={onSelectTask}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
          onAddTask={() => onOpenCreateTask && onOpenCreateTask(currentProject?._id)}
        />
      )}
    </div>
  );
};

export default BoardPage;
