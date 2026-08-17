import React, { useState } from 'react';
import { Play, X, CheckCircle2, ChevronRight, ChevronLeft, Shield, Lock, Key, Server, Send, UserCheck, Check } from 'lucide-react';

export const HowItWorksModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      step: 1,
      title: "1. User Logs In",
      subtitle: "Client submits email and password credentials",
      detail: "The user submits their credentials from the login form via POST /api/auth/login. The payload includes raw email and password over a secure HTTPS connection.",
      icon: UserCheck,
      color: "#2563EB"
    },
    {
      step: 2,
      title: "2. Server Verifies Credentials",
      subtitle: "Database query & salted bcrypt password comparison",
      detail: "Express authController looks up the user by email in the database and compares the entered password against the stored salted hash using bcrypt.compare().",
      icon: Server,
      color: "#22D3EE"
    },
    {
      step: 3,
      title: "3. Server Creates JWT",
      subtitle: "Cryptographic signing using process.env.JWT_SECRET",
      detail: "Upon credential verification, server signs a JWT containing safe user payload (id, email) with process.env.JWT_SECRET and expiration timestamp (24h).",
      icon: Key,
      color: "#FF7A18"
    },
    {
      step: 4,
      title: "4. Client Receives & Stores JWT",
      subtitle: "Client persists token in application state",
      detail: "The client receives HTTP 200 JSON response containing { success: true, token, user } and securely stores the token in local storage / auth context.",
      icon: Lock,
      color: "#2563EB"
    },
    {
      step: 5,
      title: "5. Client Sends Bearer Header",
      subtitle: "Authorization: Bearer <JWT> attached to protected requests",
      detail: "For every subsequent request to protected APIs (like /api/auth/me), the client includes the token in the HTTP Authorization header using the Bearer scheme.",
      icon: Send,
      color: "#22D3EE"
    },
    {
      step: 6,
      title: "6. Middleware Verifies JWT",
      subtitle: "Express authMiddleware intercepts & validates signature",
      detail: "authMiddleware checks header existence, validates Bearer scheme format, verifies token signature with JWT_SECRET, and decodes payload onto req.user.",
      icon: Shield,
      color: "#22C55E"
    },
    {
      step: 7,
      title: "7. Protected Route Accessible",
      subtitle: "Controller executes and returns protected user data",
      detail: "With req.user attached, authMiddleware calls next(). The protected route controller executes safely and returns user profile data with HTTP 200 OK.",
      icon: CheckCircle2,
      color: "#22C55E"
    }
  ];

  return (
    <section style={{ padding: '4rem 0' }}>
      <div className="container">
        {/* Large Interactive Banner Card */}
        <div style={{
          background: 'linear-gradient(135deg, #071A2B 0%, #0d2740 100%)',
          borderRadius: '1.25rem',
          padding: '3rem 2.5rem',
          border: '1px solid rgba(34, 211, 238, 0.3)',
          boxShadow: '0 20px 40px rgba(7, 26, 43, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '2rem'
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(34, 211, 238, 0.1)',
              border: '1px solid rgba(34, 211, 238, 0.3)',
              padding: '0.3rem 0.75rem',
              borderRadius: '2rem',
              color: '#22D3EE',
              fontSize: '0.75rem',
              fontWeight: '700',
              marginBottom: '1rem'
            }}>
              <Shield style={{ width: '14px', height: '14px' }} />
              <span>EXPRESS AUTHENTICATION ARCHITECTURE GUIDE</span>
            </div>

            <h2 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#ffffff', lineHeight: '1.2' }}>
              How JWT Authentication Works
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '1rem', marginTop: '0.5rem', maxWidth: '640px' }}>
              Explore the complete 7-step request lifecycle from user login credentials to Express authMiddleware verification.
            </p>
          </div>

          <button
            onClick={() => {
              setCurrentStep(0);
              setIsOpen(true);
            }}
            className="btn btn-cta pulse-badge"
            style={{ padding: '1rem 2rem', fontSize: '1.05rem', gap: '0.75rem' }}
          >
            <Play style={{ width: '20px', height: '20px', fill: '#ffffff' }} />
            <span>Launch Step-by-Step Walkthrough</span>
          </button>
        </div>

        {/* Modal Walkthrough */}
        {isOpen && (
          <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(7, 26, 43, 0.85)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}>
            <div style={{
              background: '#071A2B',
              border: '1px solid rgba(34, 211, 238, 0.4)',
              borderRadius: '1.25rem',
              maxWidth: '680px',
              width: '100%',
              padding: '2.25rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(34, 211, 238, 0.2)',
              position: 'relative'
            }}>
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  position: 'absolute',
                  top: '1.25rem',
                  right: '1.25rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  color: '#ffffff',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X style={{ width: '18px', height: '18px' }} />
              </button>

              {/* Progress Indicator Dots */}
              <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.75rem' }}>
                {steps.map((s, idx) => (
                  <div
                    key={s.step}
                    onClick={() => setCurrentStep(idx)}
                    style={{
                      flex: 1,
                      height: '4px',
                      borderRadius: '2px',
                      background: idx === currentStep ? '#22D3EE' : idx < currentStep ? '#2563EB' : 'rgba(255, 255, 255, 0.15)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  />
                ))}
              </div>

              {/* Current Step Content */}
              {(() => {
                const StepIcon = steps[currentStep].icon;
                return (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                      <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '1rem',
                        background: `rgba(${steps[currentStep].color === '#22D3EE' ? '34,211,238' : steps[currentStep].color === '#FF7A18' ? '255,122,24' : '37,99,235'}, 0.15)`,
                        border: `1px solid ${steps[currentStep].color}40`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <StepIcon style={{ width: '28px', height: '28px', color: steps[currentStep].color }} />
                      </div>
                      <div>
                        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: steps[currentStep].color, letterSpacing: '0.05em' }}>
                          STEP {steps[currentStep].step} OF 7
                        </span>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#ffffff' }}>
                          {steps[currentStep].title}
                        </h3>
                      </div>
                    </div>

                    <p style={{ color: '#22D3EE', fontWeight: '600', fontSize: '1rem', marginBottom: '0.75rem' }}>
                      {steps[currentStep].subtitle}
                    </p>

                    <div style={{
                      background: '#040d16',
                      borderRadius: '0.75rem',
                      padding: '1.25rem',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      marginBottom: '2rem',
                      color: '#CBD5E1',
                      fontSize: '0.95rem',
                      lineHeight: '1.6'
                    }}>
                      {steps[currentStep].detail}
                    </div>

                    {/* Navigation Buttons */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <button
                        onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                        disabled={currentStep === 0}
                        className="btn btn-outline"
                        style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.2)', opacity: currentStep === 0 ? 0.4 : 1 }}
                      >
                        <ChevronLeft style={{ width: '16px', height: '16px' }} />
                        <span>Previous</span>
                      </button>

                      {currentStep < steps.length - 1 ? (
                        <button
                          onClick={() => setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))}
                          className="btn btn-primary"
                        >
                          <span>Next Step</span>
                          <ChevronRight style={{ width: '16px', height: '16px' }} />
                        </button>
                      ) : (
                        <button
                          onClick={() => setIsOpen(false)}
                          className="btn btn-cta"
                        >
                          <Check style={{ width: '16px', height: '16px' }} />
                          <span>Complete Walkthrough</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
