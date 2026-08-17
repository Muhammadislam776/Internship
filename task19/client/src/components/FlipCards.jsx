import React, { useState } from 'react';
import { Key, ShieldCheck, Lock, ArrowRight, RotateCw } from 'lucide-react';

export const FlipCards = () => {
  const [flippedIndex, setFlippedIndex] = useState(null);

  const cards = [
    {
      id: 1,
      badge: "AUTHENTICATION STANDARD",
      frontTitle: "JWT",
      frontSubtitle: "JSON Web Token",
      icon: Key,
      iconColor: "#22D3EE",
      backContent: "Used to securely identify authenticated users without storing session state on the server. Contains cryptographically signed payload.",
      spec: "RFC 7519 Compliant"
    },
    {
      id: 2,
      badge: "HEADER SPECIFICATION",
      frontTitle: "AUTH HEADER",
      frontSubtitle: "Bearer Token",
      icon: ShieldCheck,
      iconColor: "#2563EB",
      backContent: "JWT is transmitted through the Authorization header format: Authorization: Bearer <token>. Middleware verifies format strictly.",
      spec: "HTTP Bearer Scheme"
    },
    {
      id: 3,
      badge: "ACCESS CONTROL",
      frontTitle: "PROTECTED API",
      frontSubtitle: "Access Controlled",
      icon: Lock,
      iconColor: "#FF7A18",
      backContent: "Only authenticated requests with a valid token can access this resource. Invalid tokens trigger an instant 401 Unauthorized response.",
      spec: "authMiddleware Protected"
    }
  ];

  return (
    <section style={{ padding: '4rem 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(37, 99, 235, 0.1)',
            border: '1px solid rgba(37, 99, 235, 0.3)',
            padding: '0.35rem 0.85rem',
            borderRadius: '2rem',
            color: '#2563EB',
            fontSize: '0.8rem',
            fontWeight: '700',
            marginBottom: '0.75rem'
          }}>
            <RotateCw style={{ width: '14px', height: '14px' }} />
            <span>HOVER / TAP TO FLIP CARDS</span>
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#071A2B', letterSpacing: '-0.02em' }}>
            Core Authentication Architecture
          </h2>
          <p style={{ color: '#64748B', maxWidth: '600px', margin: '0.5rem auto 0 auto', fontSize: '0.95rem' }}>
            Interactive 3D security primitives governing SecureGate's Express middleware pipeline.
          </p>
        </div>

        <div className="grid-3">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            const isFlipped = flippedIndex === idx;

            return (
              <div 
                key={card.id} 
                className="flip-card-container"
                onClick={() => setFlippedIndex(isFlipped ? null : idx)}
              >
                <div className={`flip-card ${isFlipped ? 'flipped' : ''}`}>
                  
                  {/* Front Side */}
                  <div className="flip-card-front">
                    <div>
                      <div style={{
                        display: 'inline-block',
                        fontSize: '0.65rem',
                        fontWeight: '800',
                        color: card.iconColor,
                        letterSpacing: '0.05em',
                        marginBottom: '1rem',
                        background: 'rgba(7, 26, 43, 0.04)',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '0.3rem'
                      }}>
                        {card.badge}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '0.75rem',
                          background: `rgba(${card.id === 1 ? '34,211,238' : card.id === 2 ? '37,99,235' : '255,122,24'}, 0.12)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Icon style={{ width: '24px', height: '24px', color: card.iconColor }} />
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#071A2B', lineHeight: '1.2' }}>
                            {card.frontTitle}
                          </h3>
                          <p style={{ color: '#64748B', fontWeight: '600', fontSize: '0.9rem' }}>
                            {card.frontSubtitle}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: '0.75rem' }}>
                      <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>
                        {card.spec}
                      </span>
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#2563EB', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        Flip Card <ArrowRight style={{ width: '12px', height: '12px' }} />
                      </span>
                    </div>
                  </div>

                  {/* Back Side */}
                  <div className="flip-card-back">
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#22D3EE', letterSpacing: '0.05em' }}>
                          SECURITY SPECIFICATION
                        </span>
                        <Icon style={{ width: '18px', height: '18px', color: '#22D3EE' }} />
                      </div>

                      <p style={{ color: '#E2E8F0', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                        "{card.backContent}"
                      </p>
                    </div>

                    <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: '#22C55E', fontWeight: '600' }}>✓ Verified Component</span>
                      <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Click to flip back</span>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
