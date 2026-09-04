import React, { useState, useEffect } from 'react';
import ProjectCard from '../components/ProjectCard';
import { ProjectSkeleton } from '../components/LoadingSkeleton';
import { projectService } from '../services/projectService';
import { FolderKanban, Plus, Search, Sparkles } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '', cover_image: '' });
  const { addToast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await projectService.getProjects();
      if (res.success) setProjects(res.projects);
    } catch (err) {
      console.error('Projects Fetch Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProject.name.trim()) return;

    try {
      const res = await projectService.createProject(newProject);
      if (res.success) {
        setProjects([res.project, ...projects]);
        setIsCreateOpen(false);
        setNewProject({ name: '', description: '', cover_image: '' });
        addToast('Project created successfully!', 'success');
      }
    } catch (err) {
      addToast('Failed to create project', 'error');
    }
  };

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-cyber/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FolderKanban className="w-5 h-5 text-cyber" />
            <h1 className="text-2xl font-extrabold text-white">Project Workspaces</h1>
          </div>
          <p className="text-xs text-slate-400">Manage products, campaigns, and team deliverables</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-midnight border border-cyber/20 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyber"
            />
          </div>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-vibrant to-amber-500 text-white font-bold text-xs rounded-xl shadow-orange-glow hover:scale-105 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <ProjectSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-dark/80 backdrop-blur-xl animate-fade-in">
          <div className="glass-card rounded-3xl border border-cyber/30 max-w-md w-full p-6 shadow-glass">
            <h2 className="text-xl font-extrabold text-white mb-4">Create New Project</h2>
            <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CRM Development"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="w-full px-3 py-2 bg-midnight border border-cyber/20 rounded-xl text-white focus:outline-none focus:border-cyber"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Short description..."
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full px-3 py-2 bg-midnight border border-cyber/20 rounded-xl text-white focus:outline-none focus:border-cyber"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Cover Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newProject.cover_image}
                  onChange={(e) => setNewProject({ ...newProject, cover_image: e.target.value })}
                  className="w-full px-3 py-2 bg-midnight border border-cyber/20 rounded-xl text-white focus:outline-none focus:border-cyber"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 text-slate-300 hover:text-white rounded-xl hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-vibrant text-white font-bold rounded-xl shadow-orange-glow"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
