import { useState, useEffect, useCallback } from 'react';
import { fetchAdminUsers, fetchApiHealth } from '../services/api';

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataSource, setDataSource] = useState('connecting');
  const [apiHealth, setApiHealth] = useState({ status: 'checking', responseTime: 0 });
  
  // Filter & Pagination State
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('all');
  const [status, setStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
    totalUsers: 0,
    totalPages: 1,
    showingFrom: 0,
    showingTo: 0
  });

  const [stats, setStats] = useState({
    totalUsers: 12540,
    newUsersMonth: 840,
    verifiedUsers: 9840,
    unverifiedUsers: 2700,
    activeUsers: 10210,
    adminUsers: 48
  });

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    const startTime = performance.now();

    try {
      const response = await fetchAdminUsers({
        page,
        perPage,
        search,
        role,
        status,
        sortBy
      });

      const endTime = performance.now();
      setApiHealth({
        status: '200 OK',
        responseTime: Math.round(endTime - startTime),
        connected: true
      });

      if (response.success && response.data) {
        setUsers(response.data.users);
        setPagination(response.data.pagination);
        setStats(response.data.stats);
        setDataSource(response.source);
      } else {
        throw new Error('Invalid response payload from Express server');
      }
    } catch (err) {
      console.error('Error loading users:', err);
      setError(err.message || 'Unable to load users. Please check backend connection.');
      setApiHealth({ status: 'ERR_FAILED', responseTime: 0, connected: false });
    } finally {
      setLoading(false);
    }
  }, [page, perPage, search, role, status, sortBy]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Reset page to 1 when filters change
  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1);
  };

  const handleRoleChange = (val) => {
    setRole(val);
    setPage(1);
  };

  const handleStatusChange = (val) => {
    setStatus(val);
    setPage(1);
  };

  const handleSortChange = (val) => {
    setSortBy(val);
    setPage(1);
  };

  const handlePerPageChange = (val) => {
    setPerPage(val);
    setPage(1);
  };

  return {
    users,
    loading,
    error,
    dataSource,
    apiHealth,
    pagination,
    stats,
    page,
    perPage,
    search,
    role,
    status,
    sortBy,
    setPage,
    setPerPage: handlePerPageChange,
    setSearch: handleSearchChange,
    setRole: handleRoleChange,
    setStatus: handleStatusChange,
    setSortBy: handleSortChange,
    refetch: loadUsers
  };
};
