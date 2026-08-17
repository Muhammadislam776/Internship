import React, { useState } from 'react';
import { X, Share2, Link, Copy, Check, Mail, Clock } from 'lucide-react';
import { fileService } from '../services/fileService';

export default function ShareModal({ file, onClose, showToast }) {
  const [activeTab, setActiveTab] = useState('email'); // email or link
  const [email, setEmail] = useState('');
  const [durationHours, setDurationHours] = useState('24');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!file) return null;

  const handleShareEmail = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      setLoading(true);
      await fileService.shareFile(file.id, email.trim());
      if (showToast) showToast(`File successfully shared with ${email}`, 'success');
      onClose();
    } catch (err) {
      if (showToast) showToast(err.message || 'Failed to share file', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateLink = async () => {
    try {
      setLoading(true);
      const res = await fileService.generateShareLink(file, Number(durationHours));
      setGeneratedLink(res.shareUrl);
      if (showToast) showToast('Temporary share link generated!', 'success');
    } catch (err) {
      if (showToast) showToast('Failed to generate link', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    if (showToast) showToast('Share link copied to clipboard!', 'success');
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Share2 size={20} color="var(--electric-blue)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--midnight-navy)' }}>
              Share "{file.file_name}"
            </h3>
          </div>
          <button className="btn-icon" onClick={onClose}><X size={18} /></button>
        </div>

        {/* Tab Selection */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: 'var(--soft-white)', padding: '4px', borderRadius: 'var(--radius-md)' }}>
          <button 
            onClick={() => setActiveTab('email')}
            style={{
              flex: 1,
              padding: '0.6rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: 600,
              border: 'none',
              background: activeTab === 'email' ? 'var(--white)' : 'transparent',
              color: activeTab === 'email' ? 'var(--electric-blue)' : 'rgba(7, 26, 43, 0.6)',
              boxShadow: activeTab === 'email' ? 'var(--shadow-sm)' : 'none',
              cursor: 'pointer'
            }}
          >
            <Mail size={14} style={{ display: 'inline', marginRight: '4px' }} /> Share via Email
          </button>
          <button 
            onClick={() => setActiveTab('link')}
            style={{
              flex: 1,
              padding: '0.6rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: 600,
              border: 'none',
              background: activeTab === 'link' ? 'var(--white)' : 'transparent',
              color: activeTab === 'link' ? 'var(--electric-blue)' : 'rgba(7, 26, 43, 0.6)',
              boxShadow: activeTab === 'link' ? 'var(--shadow-sm)' : 'none',
              cursor: 'pointer'
            }}
          >
            <Link size={14} style={{ display: 'inline', marginRight: '4px' }} /> Create Share Link
          </button>
        </div>

        {/* Tab 1: Share with Email */}
        {activeTab === 'email' && (
          <form onSubmit={handleShareEmail}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--midnight-navy)' }}>
              Recipient Email Address
            </label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(7, 26, 43, 0.15)',
                outline: 'none',
                marginBottom: '1.5rem'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Sharing...' : 'Share Access'}
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Create Expiring Share Link */}
        {activeTab === 'link' && (
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--midnight-navy)' }}>
              Link Expiration Duration
            </label>
            <select 
              value={durationHours}
              onChange={(e) => setDurationHours(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(7, 26, 43, 0.15)',
                outline: 'none',
                marginBottom: '1.25rem',
                background: 'var(--white)'
              }}
            >
              <option value="1">1 Hour Expiration</option>
              <option value="24">24 Hours (1 Day)</option>
              <option value="168">7 Days Expiration</option>
            </select>

            {!generatedLink ? (
              <button className="btn btn-cyan" onClick={handleGenerateLink} disabled={loading} style={{ width: '100%' }}>
                {loading ? 'Generating Signed Link...' : 'Generate Temporary Link'}
              </button>
            ) : (
              <div>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  <input 
                    type="text" 
                    readOnly
                    value={generatedLink}
                    style={{
                      flex: 1,
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--cyber-cyan)',
                      background: 'rgba(34, 211, 238, 0.05)',
                      fontSize: '0.85rem'
                    }}
                  />
                  <button className="btn btn-orange" onClick={handleCopyLink}>
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(7, 26, 43, 0.6)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Clock size={12} color="var(--vibrant-orange)" />
                  <span>This secure link will expire automatically after {durationHours} hours.</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
