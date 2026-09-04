import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Award, User, Mail, Lock, Building2, ArrowRight } from 'lucide-react';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('organization');
  const [orgName, setOrgName] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await register({ name, email, password, role, orgName });
      if (res.success) {
        if (role === 'organization') navigate('/org');
        else navigate('/recipient');
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 p-0.5 mx-auto mb-3 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Award className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Create Account</h2>
          <p className="text-xs text-slate-400">Join CertifyCraft as an Issuer or Recipient</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Select User Role</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('organization')}
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
                  role === 'organization'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white'
                    : 'bg-slate-950 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <Building2 className="w-4 h-4 text-amber-400" />
                <span>Organization / Issuer</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('recipient')}
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
                  role === 'recipient'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white'
                    : 'bg-slate-950 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <User className="w-4 h-4 text-sky-400" />
                <span>Student / Recipient</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
              placeholder="e.g. Dr. Alex Mercer"
            />
          </div>

          {role === 'organization' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Organization Name</label>
              <input
                type="text"
                required
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                placeholder="e.g. Global Tech Institute"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
              placeholder="name@institute.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <input
              type="password"
              required
              min="6"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
              placeholder="Minimum 6 characters"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 via-indigo-600 to-sky-500 hover:from-amber-400 hover:to-sky-400 shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center space-x-2"
          >
            <span>{submitting ? 'Creating Account...' : 'Register & Start'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-indigo-400 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
