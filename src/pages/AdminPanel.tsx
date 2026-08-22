import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import { 
  LayoutDashboard, Users, Briefcase, Award, AlertTriangle, 
  Settings, LogOut, ExternalLink, Menu, X, ShieldAlert
} from 'lucide-react';

const AdminPanel: React.FC = () => {
  const { t } = useTranslation();
  const { signOut } = useAuthStore();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const TABS = [
    { id: 'dashboard', icon: LayoutDashboard, label: t('admin.dashboard') },
    { id: 'workers', icon: Users, label: t('admin.workers') },
    { id: 'employers', icon: Briefcase, label: t('admin.employers') },
    { id: 'listings', icon: Briefcase, label: t('admin.listings') },
    { id: 'certQueue', icon: Award, label: t('admin.certQueue') },
    { id: 'flags', icon: AlertTriangle, label: t('admin.flaggedMessages') },
    { id: 'settings', icon: Settings, label: t('admin.settings') },
  ];

  const handleSignOut = () => {
    signOut();
    window.location.href = '/';
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-gray-900 text-gray-300">
      <div className="p-4 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center gap-2">
          <ShieldAlert size={20} className="text-[#1A56DB]" />
          <span className="font-bold text-white">Elev8 Admin</span>
        </div>
        <button className="md:hidden" onClick={() => setMobileMenuOpen(false)}><X size={20} /></button>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id 
                ? 'bg-gray-800 text-white border-l-4 border-[#1A56DB]' 
                : 'hover:bg-gray-800 hover:text-white'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-4 border-t border-gray-800">
        <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-2 py-2 text-sm font-medium text-red-400 hover:bg-gray-800 rounded-lg transition-colors">
          <LogOut size={18} />
          {t('nav.signOut')}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row pb-20 md:pb-0">
      {/* Mobile Header */}
      <div className="md:hidden bg-gray-900 text-white p-4 flex items-center justify-between sticky top-16 z-30">
        <div className="font-bold">{TABS.find(t => t.id === activeTab)?.label}</div>
        <button onClick={() => setMobileMenuOpen(true)} className="p-2 bg-gray-800 rounded-lg">
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative w-64 bg-gray-900 h-full shadow-xl">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 flex-shrink-0 min-h-[calc(100vh-64px)] sticky top-16">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        {activeTab === 'dashboard' && (
          <div className="max-w-6xl animate-fade-in">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('admin.dashboard')}</h1>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: t('admin.totalUsers'), value: '15,240' },
                { label: t('admin.totalWorkers'), value: '10,120' },
                { label: t('admin.totalEmployers'), value: '5,120' },
                { label: t('admin.revenue'), value: '₹1.2M' },
              ].map((stat, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                  <div className="text-gray-500 text-sm mb-1">{stat.label}</div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Award size={18} className="text-[#1A56DB]" />
                  Pending Certifications
                </h2>
                <div className="text-center py-8 text-gray-500 text-sm">
                  <Award size={32} className="mx-auto mb-2 text-gray-300" />
                  No pending certifications to review.
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertTriangle size={18} className="text-amber-500" />
                  Flagged Content
                </h2>
                <div className="text-center py-8 text-gray-500 text-sm">
                  <AlertTriangle size={32} className="mx-auto mb-2 text-gray-300" />
                  No flagged messages or profiles.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Placeholders for other tabs */}
        {activeTab !== 'dashboard' && (
          <div className="bg-white border border-gray-200 rounded-xl p-10 animate-fade-in flex flex-col items-center justify-center text-center shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
              <ExternalLink size={24} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{TABS.find(t => t.id === activeTab)?.label}</h2>
            <p className="text-gray-500 max-w-md text-sm">This administrative view is currently under development. Data grids and management tools will be integrated soon.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
