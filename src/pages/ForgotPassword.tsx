import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';

const ForgotPassword: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) {
      setError(error.message);
    } else {
      setMessage('Password reset link sent! Check your email.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-9 h-9 bg-[#1A56DB] rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">E8</span>
            </div>
            <span className="text-2xl font-bold text-[#1A56DB]">Elev8</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{t('auth.forgotPassword')}</h1>
          <p className="text-gray-600 text-sm mt-1">{t('auth.resetDesc')}</p>
        </div>

        <div className="card">
          {message ? (
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-500 text-xl">✓</span>
              </div>
              <p className="text-gray-900 font-medium mb-4">{message}</p>
              <Link to="/sign-in" className="btn btn-primary w-full">{t('auth.backToSignIn')}</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="form-group">
                <label className="label">{t('auth.email')}</label>
                <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              {error && <p className="error-text">{error}</p>}
              <button type="submit" disabled={loading} className="btn btn-primary w-full">
                {loading ? t('misc.loading') : t('auth.sendReset')}
              </button>
              <div className="text-center mt-2">
                <Link to="/sign-in" className="text-sm text-gray-500 hover:text-gray-700">{t('auth.backToSignIn')}</Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
