import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, Globe, Github, Twitter, Linkedin, Save, X } from 'lucide-react';

export const ProfileForm = ({ profile, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    email: profile?.email || '',
    jobTitle: profile?.jobTitle || '',
    phone: profile?.phone || '',
    location: profile?.location || '',
    bio: profile?.bio || '',
    website: profile?.website || '',
    github: profile?.socialLinks?.github || '',
    twitter: profile?.socialLinks?.twitter || '',
    linkedin: profile?.socialLinks?.linkedin || ''
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      name: formData.name,
      email: formData.email,
      jobTitle: formData.jobTitle,
      phone: formData.phone,
      location: formData.location,
      bio: formData.bio,
      website: formData.website,
      socialLinks: {
        github: formData.github,
        twitter: formData.twitter,
        linkedin: formData.linkedin
      }
    };

    await onSave(payload);
    setSaving(false);
  };

  const inputStyle = {
    width: '100%',
    background: 'rgba(7, 26, 43, 0.7)',
    border: '1px solid rgba(34, 211, 238, 0.25)',
    borderRadius: '10px',
    padding: '0.75rem 1rem 0.75rem 2.6rem',
    color: '#FFFFFF',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'all 0.2s ease'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.8rem',
    fontWeight: 700,
    color: '#22D3EE',
    marginBottom: '0.35rem'
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF' }}>
          Edit Profile Information
        </h3>
        <button type="button" onClick={onCancel} style={{ background: 'transparent', color: '#94A3B8' }}>
          <X size={20} />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        
        {/* Full Name */}
        <div>
          <label style={labelStyle}>Full Name</label>
          <div style={{ position: 'relative' }}>
            <User size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Full Name"
              required
              style={inputStyle}
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label style={labelStyle}>Email Address</label>
          <div style={{ position: 'relative' }}>
            <Mail size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="user@example.com"
              required
              style={inputStyle}
            />
          </div>
        </div>

        {/* Job Title */}
        <div>
          <label style={labelStyle}>Job Title / Role</label>
          <div style={{ position: 'relative' }}>
            <Briefcase size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              placeholder="e.g. Senior Designer"
              style={inputStyle}
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label style={labelStyle}>Phone Number</label>
          <div style={{ position: 'relative' }}>
            <Phone size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
              style={inputStyle}
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label style={labelStyle}>Location</label>
          <div style={{ position: 'relative' }}>
            <MapPin size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="City, Country"
              style={inputStyle}
            />
          </div>
        </div>

        {/* Website */}
        <div>
          <label style={labelStyle}>Website / Portfolio</label>
          <div style={{ position: 'relative' }}>
            <Globe size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://yourwebsite.com"
              style={inputStyle}
            />
          </div>
        </div>

      </div>

      {/* Bio */}
      <div>
        <label style={labelStyle}>Bio / Summary</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          rows={3}
          placeholder="Brief description about your experience..."
          style={{
            ...inputStyle,
            paddingLeft: '1rem',
            resize: 'vertical'
          }}
        />
      </div>

      {/* Social Links */}
      <div>
        <label style={{ ...labelStyle, color: '#FFB86B', marginBottom: '0.6rem' }}>Social Profiles</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
          <div style={{ position: 'relative' }}>
            <Github size={15} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              name="github"
              value={formData.github}
              onChange={handleChange}
              placeholder="GitHub URL"
              style={{ ...inputStyle, paddingLeft: '2.2rem', fontSize: '0.8rem' }}
            />
          </div>
          <div style={{ position: 'relative' }}>
            <Twitter size={15} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              name="twitter"
              value={formData.twitter}
              onChange={handleChange}
              placeholder="Twitter URL"
              style={{ ...inputStyle, paddingLeft: '2.2rem', fontSize: '0.8rem' }}
            />
          </div>
          <div style={{ position: 'relative' }}>
            <Linkedin size={15} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="LinkedIn URL"
              style={{ ...inputStyle, paddingLeft: '2.2rem', fontSize: '0.8rem' }}
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
        <button type="button" onClick={onCancel} className="btn-ghost">
          Cancel
        </button>
        <button type="submit" disabled={saving} className="btn-primary">
          <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};
