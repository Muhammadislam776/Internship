import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StatsCards from '../components/StatsCards';
import PlayCard from '../components/PlayCard';
import WorkflowModal from '../components/WorkflowModal';
import ProjectCard from '../components/ProjectCard';
import KanbanBoard from '../components/KanbanBoard';
import { StatsSkeleton } from '../components/LoadingSkeleton';
import { projectService } from '../services/projectService';
import { taskService } from '../services/taskService';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight, Kanban, Plus, Flame } from 'lucide-react';

const Dashboard = ({ searchQuery, onOpenCreateTask, onSelectTask, onEditTask, onDeleteTask }) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isWorkflowOpen, setIsWorkflowOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, taskRes] = await Promise.all([
          projectService.getProjects(),
          taskService.getTasks()
        ]);

        if (projRes.success) setProjects(projRes.projects);
        if (taskRes.success) setTasks(taskRes.tasks);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Compute overall stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'DONE').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const overdueTasks = tasks.filter((t) => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'DONE').length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Filter tasks if searchQuery present
  const filteredTasks = searchQuery
    ? tasks.filter((t) => t.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : tasks;

  return (
    <div className="space-y-8 pb-12">
      {/* HERO GREETING SECTION */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-cyber/20 bg-gradient-to-r from-midnight via-midnight-card to-electric/10 shadow-glass relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 text-xs font-bold bg-cyber/20 text-cyber border border-cyber/30 rounded-full flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-vibrant" /> FlowBoard Executive Suite
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Good Morning, {user?.name || 'Muhammad'} 👋
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              "Stay focused, keep your projects moving."
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenCreateTask}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-vibrant to-amber-500 hover:from-vibrant-hover text-white text-xs font-bold rounded-2xl shadow-orange-glow hover:scale-[1.02] active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create Task</span>
            </button>
            <Link
              to="/board"
              className="flex items-center gap-2 px-5 py-3 bg-electric/20 text-cyber hover:bg-electric hover:text-white border border-cyber/30 rounded-2xl text-xs font-bold shadow-glass transition-all"
            >
              <Kanban className="w-4 h-4" />
              <span>Full Board</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 3D FLIP & STATISTIC CARDS */}
      {loading ? (
        <StatsSkeleton />
      ) : (
        <StatsCards
          stats={{
            totalTasks,
            completedTasks,
            inProgressTasks,
            overdueTasks,
            activeProjects: projects.length,
            teamMembers: 5,
            progressPercentage
          }}
        />
      )}

      {/* INTERACTIVE PLAY CARD */}
      <PlayCard onOpenWorkflow={() => setIsWorkflowOpen(true)} />

      {/* ACTIVE PROJECTS SECTION */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-extrabold text-white">Active Projects</h2>
            <p className="text-xs text-slate-400">Track milestones & execution velocity</p>
          </div>
          <Link
            to="/projects"
            className="flex items-center gap-1.5 text-xs font-bold text-cyber hover:underline"
          >
            <span>View All Projects</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.slice(0, 3).map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      </div>

      {/* LIVE KANBAN BOARD PREVIEW */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-extrabold text-white">Live Kanban Pipeline</h2>
            <p className="text-xs text-slate-400">Drag and drop tasks between columns to persist API updates</p>
          </div>
        </div>

        <KanbanBoard
          tasks={filteredTasks}
          setTasks={setTasks}
          onSelectTask={onSelectTask}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
          onAddTask={onOpenCreateTask}
        />
      </div>

      {/* WORKFLOW MODAL */}
      <WorkflowModal isOpen={isWorkflowOpen} onClose={() => setIsWorkflowOpen(false)} />
    </div>
  );
};

export default Dashboard;
