import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Kanban, ArrowRight } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Product Designer');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await register(name, email, password, role);
    setLoading(false);
    if (res.success) {
      addToast('Account created successfully!', 'success');
      navigate('/dashboard');
    } else {
      addToast(res.message || 'Registration failed', 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-midnight-dark relative overflow-hidden">
      <div className="glass-card rounded-3xl p-8 border border-cyber/30 max-w-md w-full shadow-glass relative z-10 animate-fade-in">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-electric via-cyber to-vibrant p-0.5 shadow-blue-glow mb-2">
            <div className="w-full h-full bg-midnight-dark rounded-[14px] flex items-center justify-center">
              <Kanban className="w-6 h-6 text-cyber" />
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Join FlowBoard</h1>
          <p className="text-xs text-slate-400 mt-1">Create your SaaS developer account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Muhammad"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-midnight border border-cyber/20 rounded-xl text-white focus:outline-none focus:border-cyber"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="muhammad@flowboard.dev"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-midnight border border-cyber/20 rounded-xl text-white focus:outline-none focus:border-cyber"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-midnight border border-cyber/20 rounded-xl text-white focus:outline-none focus:border-cyber"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Role Title</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 bg-midnight border border-cyber/20 rounded-xl text-white focus:outline-none focus:border-cyber"
            >
              <option value="Lead Developer">Lead Developer</option>
              <option value="Product Designer">Product Designer</option>
              <option value="Frontend Lead">Frontend Lead</option>
              <option value="Backend Engineer">Backend Engineer</option>
              <option value="DevOps Specialist">DevOps Specialist</option>
              <option value="Project Manager">Project Manager</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-vibrant hover:bg-vibrant-hover text-white font-extrabold rounded-2xl shadow-orange-glow transition-all flex items-center justify-center gap-2 mt-2"
          >
            <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-5">
          Already registered?{' '}
          <Link to="/login" className="text-cyber font-bold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
