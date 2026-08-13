import React, { useState } from 'react';
import { Mail, Lock, UserX, Calendar, Phone, ShieldAlert, ArrowRight } from 'lucide-react';

export default function InteractiveErrorCards({ onSelectPreset }) {
  const [activeCard, setActiveCard] = useState(null);

  const errorCases = [
    {
      id: "invalid_email",
      title: "Invalid Email Format",
      icon: Mail,
      zodRule: "z.string().email()",
      errorMsg: "Invalid email address format",
      fixHint: "Must include valid @ domain format (e.g. user@domain.com)",
      preset: "invalid_email"
    },
    {
      id: "weak_password",
      title: "Weak Password",
      icon: Lock,
      zodRule: "z.string().min(8).regex(...)",
      errorMsg: "Password must contain at least 1 uppercase & special char",
      fixHint: "Must be 8+ chars with uppercase, lowercase, number & symbol",
      preset: "weak_password"
    },
    {
      id: "missing_name",
      title: "Missing / Short Name",
      icon: UserX,
      zodRule: "z.string().min(2)",
      errorMsg: "Name must be at least 2 characters",
      fixHint: "Provide non-empty full name string",
      preset: "missing_name"
    },
    {
      id: "invalid_age",
      title: "Underage (Age < 18)",
      icon: Calendar,
      zodRule: "z.number().min(18)",
      errorMsg: "User must be at least 18 years old",
      fixHint: "Coerced number must satisfy minimum age constraint of 18",
      preset: "underage"
    },
    {
      id: "invalid_phone",
      title: "Invalid Phone Format",
      icon: Phone,
      zodRule: "z.string().regex(phoneRegex)",
      errorMsg: "Invalid phone number format",
      fixHint: "Provide valid numeric or international phone format (+1-555...)",
      preset: "invalid_phone"
    }
  ];

  return (
    <div style={{ marginBottom: '40px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Common Intercepted Validation Errors</h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Hover over error cards to inspect Zod schema rules and details. Click any card to test in the form.
        </p>
      </div>

      <div className="error-card-grid">
        {errorCases.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="error-card"
              onMouseEnter={() => setActiveCard(item.id)}
              onMouseLeave={() => setActiveCard(null)}
              onClick={() => onSelectPreset && onSelectPreset(item.preset)}
            >
              <div className="error-card-icon">
                <Icon size={22} />
              </div>

              <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '6px' }}>
                {item.title}
              </h4>

              <div style={{ fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace', color: '#6366F1', marginBottom: '8px' }}>
                {item.zodRule}
              </div>

              <div style={{ fontSize: '0.82rem', color: '#EF4444', fontWeight: 600, marginBottom: '10px' }}>
                ✕ "{item.errorMsg}"
              </div>

              {activeCard === item.id ? (
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', borderTop: '1px solid rgba(239, 68, 68, 0.2)', paddingTop: '8px', animation: 'fadeIn 0.2s ease' }}>
                  💡 <strong>Fix:</strong> {item.fixHint}
                </div>
              ) : (
                <div style={{ fontSize: '0.75rem', color: '#22D3EE', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Click to test preset <ArrowRight size={12} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
