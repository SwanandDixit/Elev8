import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import type { UserRole } from '../types';
import { CheckCircle, Eye, EyeOff, ArrowRight } from 'lucide-react';

const WORKER_PERKS = [
  'Find nearby jobs matching your skills',
  'Negotiate rates directly with customers',
  'Build your verified profile & reviews',
  'Get certified through Elev8 partners',
];

const CUSTOMER_PERKS = [
  'Post jobs & find workers in minutes',
  'See price estimates before you post',
  'Chat & negotiate rates with workers',
  'Verified & background-checked workers',
];

const SignUp: React.FC = () => {
  const { signUp, signInWithGoogle, loading } = useAuthStore();
  const navigate = useNavigate();

  const [role, setRole] = useState<UserRole>('worker');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return setError('Please agree to the terms to continue');
    setError('');
    try {
      await signUp(email, password, role, name);
      if (role === 'worker') navigate('/register-worker');
      else navigate('/dashboard/employer');
    } catch {
      setError('Sign up failed. Please check your details and try again.');
    }
  };

  const perks = role === 'worker' ? WORKER_PERKS : CUSTOMER_PERKS;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gradient-hero)' }} className="flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-4xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
              <span className="text-white font-bold">E8</span>
            </div>
            <span className="text-2xl font-extrabold text-white">Elev8</span>
          </Link>
          <p className="text-slate-400 text-sm mt-2">India's Trusted Blue-Collar Employment Platform</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 items-start">

          {/* ── Left: Role Selection + Perks ── */}
          <div>
            {/* Role switcher */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <button
                onClick={() => setRole('worker')}
                className={`relative p-5 rounded-2xl border-2 text-left transition-all ${
                  role === 'worker'
                    ? 'border-indigo-500 bg-indigo-950/80'
                    : 'border-slate-700 bg-slate-800/60 hover:border-slate-500'
                }`}
              >
                {role === 'worker' && (
                  <div className="absolute top-3 right-3 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                    <CheckCircle size={12} className="text-white" />
                  </div>
                )}
                <div className="text-3xl mb-3">👷</div>
                <div className="font-bold text-white">I'm a Worker</div>
                <div className="text-slate-400 text-xs mt-1">Looking for jobs & clients</div>
              </button>

              <button
                onClick={() => setRole('employer')}
                className={`relative p-5 rounded-2xl border-2 text-left transition-all ${
                  role === 'employer'
                    ? 'border-amber-500 bg-amber-950/60'
                    : 'border-slate-700 bg-slate-800/60 hover:border-slate-500'
                }`}
              >
                {role === 'employer' && (
                  <div className="absolute top-3 right-3 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                    <CheckCircle size={12} className="text-white" />
                  </div>
                )}
                <div className="text-3xl mb-3">🏠</div>
                <div className="font-bold text-white">I'm a Customer</div>
                <div className="text-slate-400 text-xs mt-1">Hiring workers for jobs</div>
              </button>
            </div>

            {/* Perks */}
            <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                {role === 'worker' ? 'As a Worker, you get:' : 'As a Customer, you get:'}
              </p>
              <ul className="space-y-3">
                {perks.map((perk, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle size={15} className={role === 'worker' ? 'text-indigo-400' : 'text-amber-400'} />
                    <span className="text-sm text-slate-300">{perk}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="flex gap-3 text-xs text-slate-500">
                  <span>🔒 Secure & Private</span>
                  <span>✓ Free to Join</span>
                  <span>🇮🇳 Made for India</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: Form ── */}
          <div className="card" style={{ background: 'rgba(255,255,255,0.97)' }}>
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              {role === 'worker' ? 'Create Worker Account' : 'Create Customer Account'}
            </h2>
            <p className="text-sm text-gray-500 mb-5">
              {role === 'worker' ? 'Start finding jobs near you' : 'Find skilled workers in minutes'}
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="form-group">
                <label className="label">Full Name *</label>
                <input
                  className="input"
                  placeholder={role === 'worker' ? 'Your full name' : 'Your name'}
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>

              {role === 'employer' && (
                <div className="form-group">
                  <label className="label">Company / Organization (optional)</label>
                  <input
                    className="input"
                    placeholder="e.g. ABC Pvt Ltd, or leave blank for personal"
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                  />
                </div>
              )}

              <div className="form-group">
                <label className="label">Email *</label>
                <input
                  className="input"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="label">Phone (optional)</label>
                <input
                  className="input"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="label">Password *</label>
                <div className="relative">
                  <input
                    className="input pr-12"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    minLength={8}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Terms */}
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={e => setAgreed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded accent-indigo-600"
                />
                <span className="text-xs text-gray-500">
                  I agree to Elev8's{' '}
                  <a href="#" className="text-indigo-600 hover:underline">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>
                </span>
              </label>

              {error && (
                <div className="rounded-xl px-4 py-3" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full flex items-center justify-center gap-2 py-3"
                style={role === 'employer' ? { background: 'linear-gradient(135deg, #F59E0B, #EF4444)' } : {}}
              >
                {loading ? 'Creating account...' : (
                  <>
                    {role === 'worker' ? 'Create Worker Account' : 'Create Customer Account'}
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
              <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-gray-400">or continue with</span></div>
            </div>

            <button
              onClick={signInWithGoogle}
              className="btn btn-secondary w-full flex items-center justify-center gap-2"
            >
              <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"/><path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"/></svg>
              Continue with Google
            </button>

            <p className="text-center text-xs text-gray-500 mt-4">
              Already have an account?{' '}
              <Link to="/sign-in" className="text-indigo-600 font-semibold hover:underline">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
