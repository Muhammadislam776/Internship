import React, { useState, useEffect } from 'react';
import { fetchUsers } from '../services/api';
import { Users as UsersIcon, Search, Filter, ArrowUpDown, ShieldCheck, UserCheck, Calendar, Globe, Mail } from 'lucide-react';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');

  const loadUsers = async () => {
    const data = await fetchUsers();
    if (data.success) {
      setUsers(data.users);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = users
    .filter((u) => {
      const matchesSearch = 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.country.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;

      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'age') return a.age - b.age;
      return 0;
    });

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case 'admin':
        return { bg: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', border: 'rgba(239, 68, 68, 0.4)' };
      case 'developer':
        return { bg: 'rgba(34, 211, 238, 0.15)', color: '#22D3EE', border: 'rgba(34, 211, 238, 0.4)' };
      case 'analyst':
        return { bg: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', border: 'rgba(245, 158, 11, 0.4)' };
      default:
        return { bg: 'rgba(99, 102, 241, 0.15)', color: '#6366F1', border: 'rgba(99, 102, 241, 0.4)' };
    }
  };

  return (
    <div>
      <div className="section-header">
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 14px',
          background: 'rgba(34, 197, 94, 0.12)',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          borderRadius: '20px',
          fontSize: '0.82rem',
          fontWeight: 700,
          color: '#22C55E',
          marginBottom: '12px'
        }}>
          <UserCheck size={14} /> SANITIZED DATABASE DIRECTORY
        </div>

        <h1 className="section-title">Validated Users Directory</h1>
        <p className="section-subtitle">
          Every user record below passed Zod schema validation rules on the Express backend before insertion.
        </p>
      </div>

      {/* Controls Bar */}
      <div className="glass-card" style={{ padding: '20px 24px', marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        {/* Search */}
        <div className="input-wrapper" style={{ width: '280px' }}>
          <Search className="input-icon" size={18} />
          <input
            type="text"
            placeholder="Search by name, email, country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Role Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={16} color="#94A3B8" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="form-input"
              style={{ width: '140px' }}
            >
              <option value="ALL">All Roles</option>
              <option value="admin">Admin</option>
              <option value="developer">Developer</option>
              <option value="analyst">Analyst</option>
              <option value="user">User</option>
            </select>
          </div>

          {/* Sort By */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ArrowUpDown size={16} color="#94A3B8" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-input"
              style={{ width: '150px' }}
            >
              <option value="newest">Sort: Newest</option>
              <option value="name">Sort: Name (A-Z)</option>
              <option value="age">Sort: Age</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {filteredUsers.length === 0 ? (
          <div className="glass-card" style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: '#94A3B8' }}>
            No validated users match your search criteria.
          </div>
        ) : (
          filteredUsers.map((user) => {
            const roleStyle = getRoleBadgeStyle(user.role);
            const initials = user.name
              ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase()
              : 'U';

            return (
              <div key={user.id} className="glass-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                  {/* Avatar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '16px',
                      background: 'linear-gradient(135deg, #6366F1, #22D3EE)',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1.1rem',
                      boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)'
                    }}>
                      {initials}
                    </div>

                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{user.name}</h3>
                      <div style={{ fontSize: '0.8rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Mail size={12} /> {user.email}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Badges Bar */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    background: roleStyle.bg,
                    color: roleStyle.color,
                    border: `1px solid ${roleStyle.border}`
                  }}>
                    Role: {user.role}
                  </span>

                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    background: 'rgba(34, 197, 94, 0.12)',
                    color: '#22C55E',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <ShieldCheck size={12} /> {user.status}
                  </span>
                </div>

                {/* Details Footer */}
                <div style={{
                  borderTop: '1px solid rgba(99, 102, 241, 0.15)',
                  paddingTop: '12px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px',
                  fontSize: '0.82rem',
                  color: '#94A3B8'
                }}>
                  <div><strong>Age:</strong> {user.age} yrs</div>
                  <div><strong>Country:</strong> {user.country}</div>
                  <div><strong>Phone:</strong> {user.phone}</div>
                  <div style={{ fontSize: '0.75rem' }}>
                    <strong>Created:</strong> {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
