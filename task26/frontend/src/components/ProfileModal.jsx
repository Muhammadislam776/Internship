import React from 'react';
import { useToast } from '../context/ToastContext';

const ProfileModal = ({ onClose }) => {
  const { addToast } = useToast();
  const apiKey = 'dp_live_sec_99a84f128c772e001948ba';

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    addToast('API Key copied to clipboard', 'success');
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(5px)', zIndex: 1060 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content bg-dark text-light border border-secondary shadow-lg rounded-4 overflow-hidden">
          
          {/* Header */}
          <div className="modal-header border-bottom border-secondary px-4 py-3 bg-navy d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-person-circle text-primary fs-5"></i>
              <h5 className="modal-title fw-bold text-white mb-0">Developer Profile & Credentials</h5>
            </div>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          {/* Body */}
          <div className="modal-body p-4">
            
            <div className="d-flex align-items-center gap-3 mb-4">
              <div className="avatar-circle rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold fs-3" style={{ width: 60, height: 60 }}>
                A
              </div>
              <div>
                <h4 className="fw-bold text-white mb-0">Alex Rivera</h4>
                <span className="text-secondary small font-mono">Lead SRE & Backend Architect</span>
                <div><span className="badge bg-success-subtle text-success border border-success-subtle font-mono small">ADMIN PERMISSIONS</span></div>
              </div>
            </div>

            <div className="mb-3">
              <label className="text-secondary small font-mono mb-1">DEVELOPER EMAIL</label>
              <input type="text" className="form-input-dark font-mono" value="alex@devpulse.dev" readOnly />
            </div>

            <div className="mb-3">
              <label className="text-secondary small font-mono mb-1">ACTIVE API TOKEN</label>
              <div className="input-group">
                <input type="password" className="form-input-dark font-mono rounded-start" value={apiKey} readOnly />
                <button className="btn btn-outline-secondary font-mono" onClick={copyApiKey}>
                  <i className="bi bi-clipboard me-1"></i> Copy
                </button>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="modal-footer border-top border-secondary px-4 py-3 bg-navy">
            <button type="button" className="btn btn-secondary px-4" onClick={onClose}>
              Close
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
