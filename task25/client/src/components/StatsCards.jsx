import React from 'react';
import { FiCheckCircle, FiClock, FiList, FiShield, FiArrowUpRight } from 'react-icons/fi';

const StatsCards = ({ stats = {} }) => {
  const cardsData = [
    {
      id: 'total',
      title: 'Total Tasks',
      value: stats.totalTasks ?? 128,
      description: 'Active project backlog items',
      trend: '+12% this week',
      icon: FiList,
      colorClass: 'text-primary',
      gradientTextClass: 'gradient-text',
      bgIcon: 'rgba(99, 102, 241, 0.16)',
      borderColor: 'rgba(99, 102, 241, 0.3)'
    },
    {
      id: 'completed',
      title: 'Completed',
      value: stats.completed ?? 94,
      description: 'Successfully shipped features',
      trend: '+18% completed',
      icon: FiCheckCircle,
      colorClass: 'text-success',
      gradientTextClass: 'gradient-text-emerald',
      bgIcon: 'rgba(16, 185, 129, 0.16)',
      borderColor: 'rgba(16, 185, 129, 0.3)'
    },
    {
      id: 'inProgress',
      title: 'In Progress',
      value: stats.inProgress ?? 21,
      description: 'Currently under active dev',
      trend: '4 high priority',
      icon: FiClock,
      colorClass: 'text-warning-emphasis',
      gradientTextClass: 'gradient-text-amber',
      bgIcon: 'rgba(245, 158, 11, 0.16)',
      borderColor: 'rgba(245, 158, 11, 0.3)'
    },
    {
      id: 'coverage',
      title: 'Test Coverage',
      value: `${stats.testCoverage ?? 92}%`,
      description: 'Vitest & Supertest suite score',
      trend: '27/27 Passing',
      icon: FiShield,
      colorClass: 'text-purple',
      gradientTextClass: 'gradient-text-purple',
      bgIcon: 'rgba(139, 92, 246, 0.16)',
      borderColor: 'rgba(139, 92, 246, 0.3)'
    }
  ];

  return (
    <div className="row g-3 mb-4">
      {cardsData.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.id} className="col-12 col-sm-6 col-lg-3">
            <div 
              className="glass-panel glass-panel-hover p-4 h-100 d-flex flex-column justify-content-between position-relative"
              style={{ borderColor: card.borderColor }}
            >
              
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="fs-7 text-secondary fw-extrabold text-uppercase tracking-wider">{card.title}</span>
                  <div 
                    className="p-2.5 rounded-3 d-flex align-items-center justify-content-center shadow-xs"
                    style={{ background: card.bgIcon }}
                  >
                    <Icon className={card.colorClass} size={22} />
                  </div>
                </div>

                <div className={`display-5 fw-extrabold mb-1 tracking-tight ${card.gradientTextClass}`}>
                  {card.value}
                </div>

                <p className="fs-7 text-muted mb-3 fw-bold">
                  {card.description}
                </p>
              </div>

              <div className="d-flex align-items-center gap-1 fs-7 fw-extrabold text-success pt-2.5 border-top border-secondary-subtle">
                <FiArrowUpRight size={16} />
                <span>{card.trend}</span>
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
