import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Briefcase, PlusSquare, User } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const MobileBottomNav: React.FC = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { user, role } = useAuthStore();
  const dashboardPath = role === 'employer' ? '/dashboard/employer' : '/dashboard/worker';

  const tabs = [
    { icon: Home, label: 'Home', to: '/' },
    { icon: Briefcase, label: t('nav.findWork'), to: '/find-work' },
    { icon: PlusSquare, label: t('nav.postJob'), to: '/post-requirements' },
    { icon: User, label: user ? t('nav.dashboard') : t('nav.signIn'), to: user ? dashboardPath : '/sign-in' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
      <div className="flex">
        {tabs.map((tab) => {
          const active = pathname === tab.to;
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors ${
                active ? 'text-[#1A56DB]' : 'text-gray-500'
              }`}
            >
              <tab.icon size={20} strokeWidth={active ? 2.5 : 1.8} />
              <span className="text-xs font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
