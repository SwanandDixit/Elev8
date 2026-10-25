import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';

const SignIn: React.FC = () => {
  const { signIn, signInWithGoogle, loading } = useAuthStore();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await signIn(email, password);
      const { role } = useAuthStore.getState();
      if (role === 'admin') navigate('/admin');
      else if (role === 'employer') navigate('/dashboard/employer');
      else navigate('/dashboard/worker');
    } catch {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'var(--gradient-hero)' }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--gradient-primary)' }}>
              <span className="text-white font-bold">E8</span>
            </div>
            <span className="text-2xl font-extrabold text-white">Elev8</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Welcome back!</h1>
          <p className="text-slate-400 text-sm mt-1">Sign in to your Elev8 account</p>
        </div>

        {/* Card */}
        <div className="card" style={{ background: 'rgba(255,255,255,0.97)' }}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="form-group">
              <label className="label">Email</label>
              <input
                className="input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <div className="flex items-center justify-between mb-1.5">
                <label className="label mb-0">Password</label>
                <Link to="/forgot-password" className="text-xs text-indigo-600 font-medium hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  className="input pr-12"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
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

            {error && (
              <div className="rounded-xl px-4 py-3" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full flex items-center justify-center gap-2 py-3"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <>
                  Sign In <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-gray-400">or continue with</span>
            </div>
          </div>

          <button
            onClick={signInWithGoogle}
            className="btn btn-secondary w-full flex items-center justify-center gap-2"
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"/>
              <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-sm text-gray-500 mt-5">
            Don't have an account?{' '}
            <Link to="/sign-up" className="text-indigo-600 font-semibold hover:underline">Sign Up</Link>
          </p>

          {/* Demo accounts hint */}
          <div className="mt-4 p-3 rounded-xl text-center" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
            <p className="text-xs text-gray-400 mb-1.5 font-medium">Demo — Try any account:</p>
            <div className="flex justify-center gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-700">👷 Worker</p>
                <p className="text-xs text-gray-400">worker@demo.com</p>
              </div>
              <div className="w-px bg-gray-200" />
              <div>
                <p className="text-xs font-semibold text-gray-700">🏠 Customer</p>
                <p className="text-xs text-gray-400">customer@demo.com</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1">Password: <code className="bg-gray-100 px-1 rounded">demo1234</code></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
