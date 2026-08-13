import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Shield, FileCode, HardDrive, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

export const Help = () => {
  const [openFaq, setOpenFaq] = useState(0);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const faqs = [
    {
      q: 'How does Profile Picture upload to Supabase work under the hood?',
      a: 'The React frontend sends a multipart/form-data POST request to Express at /api/profile/upload. The backend uses Multer to receive the image buffer, validates MIME type and file size, uploads the buffer directly to Supabase Storage bucket "profile-pictures", and retrieves the public URL to return to React.'
    },
    {
      q: 'Why are Supabase Service Role credentials kept strictly in backend/.env?',
      a: 'The Supabase Service Role key grants full admin privileges (including storage deletion and table mutations). Exposing service role keys in frontend JavaScript builds would introduce critical security vulnerabilities. Keeping credentials backend-only guarantees isolation.'
    },
    {
      q: 'What image formats and file size limits are supported?',
      a: 'ProfileHub accepts JPG, JPEG, PNG, and WEBP formats up to 5MB in size. Files like PDF, TXT, EXE, SVG, or oversized images are blocked at both client and Express middleware validation layers.'
    },
    {
      q: 'What happens when I replace or remove my profile picture?',
      a: 'When uploading a new picture, the Express backend automatically deletes or archives the old image path from Supabase Storage before updating the profile state. When removing a picture, the avatar is reset to the default portrait.'
    },
    {
      q: 'How are file name collisions prevented?',
      a: 'Each uploaded file path is generated dynamically on the backend using user ID, current timestamp, and a random UUID string (e.g., users/user-1/profile-17123456-uuid.webp).'
    }
  ];

  return (
    <div style={{ paddingBottom: '3rem', maxWidth: '850px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <HelpCircle color="#22D3EE" size={28} /> Help & Documentation
        </h2>
        <p style={{ color: '#94A3B8', fontSize: '0.95rem' }}>
          Technical guidance, architecture FAQs, and system support.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* FAQ Accordion Section */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '1.25rem' }}>
            Frequently Asked Questions
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {faqs.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={index} style={{
                  background: 'rgba(7, 26, 43, 0.6)',
                  border: isOpen ? '1px solid rgba(34, 211, 238, 0.35)' : '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  transition: 'all 0.25s ease'
                }}>
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    style={{
                      width: '100%',
                      padding: '1rem 1.25rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'transparent',
                      textAlign: 'left',
                      color: '#FFFFFF',
                      fontSize: '0.95rem',
                      fontWeight: 700
                    }}
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      size={18}
                      color="#22D3EE"
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.25s ease',
                        flexShrink: 0
                      }}
                    />
                  </button>

                  {isOpen && (
                    <div style={{
                      padding: '0 1.25rem 1rem 1.25rem',
                      color: '#94A3B8',
                      fontSize: '0.875rem',
                      lineHeight: '1.6',
                      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                      paddingTop: '0.85rem'
                    }}>
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Technical Support Form */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MessageSquare color="#FF7A18" size={20} /> Developer Support Inquiry
          </h3>
          <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            Need help configuring your Supabase environment or Express routes?
          </p>

          {contactSubmitted ? (
            <div style={{
              background: 'rgba(34, 197, 94, 0.15)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: '12px',
              padding: '1.25rem',
              color: '#22C55E',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <CheckCircle2 size={24} />
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem' }}>Support Request Received</strong>
                <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Our technical team will review your inquiry shortly.</span>
              </div>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setContactSubmitted(true); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#22D3EE', marginBottom: '0.35rem' }}>
                  Issue Subject
                </label>
                <input
                  type="text"
                  placeholder="e.g., Supabase Bucket Permission Error"
                  required
                  style={{
                    width: '100%',
                    background: 'rgba(7, 26, 43, 0.7)',
                    border: '1px solid rgba(34, 211, 238, 0.25)',
                    borderRadius: '10px',
                    padding: '0.75rem 1rem',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#22D3EE', marginBottom: '0.35rem' }}>
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe your question or issue..."
                  required
                  style={{
                    width: '100%',
                    background: 'rgba(7, 26, 43, 0.7)',
                    border: '1px solid rgba(34, 211, 238, 0.25)',
                    borderRadius: '10px',
                    padding: '0.75rem 1rem',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-end', minWidth: '160px' }}>
                <Send size={16} /> Submit Inquiry
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
