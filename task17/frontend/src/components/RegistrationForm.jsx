import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  ShieldAlert, 
  Calendar, 
  Phone, 
  Globe, 
  Briefcase, 
  Send, 
  Sparkles,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { validateAndRegisterUser } from '../services/api';

export default function RegistrationForm({ onValidationComplete }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    phone: '',
    country: '',
    role: 'developer'
  });

  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for that field as user types
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handlePresets = (presetType) => {
    if (presetType === 'valid') {
      setFormData({
        name: "Samantha Reed",
        email: "samantha.reed@cybersec.io",
        password: "SecurePass@2026",
        confirmPassword: "SecurePass@2026",
        age: 28,
        phone: "+1-555-0199",
        country: "Canada",
        role: "admin"
      });
    } else if (presetType === 'weak_password') {
      setFormData({
        name: "John Smith",
        email: "john@example.com",
        password: "123",
        confirmPassword: "123",
        age: 30,
        phone: "+1-555-0123",
        country: "USA",
        role: "user"
      });
    } else if (presetType === 'invalid_email') {
      setFormData({
        name: "David Kim",
        email: "david-not-an-email",
        password: "ValidPass@123",
        confirmPassword: "ValidPass@123",
        age: 25,
        phone: "+1-555-4321",
        country: "South Korea",
        role: "developer"
      });
    } else if (presetType === 'underage') {
      setFormData({
        name: "Young Coder",
        email: "young@example.com",
        password: "ValidPass@123",
        confirmPassword: "ValidPass@123",
        age: 15,
        phone: "+1-555-9999",
        country: "Germany",
        role: "user"
      });
    }
    setFieldErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});

    const startTime = Date.now();
    const result = await validateAndRegisterUser(formData);
    const duration = Date.now() - startTime;

    setLoading(false);

    if (!result.ok) {
      if (result.data && result.data.errors) {
        setFieldErrors(result.data.errors);
      }
    }

    if (onValidationComplete) {
      onValidationComplete({
        result: result.data,
        status: result.status,
        durationMs: duration,
        submittedPayload: formData
      });
    }
  };

  return (
    <div className="glass-card" style={{ padding: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Express + Zod Test Bench</h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Submit request to <code>POST /api/users</code> to test <code>validateUser</code> middleware.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', alignSelf: 'center', fontWeight: 700 }}>Auto Presets:</span>
          <button type="button" onClick={() => handlePresets('valid')} className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem', background: 'rgba(34, 197, 94, 0.15)', color: '#22C55E', borderColor: '#22C55E' }}>
            ✓ Valid User
          </button>
          <button type="button" onClick={() => handlePresets('weak_password')} className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem', background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', borderColor: '#EF4444' }}>
            ✕ Weak Password
          </button>
          <button type="button" onClick={() => handlePresets('invalid_email')} className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem', background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', borderColor: '#F59E0B' }}>
            ✕ Bad Email
          </button>
          <button type="button" onClick={() => handlePresets('underage')} className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem', background: 'rgba(251, 113, 133, 0.15)', color: '#FB7185', borderColor: '#FB7185' }}>
            ✕ Age &lt; 18
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          {/* Full Name */}
          <div className="form-group">
            <label className="form-label">
              <User size={16} color="#6366F1" /> Full Name *
            </label>
            <div className="input-wrapper">
              <User className="input-icon" size={18} />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Alex Vance"
                className={`form-input ${fieldErrors.name ? 'has-error' : ''}`}
                required
              />
            </div>
            {fieldErrors.name && (
              <div className="field-error-msg">
                <ShieldAlert size={14} /> {fieldErrors.name}
              </div>
            )}
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label">
              <Mail size={16} color="#22D3EE" /> Email Address *
            </label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={18} />
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. alex@example.com"
                className={`form-input ${fieldErrors.email ? 'has-error' : ''}`}
                required
              />
            </div>
            {fieldErrors.email && (
              <div className="field-error-msg">
                <ShieldAlert size={14} /> {fieldErrors.email}
              </div>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">
              <Lock size={16} color="#FF7A18" /> Password *
            </label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min 8 chars, 1 uppercase, 1 special (@$!%*?&)"
                className={`form-input ${fieldErrors.password ? 'has-error' : ''}`}
                required
              />
            </div>
            {fieldErrors.password && (
              <div className="field-error-msg">
                <ShieldAlert size={14} /> {fieldErrors.password}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label className="form-label">
              <Lock size={16} color="#FB7185" /> Confirm Password *
            </label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Must match password exactly"
                className={`form-input ${fieldErrors.confirmPassword ? 'has-error' : ''}`}
                required
              />
            </div>
            {fieldErrors.confirmPassword && (
              <div className="field-error-msg">
                <ShieldAlert size={14} /> {fieldErrors.confirmPassword}
              </div>
            )}
          </div>

          {/* Age */}
          <div className="form-group">
            <label className="form-label">
              <Calendar size={16} color="#22C55E" /> Age (Min 18) *
            </label>
            <div className="input-wrapper">
              <Calendar className="input-icon" size={18} />
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Must be 18 or older"
                className={`form-input ${fieldErrors.age ? 'has-error' : ''}`}
                required
              />
            </div>
            {fieldErrors.age && (
              <div className="field-error-msg">
                <ShieldAlert size={14} /> {fieldErrors.age}
              </div>
            )}
          </div>

          {/* Phone */}
          <div className="form-group">
            <label className="form-label">
              <Phone size={16} color="#6366F1" /> Phone Number *
            </label>
            <div className="input-wrapper">
              <Phone className="input-icon" size={18} />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. +1-555-0192"
                className={`form-input ${fieldErrors.phone ? 'has-error' : ''}`}
                required
              />
            </div>
            {fieldErrors.phone && (
              <div className="field-error-msg">
                <ShieldAlert size={14} /> {fieldErrors.phone}
              </div>
            )}
          </div>

          {/* Country */}
          <div className="form-group">
            <label className="form-label">
              <Globe size={16} color="#22D3EE" /> Country *
            </label>
            <div className="input-wrapper">
              <Globe className="input-icon" size={18} />
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="e.g. United States"
                className={`form-input ${fieldErrors.country ? 'has-error' : ''}`}
                required
              />
            </div>
            {fieldErrors.country && (
              <div className="field-error-msg">
                <ShieldAlert size={14} /> {fieldErrors.country}
              </div>
            )}
          </div>

          {/* Role */}
          <div className="form-group">
            <label className="form-label">
              <Briefcase size={16} color="#FF7A18" /> Assigned Role *
            </label>
            <div className="input-wrapper">
              <Briefcase className="input-icon" size={18} />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`form-input ${fieldErrors.role ? 'has-error' : ''}`}
              >
                <option value="admin">admin</option>
                <option value="developer">developer</option>
                <option value="analyst">analyst</option>
                <option value="user">user</option>
              </select>
            </div>
            {fieldErrors.role && (
              <div className="field-error-msg">
                <ShieldAlert size={14} /> {fieldErrors.role}
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', maxWidth: '320px' }}
          >
            {loading ? (
              <span>Validating with Zod Middleware...</span>
            ) : (
              <>
                <Send size={18} />
                <span>Execute POST /api/users</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
