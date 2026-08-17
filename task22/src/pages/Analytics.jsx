import React from 'react';
import { usePerformance } from '../context/PerformanceContext';
import { BarChart2, PieChart, Tag, DollarSign, Star, TrendingUp } from 'lucide-react';

export function Analytics() {
  const { items, categoryCounts, datasetStats } = usePerformance();

  // Price range breakdown
  const priceRanges = {
    '$0 - $250': items.filter(i => i.price <= 250).length,
    '$251 - $500': items.filter(i => i.price > 250 && i.price <= 500).length,
    '$501 - $750': items.filter(i => i.price > 500 && i.price <= 750).length,
    '$751 - $1000': items.filter(i => i.price > 750).length,
  };

  // Status breakdown
  const statusCounts = {
    Active: items.filter(i => i.status === 'Active').length,
    Featured: items.filter(i => i.status === 'Featured').length,
    Pending: items.filter(i => i.status === 'Pending').length,
    Archived: items.filter(i => i.status === 'Archived').length,
  };

  return (
    <div className="page-wrapper">
      
      {/* Header */}
      <div className="glass-card" style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
          <BarChart2 size={24} style={{ color: 'var(--primary)' }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Dataset Telemetry & Analytics</h2>
        </div>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Detailed statistical distribution and analytics across all {items.length.toLocaleString()} items.
        </p>
      </div>

      {/* Summary KPI Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header"><DollarSign size={16} /> Average Price</div>
          <div className="metric-value" style={{ color: 'var(--emerald)' }}>${datasetStats.avgPrice}</div>
          <div className="metric-sub">Total dataset value: ${datasetStats.totalValue.toLocaleString()}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header"><Star size={16} /> Average Rating</div>
          <div className="metric-value" style={{ color: '#FBBF24' }}>{datasetStats.avgRating} / 5.0</div>
          <div className="metric-sub">Quality distribution score</div>
        </div>

        <div className="metric-card">
          <div className="metric-header"><TrendingUp size={16} /> Bookmarked Items</div>
          <div className="metric-value" style={{ color: 'var(--rose)' }}>{datasetStats.favoriteCount}</div>
          <div className="metric-sub">Favorite retention rate</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Category Breakdown Bar Chart */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PieChart size={18} style={{ color: 'var(--sky)' }} /> Category Distribution
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {Object.entries(categoryCounts).filter(([cat]) => cat !== 'All').map(([category, count]) => {
              const percentage = Math.round((count / items.length) * 100);
              return (
                <div key={category}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.3rem' }}>
                    <span style={{ fontWeight: 600 }}>{category}</span>
                    <span style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>{count} ({percentage}%)</span>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${percentage}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, var(--primary) 0%, var(--sky) 100%)',
                        borderRadius: 'var(--radius-full)'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Price Range Breakdown */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <DollarSign size={18} style={{ color: 'var(--emerald)' }} /> Price Tier Distribution
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {Object.entries(priceRanges).map(([range, count]) => {
              const percentage = Math.round((count / items.length) * 100);
              return (
                <div key={range}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.3rem' }}>
                    <span style={{ fontWeight: 600 }}>{range}</span>
                    <span style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>{count} items ({percentage}%)</span>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${percentage}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, var(--emerald) 0%, var(--cyan) 100%)',
                        borderRadius: 'var(--radius-full)'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
