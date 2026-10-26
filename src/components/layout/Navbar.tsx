import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, ChevronDown } from 'lucide-react';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import { useAuthStore } from '../../store/authStore';

const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const { user, role, signOut } = useAuthStore();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Role-based nav links
  const navLinks = user
    ? role === 'worker'
      ? [
          { label: 'Find Jobs', to: '/find-work' },
          { label: 'My Dashboard', to: '/dashboard/worker' },
          { label: t('nav.certifications'), to: '/certifications' },
        ]
      : role === 'employer'
      ? [
          { label: 'Browse Workers', to: '/browse-workers' },
          { label: 'Post a Job', to: '/post-requirements' },
          { label: 'My Dashboard', to: '/dashboard/employer' },
        ]
      : role === 'admin'
      ? [{ label: 'Admin Panel', to: '/admin' }]
      : []
    : [
        { label: t('nav.findWork'), to: '/find-work' },
        { label: t('nav.browseWorkers'), to: '/browse-workers' },
        { label: t('nav.postJob'), to: '/post-requirements' },
        { label: t('nav.about'), to: '/about' },
      ];

  const dashboardPath = role === 'employer' ? '/dashboard/employer' : role === 'admin' ? '/admin' : '/dashboard/worker';

  return (
    <header className="sticky top-0 z-50 glass-nav">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
              <span className="text-white font-bold text-sm">E8</span>
            </div>
            <span className="text-xl font-extrabold gradient-text">Elev8</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-[var(--primary)] hover:bg-indigo-50 rounded-lg transition-all"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Right */}
          <div className="hidden lg:flex items-center gap-3">
            <LanguageSwitcher />
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold" style={{ background: 'var(--gradient-primary)' }}>
                    {user.email?.[0]?.toUpperCase()}
                  </div>
                  <div className="text-left hidden xl:block">
                    <div className="text-xs font-semibold text-gray-800 leading-none">{user.email?.split('@')[0]}</div>
                    <div className="text-xs text-gray-400 capitalize">{role}</div>
                  </div>
                  <ChevronDown size={16} className="text-gray-400" />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50">
                    <Link to={dashboardPath} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-medium" onClick={() => setUserMenuOpen(false)}>
                      {t('nav.dashboard')}
                    </Link>
                    <hr className="my-1 border-gray-100" />
                    <button onClick={() => { signOut(); setUserMenuOpen(false); navigate('/'); }} className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 font-medium">
                      {t('nav.signOut')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/sign-in" className="btn btn-ghost btn-sm">{t('nav.signIn')}</Link>
                <Link to="/sign-up" className="btn btn-primary btn-sm">{t('nav.getStarted')}</Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-4 animate-fade-in">
          <div className="mb-4">
            <LanguageSwitcher className="w-full justify-center" />
          </div>
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-4 py-3 text-gray-700 hover:text-[var(--primary)] hover:bg-indigo-50 rounded-xl transition-colors font-medium"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2 border-t border-gray-100 pt-4">
            {user ? (
              <>
                <Link to={dashboardPath} className="btn btn-secondary" onClick={() => setMobileOpen(false)}>{t('nav.dashboard')}</Link>
                <button onClick={() => { signOut(); setMobileOpen(false); navigate('/'); }} className="btn btn-ghost text-red-500">{t('nav.signOut')}</button>
              </>
            ) : (
              <>
                <Link to="/sign-in" className="btn btn-secondary" onClick={() => setMobileOpen(false)}>{t('nav.signIn')}</Link>
                <Link to="/sign-up" className="btn btn-primary" onClick={() => setMobileOpen(false)}>{t('nav.getStarted')}</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
