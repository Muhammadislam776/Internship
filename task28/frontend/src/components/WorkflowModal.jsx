import React, { useState, useEffect } from 'react';
import { X, Play, CheckCircle2, ArrowRight, Database, Server, MousePointer, Layout, PlusCircle } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: '1. CREATE TASK',
    subtitle: 'React UI Form',
    icon: PlusCircle,
    desc: 'User creates a task via React modal form. React state triggers POST /api/tasks.',
    color: 'from-vibrant to-amber-500'
  },
  {
    id: 2,
    title: '2. KANBAN BOARD',
    subtitle: 'dnd-kit Container',
    icon: Layout,
    desc: 'Task renders dynamically inside Kanban column with priority badges and action handlers.',
    color: 'from-purple-500 to-indigo-500'
  },
  {
    id: 3,
    title: '3. DRAG TASK',
    subtitle: 'Optimistic Event',
    icon: MousePointer,
    desc: 'User drags card to new column. UI immediately updates task status with optimistic position.',
    color: 'from-cyber to-electric'
  },
  {
    id: 4,
    title: '4. EXPRESS API',
    subtitle: 'PATCH /api/tasks/:id',
    icon: Server,
    desc: 'Express controller validates task ID, status, and position payload.',
    color: 'from-electric to-blue-700'
  },
  {
    id: 5,
    title: '5. DATABASE',
    subtitle: 'MongoDB Mongoose',
    icon: Database,
    desc: 'MongoDB updates task document & shifts positions of sibling tasks atomically.',
    color: 'from-emerald-500 to-teal-600'
  },
  {
    id: 6,
    title: '6. UPDATED BOARD',
    subtitle: 'Persisted State Sync',
    icon: CheckCircle2,
    desc: 'Express returns 200 OK. Position remains saved after browser refresh!',
    color: 'from-emerald-400 to-cyber'
  }
];

const WorkflowModal = ({ isOpen, onClose }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    let interval;
    if (isOpen && isPlaying) {
      interval = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % steps.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isOpen, isPlaying]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-dark/80 backdrop-blur-xl animate-fade-in">
      <div className="glass-card rounded-3xl border border-cyber/30 max-w-3xl w-full p-6 sm:p-8 shadow-glass relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-6">
          <div>
            <span className="px-2.5 py-0.5 text-[10px] font-bold bg-cyber/20 text-cyber border border-cyber/30 rounded-md uppercase tracking-wider">
              System Architecture
            </span>
            <h2 className="text-2xl font-extrabold text-white mt-1">
              FlowBoard End-to-End Workflow
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-electric/20 text-cyber border border-cyber/30 rounded-xl text-xs font-semibold hover:bg-electric hover:text-white transition-all"
            >
              <Play className={`w-3.5 h-3.5 ${isPlaying ? 'animate-pulse text-cyber' : ''}`} />
              {isPlaying ? 'Pause Demo' : 'Auto Play'}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Steps Flow Timeline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = activeStep === idx;

            return (
              <div
                key={step.id}
                onClick={() => {
                  setActiveStep(idx);
                  setIsPlaying(false);
                }}
                className={`cursor-pointer p-4 rounded-2xl border transition-all duration-300 ${
                  isActive
                    ? 'bg-midnight-hover border-cyber shadow-cyan-glow scale-[1.02]'
                    : 'bg-midnight/60 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-xl bg-gradient-to-tr ${step.color} text-white`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-cyber/20 text-cyber border border-cyber/30' : 'text-slate-400'
                  }`}>
                    Step {step.id}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white">{step.title}</h4>
                <p className="text-[11px] font-semibold text-cyber mt-0.5">{step.subtitle}</p>
              </div>
            );
          })}
        </div>

        {/* Active Step Details Panel */}
        <div className="p-5 rounded-2xl bg-midnight-dark border border-cyber/20 relative overflow-hidden">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-2xl bg-gradient-to-tr ${steps[activeStep].color} text-white shrink-0`}>
              {React.createElement(steps[activeStep].icon, { className: 'w-6 h-6' })}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{steps[activeStep].title}</h3>
                <span className="text-xs text-cyber font-mono font-bold">({steps[activeStep].subtitle})</span>
              </div>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {steps[activeStep].desc}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1 bg-midnight mt-5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyber via-electric to-vibrant transition-all duration-300"
              style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10 text-xs">
          <span className="text-slate-400">
            Step {activeStep + 1} of {steps.length}
          </span>
          <button
            onClick={() => setActiveStep((prev) => (prev + 1) % steps.length)}
            className="flex items-center gap-2 px-4 py-2 bg-electric hover:bg-electric-hover text-white font-bold rounded-xl shadow-blue-glow transition-all"
          >
            <span>Next Step</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkflowModal;
