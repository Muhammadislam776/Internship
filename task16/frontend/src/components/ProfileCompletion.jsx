import React from 'react';
import { CheckCircle2, Circle, ArrowRight, Sparkles } from 'lucide-react';

export const ProfileCompletion = ({ profile, onCompleteAction }) => {
  const completion = profile?.profileCompletion || 0;

  const tasks = [
    { title: 'Upload Profile Picture', completed: profile?.avatar_url && !profile.avatar_url.includes('unsplash'), action: 'upload' },
    { title: 'Add Job Title & Bio', completed: Boolean(profile?.jobTitle && profile?.bio), action: 'edit' },
    { title: 'Specify Location', completed: Boolean(profile?.location), action: 'edit' },
    { title: 'Add Contact Phone', completed: Boolean(profile?.phone), action: 'edit' }
  ];

  return (
    <div className="glass-card" style={{ padding: '1.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sparkles size={18} color="#FF7A18" /> Profile Health & Completion
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Optimization status for your public persona</p>
        </div>
        <div style={{
          fontSize: '1.25rem',
          fontWeight: 800,
          color: completion >= 80 ? '#22C55E' : '#FF7A18'
        }}>
          {completion}%
        </div>
      </div>

      {/* Animated Progress Bar */}
      <div style={{ height: '10px', background: 'rgba(7, 26, 43, 0.8)', borderRadius: '5px', overflow: 'hidden', marginBottom: '1.25rem' }}>
        <div style={{
          height: '100%',
          width: `${completion}%`,
          background: 'linear-gradient(90deg, #2563EB 0%, #22D3EE 50%, #FF7A18 100%)',
          borderRadius: '5px',
          transition: 'width 0.8s ease'
        }} />
      </div>

      {/* Task Checklist */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.25rem' }}>
        {tasks.map((task, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.85rem',
            padding: '0.5rem 0.75rem',
            borderRadius: '8px',
            background: task.completed ? 'rgba(34, 197, 94, 0.08)' : 'rgba(255, 255, 255, 0.03)',
            border: task.completed ? '1px solid rgba(34, 197, 94, 0.2)' : '1px solid rgba(255, 255, 255, 0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: task.completed ? '#22C55E' : '#94A3B8' }}>
              {task.completed ? <CheckCircle2 size={16} /> : <Circle size={16} color="#64748B" />}
              <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>{task.title}</span>
            </div>
            {!task.completed && (
              <button 
                onClick={() => onCompleteAction(task.action)}
                style={{ background: 'transparent', color: '#FF7A18', fontSize: '0.75rem', fontWeight: 700 }}
              >
                Fix now →
              </button>
            )}
          </div>
        ))}
      </div>

      {completion < 100 && (
        <button
          onClick={() => onCompleteAction('upload')}
          className="btn-primary"
          style={{ width: '100%', padding: '0.65rem' }}
        >
          Complete Profile <ArrowRight size={16} />
        </button>
      )}
    </div>
  );
};
