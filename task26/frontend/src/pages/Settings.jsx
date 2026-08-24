import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('Application');
  const [serviceName, setServiceName] = useState('payment-gateway-v2');
  const [environment, setEnvironment] = useState('Staging');
  const [region, setRegion] = useState('us-east-1');
  const [primaryUrl, setPrimaryUrl] = useState('https://api.staging.devpulse.io/v2');

  const [logLevel, setLogLevel] = useState('DEBUG');
  const [consoleLogging, setConsoleLogging] = useState(true);
  const [fileLogging, setFileLogging] = useState(true);

  const [criticalAlerts, setCriticalAlerts] = useState(true);
  const [errorAnomalies, setErrorAnomalies] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(false);

  const { addToast } = useToast();

  const handleSave = () => {
    addToast('Configuration preferences saved successfully', 'success');
  };

  return (
    <div className="p-4">
      {/* Title */}
      <div className="mb-4">
        <h1 className="fw-bold text-white mb-1" style={{ fontSize: '2.2rem', letterSpacing: '-0.03em' }}>Configuration</h1>
        <p className="text-secondary mb-0">
          Manage your application environment, logging behavior, and alert preferences.
        </p>
      </div>

      <div className="row g-4">
        
        {/* Left Sub-nav Column */}
        <div className="col-12 col-md-3">
          <div className="d-flex flex-column gap-1">
            {['Application', 'Logging', 'Notifications', 'Security & API Keys'].map(tab => (
              <button
                key={tab}
                className={`btn text-start py-2 px-3 rounded-3 font-mono small ${activeTab === tab ? 'bg-primary text-white fw-bold' : 'text-secondary bg-transparent border-0'}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Right Content Column */}
        <div className="col-12 col-md-9 d-flex flex-column gap-4">
          
          {/* Card 1: Application */}
          <div className="card-devpulse">
            <div className="d-flex align-items-center gap-2 mb-1">
              <i className="bi bi-box-seam text-cyan fs-5"></i>
              <h4 className="fw-bold text-white mb-0">Application</h4>
            </div>
            <p className="text-secondary small mb-4">Core details for this specific microservice instance.</p>

            <div className="d-flex flex-column gap-3 mb-4">
              <div>
                <label className="text-secondary small font-mono mb-1">SERVICE NAME</label>
                <input
                  type="text"
                  className="form-input-dark font-mono"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                />
              </div>

              <div className="row g-3">
                <div className="col-6">
                  <label className="text-secondary small font-mono mb-1">ENVIRONMENT</label>
                  <select className="form-select-dark font-mono" value={environment} onChange={(e) => setEnvironment(e.target.value)}>
                    <option value="Production">Production</option>
                    <option value="Staging">Staging</option>
                    <option value="Development">Development</option>
                  </select>
                </div>

                <div className="col-6">
                  <label className="text-secondary small font-mono mb-1">REGION</label>
                  <select className="form-select-dark font-mono" value={region} onChange={(e) => setRegion(e.target.value)}>
                    <option value="us-east-1">us-east-1</option>
                    <option value="us-west-2">us-west-2</option>
                    <option value="eu-central-1">eu-central-1</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-secondary small font-mono mb-1">PRIMARY API URL</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary text-secondary font-mono">https://</span>
                  <input
                    type="text"
                    className="form-input-dark font-mono rounded-start-0"
                    value={primaryUrl.replace('https://', '')}
                    onChange={(e) => setPrimaryUrl('https://' + e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="text-end">
              <button className="btn btn-primary px-4 fw-semibold" onClick={handleSave}>
                Save Changes
              </button>
            </div>
          </div>

          {/* Card 2: Logging Behavior */}
          <div className="card-devpulse">
            <div className="d-flex align-items-center gap-2 mb-1">
              <i className="bi bi-file-earmark-code text-cyan fs-5"></i>
              <h4 className="fw-bold text-white mb-0">Logging Behavior</h4>
            </div>
            <p className="text-secondary small mb-4">Configure verbosity and destination for telemetry data.</p>

            <div className="mb-4">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-secondary small font-mono">LOG LEVEL</span>
                <span className="badge bg-primary font-mono">{logLevel}</span>
              </div>

              {/* Log level slider selector */}
              <div className="d-flex align-items-center justify-content-between bg-dark p-2 rounded border border-secondary font-mono small">
                {['TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR'].map(lvl => (
                  <button
                    key={lvl}
                    className={`btn btn-sm px-3 ${logLevel === lvl ? 'btn-primary fw-bold' : 'btn-dark text-secondary border-0'}`}
                    onClick={() => setLogLevel(lvl)}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div className="d-flex flex-column gap-3">
              <div className="p-3 bg-dark rounded border border-secondary d-flex align-items-center justify-content-between">
                <div>
                  <div className="fw-bold text-white mb-1">Console Logging</div>
                  <div className="text-secondary small">Stream logs to standard output (stdout)</div>
                </div>
                <div className="form-check form-switch fs-4">
                  <input className="form-check-input" type="checkbox" checked={consoleLogging} onChange={(e) => setConsoleLogging(e.target.checked)} />
                </div>
              </div>

              <div className="p-3 bg-dark rounded border border-secondary d-flex align-items-center justify-content-between">
                <div>
                  <div className="fw-bold text-white mb-1">File Logging</div>
                  <div className="text-secondary small font-mono">Write logs to backend/logs/*.log</div>
                </div>
                <div className="form-check form-switch fs-4">
                  <input className="form-check-input" type="checkbox" checked={fileLogging} onChange={(e) => setFileLogging(e.target.checked)} />
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Notifications & Alerts */}
          <div className="card-devpulse">
            <div className="d-flex align-items-center gap-2 mb-1">
              <i className="bi bi-bell text-cyan fs-5"></i>
              <h4 className="fw-bold text-white mb-0">Notifications & Alerts</h4>
            </div>
            <p className="text-secondary small mb-4">Control how and when you are alerted about system events.</p>

            <div className="d-flex flex-column gap-3">
              <div className="d-flex align-items-start gap-3">
                <input className="form-check-input mt-1" type="checkbox" checked={criticalAlerts} onChange={(e) => setCriticalAlerts(e.target.checked)} />
                <div>
                  <div className="fw-bold text-white">Critical System Alerts</div>
                  <div className="text-secondary small">Immediate notifications for downtime or fatal errors (HTTP 5xx &gt; 5%)</div>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3">
                <input className="form-check-input mt-1" type="checkbox" checked={errorAnomalies} onChange={(e) => setErrorAnomalies(e.target.checked)} />
                <div>
                  <div className="fw-bold text-white">Error Rate Anomalies</div>
                  <div className="text-secondary small">Alert when standard error rates spike above baseline predictions</div>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3">
                <input className="form-check-input mt-1" type="checkbox" checked={dailyDigest} onChange={(e) => setDailyDigest(e.target.checked)} />
                <div>
                  <div className="fw-bold text-white">Daily Digest Email</div>
                  <div className="text-secondary small">A summary of the day's API health, logs, and notable metrics sent at 08:00 UTC</div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Settings;
