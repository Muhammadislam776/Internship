import React, { useState } from 'react';
import { Activity as ActivityIcon, Upload, Edit3, ShieldCheck, Database, Search, Filter, Clock } from 'lucide-react';

export const Activity = ({ profile }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const defaultLogs = [
    {
      id: 'act-1',
      title: 'Profile Picture Uploaded',
      details: `File uploaded to Supabase Storage bucket 'profile-pictures'`,
      timestamp: new Date().toLocaleTimeString(),
      date: 'Today',
      type: 'upload',
      icon: Upload,
      color: '#FF7A18'
    },
    {
      id: 'act-2',
      title: 'Profile Metadata Synchronized',
      details: 'Updated name, job title, and contact details.',
      timestamp: '10:42 AM',
      date: 'Today',
      type: 'update',
      icon: Edit3,
      color: '#22D3EE'
    },
    {
      id: 'act-3',
      title: 'Supabase Bucket Verified',
      details: 'Connected to https://trlfqixivlddirlatymn.supabase.co',
      timestamp: '09:15 AM',
      date: 'Today',
      type: 'system',
      icon: Database,
      color: '#22C55E'
    },
    {
      id: 'act-4',
      title: 'MIME Type & Size Security Scan',
      details: 'Verified strict 5MB upload constraints and allowed extensions.',
      timestamp: 'Yesterday',
      date: 'Yesterday',
      type: 'security',
      icon: ShieldCheck,
      color: '#FFB86B'
    }
  ];

  const filteredLogs = defaultLogs.filter(log => {
    const matchesSearch = log.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || log.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div style={{ paddingBottom: '3rem', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ActivityIcon color="#FF7A18" size={28} /> Activity Log & Audit Trail
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '0.95rem' }}>
            Real-time record of file operations, uploads, and system events.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Search Input */}
          <div style={{ position: 'relative' }}>
            <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                background: 'rgba(7, 26, 43, 0.7)',
                border: '1px solid rgba(34, 211, 238, 0.25)',
                borderRadius: '10px',
                padding: '0.55rem 1rem 0.55rem 2.4rem',
                color: '#FFFFFF',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Filter Dropdown */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{
              background: '#0B253A',
              border: '1px solid rgba(34, 211, 238, 0.25)',
              borderRadius: '10px',
              padding: '0.55rem 1rem',
              color: '#22D3EE',
              fontSize: '0.85rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="all">All Events</option>
            <option value="upload">Uploads</option>
            <option value="update">Updates</option>
            <option value="security">Security</option>
            <option value="system">System</option>
          </select>
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="glass-card" style={{ padding: '1.75rem' }}>
        {filteredLogs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#94A3B8' }}>
            No activity logs match your search filter.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredLogs.map((log) => {
              const Icon = log.icon;
              return (
                <div key={log.id} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  padding: '1rem',
                  borderRadius: '14px',
                  background: 'rgba(7, 26, 43, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  transition: 'transform 0.2s ease, border-color 0.2s ease'
                }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: `${log.color}20`,
                    border: `1px solid ${log.color}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: log.color,
                    flexShrink: 0
                  }}>
                    <Icon size={20} />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                      <h4 style={{ color: '#FFFFFF', fontSize: '0.95rem', fontWeight: 700 }}>{log.title}</h4>
                      <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Clock size={12} /> {log.timestamp}
                      </span>
                    </div>
                    <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>{log.details}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
