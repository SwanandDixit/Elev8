import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import type { UserRole } from '../types';

const SignUp: React.FC = () => {
  const { t } = useTranslation();
  const { signUp, signInWithGoogle, loading } = useAuthStore();
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>('worker');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await signUp(email, password, role, name);
      if (role === 'worker') navigate('/register-worker');
      else navigate('/dashboard/employer');
    } catch {
      setError(t('errors.signUpFailed'));
    }
  };

  return (
    <div className="auth-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
              <span className="text-white font-bold">E8</span>
            </div>
            <span className="text-2xl font-extrabold text-white">Elev8</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">{t('auth.signUp')}</h1>
          <p className="text-slate-400 text-sm mt-1">Join India's skill employment platform</p>
        </div>

        <div className="card" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)' }}>
          {/* Role Toggle */}
          <div className="flex gap-3 mb-6">
            {(['worker','employer'] as UserRole[]).map(r => (
              <button key={r} onClick={() => setRole(r)}
                className={`flex-1 py-3 rounded-xl border-2 font-semibold text-sm transition-all ${
                  role === r ? 'border-[var(--primary)] bg-indigo-50 text-[var(--primary)]' : 'border-gray-200 text-gray-400 hover:border-gray-300'
                }`}>
                {t(`auth.${r}`)}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="form-group">
              <label className="label">{t('auth.name')}</label>
              <input className="input" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="label">{t('auth.email')}</label>
              <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            {role === 'employer' && (
              <div className="form-group">
                <label className="label">{t('auth.company')}</label>
                <input className="input" value={company} onChange={e => setCompany(e.target.value)} placeholder="Optional" />
              </div>
            )}
            <div className="form-group">
              <label className="label">{t('auth.password')}</label>
              <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} minLength={8} required />
            </div>
            {error && <p className="error-text">{error}</p>}
            <button type="submit" disabled={loading} className="btn btn-primary w-full">
              {loading ? t('auth.signingUp') : (role === 'worker' ? t('auth.workerSignUp') : t('auth.employerSignUp'))}
            </button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
            <div className="relative flex justify-center"><span className="bg-white px-3 text-sm text-gray-400">{t('auth.orContinueWith')}</span></div>
          </div>

          <button onClick={signInWithGoogle} className="btn btn-secondary w-full flex items-center justify-center gap-2">
            <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"/><path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"/></svg>
            {t('auth.google')}
          </button>

          <p className="text-center text-sm text-gray-500 mt-5">
            {t('auth.haveAccount')}{' '}
            <Link to="/sign-in" className="text-[var(--primary)] font-semibold hover:underline">{t('auth.signIn')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
