import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import MetricCard from '../components/MetricCard';
import { StatusBadge, MethodBadge, LevelBadge } from '../components/StatusBadge';
import ErrorModal from '../components/ErrorModal';
import { MonitoringService } from '../services/api';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4', '#8B5CF6'];

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('24h');
  const [selectedLog, setSelectedLog] = useState(null);
  
  // Table filters
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [metricsRes, logsRes] = await Promise.all([
        MonitoringService.getMetrics(),
        MonitoringService.getLogs({ limit: 15 })
      ]);

      if (metricsRes.success) setMetrics(metricsRes.data);
      if (logsRes.success) setLogs(logsRes.data || []);
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter logs for recent table
  const filteredLogs = logs.filter(log => {
    const matchesSearch = !search || 
      log.message.toLowerCase().includes(search.toLowerCase()) || 
      log.url.toLowerCase().includes(search.toLowerCase()) ||
      log.method.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  // Prepare chart data for Error Distribution
  const pieData = metrics?.statusCodeCounts ? [
    { name: '200 OK', value: metrics.statusCodeCounts['200 OK'] || 0 },
    { name: '201 Created', value: metrics.statusCodeCounts['201 Created'] || 0 },
    { name: '400 Bad Request', value: metrics.statusCodeCounts['400 Bad Request'] || 0 },
    { name: '404 Not Found', value: metrics.statusCodeCounts['404 Not Found'] || 0 },
    { name: '422 Validation', value: metrics.statusCodeCounts['422 Validation Error'] || 0 },
    { name: '500 Server Error', value: metrics.statusCodeCounts['500 Server Error'] || 0 }
  ].filter(item => item.value > 0) : [];

  return (
    <div className="container-fluid p-4">
      {/* Title & Tagline */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold text-white mb-1">API Monitoring Dashboard</h2>
          <p className="text-secondary small mb-0">
            Real-Time API Health & Error Intelligence Platform — Powered by Winston Logging
          </p>
        </div>

        {/* Time Filter Buttons */}
        <div className="btn-group bg-dark p-1 border border-secondary rounded-3">
          {['24h', '7d', '30d'].map(tf => (
            <button
              key={tf}
              className={`btn btn-sm ${timeFilter === tf ? 'btn-primary fw-semibold' : 'btn-outline-dark text-secondary border-0'}`}
              onClick={() => setTimeFilter(tf)}
            >
              {tf === '24h' ? 'Last 24 Hours' : tf === '7d' ? 'Last 7 Days' : 'Last 30 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <MetricCard
            title="Total Requests"
            value={metrics?.totalRequests ? metrics.totalRequests.toLocaleString() : '0'}
            change="+12.4%"
            isPositive={true}
            icon="bi-bar-chart-line-fill"
            color="primary"
            description="Aggregated from Winston combined.log"
          />
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <MetricCard
            title="Successful Requests"
            value={metrics?.successfulRequests ? metrics.successfulRequests.toLocaleString() : '0'}
            change="95.4%"
            isPositive={true}
            icon="bi-check-circle-fill"
            color="success"
            description="HTTP 2xx & 3xx status responses"
          />
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <MetricCard
            title="Error Count"
            value={metrics?.errorCount ? metrics.errorCount.toLocaleString() : '0'}
            change={metrics?.errorRate || '0.0%'}
            isPositive={false}
            icon="bi-exclamation-triangle-fill"
            color="danger"
            description="HTTP 4xx & 5xx caught exceptions"
          />
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <MetricCard
            title="Avg Response Time"
            value={metrics?.avgResponseTime || '0ms'}
            change="-8.2%"
            isPositive={true}
            icon="bi-stopwatch-fill"
            color="cyan"
            description="Average backend latency"
          />
        </div>
      </div>

      {/* Charts Section */}
      <div className="row g-3 mb-4">
        {/* Request Timeline Chart */}
        <div className="col-12 col-lg-8">
          <div className="card card-dark p-3 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div>
                <h5 className="fw-semibold text-white mb-0">API Request Volume & Performance</h5>
                <span className="text-secondary small">Traffic timeline & error distribution</span>
              </div>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle font-mono small">
                LIVE TELEMETRY
              </span>
            </div>

            <div style={{ width: '100%', height: 280 }}>
              {metrics?.timeline && metrics.timeline.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={metrics.timeline}>
                    <defs>
                      <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorErr" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                    <XAxis dataKey="time" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', color: '#FFF' }}
                    />
                    <Area type="monotone" dataKey="requests" stroke="#3B82F6" fillOpacity={1} fill="url(#colorReq)" name="Total Requests" />
                    <Area type="monotone" dataKey="errors" stroke="#EF4444" fillOpacity={1} fill="url(#colorErr)" name="Error Count" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="d-flex align-items-center justify-content-center h-100 text-secondary font-mono">
                  No timeline telemetry recorded yet. Click "Simulate Live Traffic" to populate.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Error Distribution Donut Chart */}
        <div className="col-12 col-lg-4">
          <div className="card card-dark p-3 h-100">
            <div className="mb-3">
              <h5 className="fw-semibold text-white mb-0">HTTP Status Distribution</h5>
              <span className="text-secondary small">Breakdown by status codes</span>
            </div>

            <div style={{ width: '100%', height: 260 }}>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', color: '#FFF' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', color: '#9CA3AF' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="d-flex align-items-center justify-content-center h-100 text-secondary font-mono">
                  No status code distributions available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Logs Table */}
      <div className="card card-dark p-3">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-3 gap-3">
          <div>
            <h5 className="fw-semibold text-white mb-0">Recent API Activity Logs</h5>
            <span className="text-secondary small">Real-time entries captured by Winston File Transport</span>
          </div>

          <div className="d-flex align-items-center gap-2">
            {/* Search Input */}
            <div className="input-group input-group-sm" style={{ width: '220px' }}>
              <span className="input-group-text bg-dark border-secondary text-secondary">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control bg-dark border-secondary text-light placeholder-secondary"
                placeholder="Search logs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Level Filter */}
            <select
              className="form-select form-select-sm bg-dark border-secondary text-light"
              style={{ width: '130px' }}
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
            >
              <option value="all">All Levels</option>
              <option value="info">INFO</option>
              <option value="warn">WARN</option>
              <option value="error">ERROR</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="table table-custom mb-0">
            <thead>
              <tr>
                <th>Level</th>
                <th>Method</th>
                <th>Endpoint</th>
                <th>Status</th>
                <th>Response Time</th>
                <th>Timestamp</th>
                <th className="text-end">Inspect</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-secondary">
                    <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                    Loading live Winston log feed...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-secondary font-mono">
                    No log records match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log, idx) => (
                  <tr key={log.id || idx} onClick={() => setSelectedLog(log)}>
                    <td><LevelBadge level={log.level} /></td>
                    <td><MethodBadge method={log.method} /></td>
                    <td className="font-mono text-cyan">{log.url}</td>
                    <td><StatusBadge statusCode={log.statusCode} /></td>
                    <td className="font-mono text-light">{log.responseTime || `${log.responseTimeMs}ms`}</td>
                    <td className="font-mono text-secondary small">{new Date(log.timestamp).toLocaleTimeString()}</td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-info py-0 px-2 font-mono">
                        <i className="bi bi-eye me-1"></i> Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Detail Inspector Modal */}
      {selectedLog && (
        <ErrorModal
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
