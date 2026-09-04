import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle2, Kanban, Users, ArrowRight } from 'lucide-react';

const ProjectCard = ({ project }) => {
  const {
    _id,
    name,
    description,
    cover_image,
    status = 'ACTIVE',
    progress = 0,
    totalTasks = 0,
    completedTasks = 0,
    dueDate,
    members = []
  } = project;

  const formattedDueDate = dueDate
    ? new Date(dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'No due date';

  return (
    <div className="glass-card rounded-3xl overflow-hidden border border-cyber/20 hover:border-cyber/50 hover:shadow-cyan-glow transition-all duration-300 flex flex-col justify-between group">
      {/* Top Cover Image */}
      <div className="relative w-full h-40 overflow-hidden">
        <img
          src={cover_image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-midnight-dark via-midnight-dark/40 to-transparent" />

        {/* Status Badge Overlay */}
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 text-[10px] font-extrabold bg-midnight/80 backdrop-blur-md text-cyber border border-cyber/30 rounded-full uppercase tracking-wider shadow-glass">
            {status}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-extrabold text-white group-hover:text-cyber transition-colors leading-snug">
            {name}
          </h3>
          <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Progress Bar Section */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            <span className="text-slate-300">Completion</span>
            <span className="text-cyber font-bold">{progress}%</span>
          </div>
          <div className="w-full bg-midnight rounded-full h-2 overflow-hidden border border-white/5">
            <div
              className="bg-gradient-to-r from-electric via-cyber to-vibrant h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Card Footer: Metadata & Team Avatars */}
        <div className="flex items-center justify-between border-t border-white/10 mt-5 pt-4 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-semibold text-slate-300">
              <Kanban className="w-4 h-4 text-electric" />
              {totalTasks} Tasks
            </span>
            <span className="flex items-center gap-1 font-semibold text-slate-400">
              <Clock className="w-4 h-4 text-slate-400" />
              {formattedDueDate}
            </span>
          </div>

          {/* Team Avatars Stack */}
          <div className="flex items-center -space-x-2">
            {members.slice(0, 4).map((member, idx) => (
              <img
                key={idx}
                src={member.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                alt={member.name || 'Member'}
                className="w-6 h-6 rounded-full object-cover ring-2 ring-midnight"
                title={member.name}
              />
            ))}
          </div>
        </div>

        {/* Action Button */}
        <Link
          to={`/projects/${_id}/board`}
          className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 bg-electric/15 hover:bg-electric text-cyber hover:text-white border border-cyber/30 rounded-2xl text-xs font-bold transition-all shadow-glass"
        >
          <span>Open Kanban Board</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;
