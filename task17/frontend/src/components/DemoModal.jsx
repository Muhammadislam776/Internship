import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck, Database, Cpu, Lock, AlertTriangle } from 'lucide-react';

export default function DemoModal({ isOpen, onClose }) {
  const [activeStep, setActiveStep] = useState(1);

  if (!isOpen) return null;

  const steps = [
    {
      title: "Step 1: Client Issues HTTP POST Request",
      tag: "Client Side",
      color: "#22D3EE",
      icon: Cpu,
      desc: "The frontend client constructs a JSON payload containing user registration details and sends it to the API endpoint POST /api/users.",
      code: `// Frontend Client Payload
fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: "Elena Rostova",
    email: "elena@cybersec.io",
    password: "SecurePassword@123",
    confirmPassword: "SecurePassword@123",
    age: 26,
    phone: "+1-555-0192",
    country: "USA",
    role: "admin"
  })
});`
    },
    {
      title: "Step 2: Express Intercepts with validateUser Middleware",
      tag: "Express Middleware",
      color: "#6366F1",
      icon: ShieldCheck,
      desc: "Express receives the HTTP request and routes it directly into the validateUser middleware function before hitting any controller function.",
      code: `// routes/userRoutes.js
router.post('/users', validateUser(userSchema), createUser);`
    },
    {
      title: "Step 3: Zod Performs Schema Validation & Safe Parsing",
      tag: "Zod Core Engine",
      color: "#FF7A18",
      icon: Lock,
      desc: "Zod's safeParseAsync checks field types, length constraints, regex patterns, age limits, and password match refinements.",
      code: `// middleware/validateUser.js
const result = await userSchema.safeParseAsync(req.body);
if (!result.success) {
  return res.status(400).json({
    success: false,
    message: "Validation failed",
    errors: formatZodErrors(result.error)
  });
}`
    },
    {
      title: "Step 4: Sanitization & Safe Hand-off to Controller",
      tag: "Express Next Pipeline",
      color: "#22C55E",
      icon: CheckCircle2,
      desc: "If validation passes, req.body is replaced with Zod's parsed and sanitized data structure, and next() is called to pass control.",
      code: `// Express Middleware Hand-off
req.body = result.data; // Strips unknown fields & applies type coercions
next(); // Proceed to controller`
    },
    {
      title: "Step 5: User Controller & Database Persistence",
      tag: "Database Controller",
      color: "#FB7185",
      icon: Database,
      desc: "The User Controller executes ONLY when data is guaranteed to be clean and valid. The user is saved with 100% data integrity.",
      code: `// controllers/userController.js
export const createUser = (req, res) => {
  const newUser = store.addUser(req.body);
  return res.status(200).json({
    success: true,
    message: "User data is valid",
    user: newUser
  });
};`
    }
  ];

  const current = steps[activeStep - 1];
  const StepIcon = current.icon;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={24} color="#22D3EE" />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Zod Middleware Architecture Flow</h3>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {steps.map((s, idx) => (
            <div
              key={idx}
              onClick={() => setActiveStep(idx + 1)}
              style={{
                flex: 1,
                height: '6px',
                borderRadius: '3px',
                background: idx + 1 <= activeStep ? s.color : 'rgba(255,255,255,0.15)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              title={`Step ${idx + 1}: ${s.tag}`}
            />
          ))}
        </div>

        {/* Current Step Body */}
        <div style={{ background: 'rgba(7, 17, 31, 0.7)', borderRadius: '16px', padding: '24px', border: `1px solid ${current.color}40`, marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: `${current.color}20`,
                color: current.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <StepIcon size={20} />
              </div>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: current.color }}>
                {current.title}
              </span>
            </div>

            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: '20px',
              background: `${current.color}20`,
              color: current.color,
              border: `1px solid ${current.color}40`
            }}>
              {current.tag}
            </span>
          </div>

          <p style={{ fontSize: '0.92rem', color: '#CBD5E1', marginBottom: '16px' }}>
            {current.desc}
          </p>

          <pre style={{
            background: '#07111F',
            color: '#F1F5F9',
            padding: '16px',
            borderRadius: '12px',
            fontSize: '0.82rem',
            fontFamily: 'JetBrains Mono, monospace',
            overflowX: 'auto',
            borderLeft: `4px solid ${current.color}`
          }}>
            {current.code}
          </pre>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
            disabled={activeStep === 1}
            className="btn-secondary"
            style={{ opacity: activeStep === 1 ? 0.5 : 1 }}
          >
            <ArrowLeft size={16} /> Previous Step
          </button>

          <span style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 600 }}>
            Step {activeStep} of {steps.length}
          </span>

          <button
            onClick={() => {
              if (activeStep < steps.length) {
                setActiveStep((prev) => prev + 1);
              } else {
                onClose();
              }
            }}
            className="btn-primary"
          >
            <span>{activeStep === steps.length ? 'Finish Overview' : 'Next Step'}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
