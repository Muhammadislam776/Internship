import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const lineChartData = {
    labels: ['1', '2', '3', '4', '5', '6', '7'],
    datasets: [
      {
        label: 'Sales',
        data: [20, 15, 35, 25, 45, 30, 40],
        borderColor: '#ffffff',
        borderWidth: 2,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#ffffff',
        pointRadius: 0,
        pointHoverRadius: 4,
        tension: 0.4,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    scales: {
      x: { display: false },
      y: { display: false, min: 0 },
    },
  };

  const donutChartData = {
    labels: ['YouTube', 'Facebook', 'Twitter'],
    datasets: [
      {
        data: [25, 50, 25],
        backgroundColor: ['#f44336', '#2196f3', '#00bcd4'],
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverOffset: 4,
      },
    ],
  };

  const donutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: { legend: { display: false } },
  };

  return (
    <div className="dashboard-content">
      {/* 4 Top Cards */}
      <div className="stats-grid">
        {/* Card 1 */}
        <div className="stat-card">
          <div className="card-body">
            <div className="stat-info">
              <h3 className="stat-value text-warning">$30200</h3>
              <p className="stat-label">All Earnings</p>
            </div>
            <div className="stat-icon text-warning">
              <i className="ri-money-dollar-circle-fill"></i>
            </div>
          </div>
          <div className="card-footer bg-warning">
            <span>10% changes on profit</span>
            <i className="ri-line-chart-line"></i>
          </div>
        </div>
        
        {/* Card 2 */}
        <div className="stat-card">
          <div className="card-body">
            <div className="stat-info">
              <h3 className="stat-value text-danger">145</h3>
              <p className="stat-label">Task</p>
            </div>
            <div className="stat-icon text-danger">
              <i className="ri-calendar-event-line"></i>
            </div>
          </div>
          <div className="card-footer bg-danger">
            <span>28% task performance</span>
            <i className="ri-arrow-right-down-line"></i>
          </div>
        </div>
        
        {/* Card 3 */}
        <div className="stat-card">
          <div className="card-body">
            <div className="stat-info">
              <h3 className="stat-value text-success">290+</h3>
              <p className="stat-label">Page Views</p>
            </div>
            <div className="stat-icon text-success">
              <i className="ri-file-text-line"></i>
            </div>
          </div>
          <div className="card-footer bg-success">
            <span>10k daily views</span>
            <i className="ri-line-chart-line"></i>
          </div>
        </div>
        
        {/* Card 4 */}
        <div className="stat-card">
          <div className="card-body">
            <div className="stat-info">
              <h3 className="stat-value text-primary">500</h3>
              <p className="stat-label">Downloads</p>
            </div>
            <div className="stat-icon text-primary">
              <i className="ri-thumb-up-line"></i>
            </div>
          </div>
          <div className="card-footer bg-primary">
            <span>1k download in App store</span>
            <i className="ri-line-chart-line"></i>
          </div>
        </div>
      </div>

      {/* Middle Row */}
      <div className="middle-row">
        {/* Column 1 */}
        <div className="col-chart">
          <div className="chart-card bg-primary text-white mb-4">
            <div className="chart-header">
              <h3 className="font-weight-medium">Sales Per Day</h3>
              <span className="trend"><i className="ri-arrow-right-down-line"></i> 3%</span>
            </div>
            <div className="chart-container" style={{ height: '180px', padding: '0 10px' }}>
              <Line options={lineChartOptions} data={lineChartData} />
            </div>
            <div className="chart-footer-stats">
              <div className="stat-item">
                <h4>$4230</h4>
                <p>Total Revenue</p>
              </div>
              <div className="stat-item">
                <h4>321</h4>
                <p>Today Sales</p>
              </div>
            </div>
          </div>
          
          <div className="ticker-cards">
            <div className="ticker-card">
              <p>REALTY</p>
              <h4 className="text-danger">-0.99</h4>
            </div>
            <div className="ticker-card">
              <p>INFRA</p>
              <h4 className="text-success">-7.66</h4>
            </div>
          </div>
        </div>
        
        {/* Column 2 */}
        <div className="col-chart">
          <div className="chart-card donut-card h-100">
            <h3 className="chart-title">Total Revenue</h3>
            <div className="chart-container flex-center" style={{ height: '200px' }}>
              <div style={{ width: '80%', height: '100%' }}>
                <Doughnut options={donutChartOptions} data={donutChartData} />
              </div>
            </div>
            <div className="chart-legend">
              <div className="legend-item"><span className="dot bg-danger"></span> YouTube</div>
              <div className="legend-item"><span className="dot bg-primary"></span> Facebook</div>
              <div className="legend-item"><span className="dot bg-info"></span> Twitter</div>
            </div>
            
            <div className="revenue-stats mt-4">
              <div className="rev-stat">
                <p>Youtube</p>
                <span className="text-primary">+16.85%</span>
              </div>
              <div className="rev-stat">
                <p>Facebook</p>
                <span className="text-success">+45.36%</span>
              </div>
              <div className="rev-stat">
                <p>Twitter</p>
                <span className="text-warning">-50.69%</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Column 3 */}
        <div className="col-chart">
          <div className="chart-card h-100">
            <h3 className="chart-title">Traffic Sources</h3>
            <div className="progress-list mt-4">
              <div className="progress-item">
                <div className="progress-info">
                  <span>Direct</span>
                  <span>80%</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar bg-primary" style={{ width: '80%' }}></div>
                </div>
              </div>
              
              <div className="progress-item">
                <div className="progress-info">
                  <span>Social</span>
                  <span>50%</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar bg-secondary" style={{ width: '50%' }}></div>
                </div>
              </div>
              
              <div className="progress-item">
                <div className="progress-info">
                  <span>Referral</span>
                  <span>20%</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar bg-primary" style={{ width: '20%' }}></div>
                </div>
              </div>
              
              <div className="progress-item">
                <div className="progress-info">
                  <span>Bounce</span>
                  <span>60%</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar bg-secondary" style={{ width: '60%' }}></div>
                </div>
              </div>
              
              <div className="progress-item">
                <div className="progress-info">
                  <span>Internet</span>
                  <span>40%</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar bg-primary" style={{ width: '40%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
