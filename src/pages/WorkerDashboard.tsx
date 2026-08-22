import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import { 
  LayoutDashboard, User, Briefcase, Bookmark, MessageSquare, 
  Award, Settings, LogOut, Menu, X, ChevronRight, Star,
  MapPin, CheckCircle, Eye, Calendar, Clock
} from 'lucide-react';
import { MOCK_JOBS, MOCK_WORKERS } from '../lib/mockData';
import { Link } from 'react-router-dom';

const WorkerDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user, signOut } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const worker = MOCK_WORKERS[0]; // Use first mock worker as current user

  const TABS = [
    { id: 'overview', icon: LayoutDashboard, label: t('dashboard.overview') },
    { id: 'profile', icon: User, label: t('dashboard.myProfile') },
    { id: 'applications', icon: Briefcase, label: t('dashboard.applications') },
    { id: 'saved', icon: Bookmark, label: t('dashboard.savedJobs') },
    { id: 'messages', icon: MessageSquare, label: t('dashboard.messages') },
    { id: 'certifications', icon: Award, label: t('dashboard.certifications') },
    { id: 'settings', icon: Settings, label: t('dashboard.settings') },
  ];

  const handleSignOut = () => {
    signOut();
    window.location.href = '/';
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      <div className="p-4 md:hidden flex items-center justify-between border-b border-gray-100">
        <span className="font-bold text-gray-900">{t('nav.dashboard')}</span>
        <button onClick={() => setMobileMenuOpen(false)}><X size={20} /></button>
      </div>
      <div className="hidden md:flex items-center gap-3 p-5 border-b border-gray-100">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold" style={{ background: 'var(--gradient-primary)' }}>
          {user?.email?.[0]?.toUpperCase() || 'U'}
        </div>
        <div className="min-w-0">
          <div className="font-semibold text-sm text-gray-900 truncate">{user?.email || 'Worker'}</div>
          <div className="text-xs text-gray-400">Worker Account</div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto py-3">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all ${
              activeTab === tab.id 
                ? 'bg-indigo-50 text-[var(--primary)] border-r-3 border-[var(--primary)]' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-4 border-t border-gray-100">
        <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors">
          <LogOut size={18} />
          {t('nav.signOut')}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col md:flex-row pb-20 md:pb-0">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-16 z-30">
        <div className="font-bold text-gray-900">{TABS.find(t => t.id === activeTab)?.label}</div>
        <button onClick={() => setMobileMenuOpen(true)} className="p-2 bg-gray-100 rounded-xl">
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative w-64 bg-white h-full shadow-xl"><Sidebar /></div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 flex-shrink-0 min-h-[calc(100vh-64px)] sticky top-16">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="max-w-5xl animate-fade-in">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Welcome back! 👋</h1>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger-children">
              {[
                { label: t('dashboard.profileViews'), value: '45', icon: Eye, color: '#4F46E5' },
                { label: t('dashboard.applicationsSent'), value: '12', icon: Briefcase, color: '#10B981' },
                { label: t('dashboard.interviews'), value: '3', icon: Calendar, color: '#F59E0B' },
                { label: t('dashboard.jobsCompleted'), value: '28', icon: CheckCircle, color: '#8B5CF6' },
              ].map((stat, i) => (
                <div key={i} className="card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: stat.color + '15' }}>
                      <stat.icon size={20} color={stat.color} />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-500 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="card mb-8">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900">{t('dashboard.profileCompletion')}</h3>
                <span className="text-sm font-bold text-[var(--primary)]">80%</span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full mb-3 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: '80%', background: 'var(--gradient-primary)' }} />
              </div>
              <p className="text-sm text-gray-500">{t('dashboard.completeProfile')}</p>
              <button onClick={() => setActiveTab('profile')} className="text-sm text-[var(--primary)] font-semibold mt-2 flex items-center gap-1 hover:underline">
                Complete Now <ChevronRight size={14} />
              </button>
            </div>

            <h2 className="font-bold text-gray-900 mb-4">Recent Job Matches</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
              {MOCK_JOBS.slice(0, 3).map(job => (
                <div key={job.id} className="card glow-card p-5">
                  <div className="flex justify-between items-start mb-2">
                    <span className="badge badge-new">{job.category}</span>
                    <span className="text-sm font-bold gradient-text">₹{job.pay_rate}</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1 line-clamp-1">{job.title}</h4>
                  <p className="text-xs text-gray-500 mb-3 flex items-center gap-1"><MapPin size={11}/>{job.location}</p>
                  <Link to="/find-work" className="btn btn-secondary btn-sm w-full">View Details</Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="max-w-3xl animate-fade-in">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('dashboard.myProfile')}</h1>
            <div className="card mb-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold" style={{ background: 'var(--gradient-primary)' }}>
                  {worker.first_name[0]}{worker.last_name[0]}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{worker.first_name} {worker.last_name}</h2>
                  <p className="text-gray-500">{worker.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Star size={14} className="text-amber-400 fill-amber-400" />
                    <span className="text-sm font-semibold">{worker.rating}</span>
                    <span className="text-sm text-gray-400">({worker.total_reviews} reviews)</span>
                  </div>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="label">First Name</label>
                  <input className="input" defaultValue={worker.first_name} />
                </div>
                <div className="form-group">
                  <label className="label">Last Name</label>
                  <input className="input" defaultValue={worker.last_name} />
                </div>
                <div className="form-group">
                  <label className="label">Professional Title</label>
                  <input className="input" defaultValue={worker.title} />
                </div>
                <div className="form-group">
                  <label className="label">Hourly Rate (₹)</label>
                  <input className="input" type="number" defaultValue={worker.hourly_rate} />
                </div>
                <div className="form-group sm:col-span-2">
                  <label className="label">Bio</label>
                  <textarea className="textarea" defaultValue={worker.bio} rows={3} />
                </div>
                <div className="form-group">
                  <label className="label">City</label>
                  <input className="input" defaultValue={worker.city} />
                </div>
                <div className="form-group">
                  <label className="label">State</label>
                  <input className="input" defaultValue={worker.state} />
                </div>
              </div>
              <div className="mt-5">
                <label className="label mb-2">Skills</label>
                <div className="flex flex-wrap gap-2">
                  {worker.skills?.map(s => <span key={s} className="pill">{s}</span>)}
                </div>
              </div>
              <button className="btn btn-primary mt-6">Save Changes</button>
            </div>
          </div>
        )}

        {/* APPLICATIONS TAB */}
        {activeTab === 'applications' && (
          <div className="max-w-4xl animate-fade-in">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('dashboard.applications')}</h1>
            <div className="flex flex-col gap-4 stagger-children">
              {MOCK_JOBS.slice(0, 4).map((job, i) => {
                const statuses = ['Applied', 'Viewed', 'Shortlisted', 'Hired'];
                const colors = ['bg-blue-50 text-blue-600', 'bg-amber-50 text-amber-600', 'bg-purple-50 text-purple-600', 'bg-green-50 text-green-600'];
                return (
                  <div key={job.id} className="card flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: 'var(--primary-light)' }}>
                      <Briefcase size={22} className="text-[var(--primary)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900">{job.title}</h3>
                      <p className="text-sm text-gray-500">{job.employer?.name} · {job.location}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`badge ${colors[i % 4]}`}>{statuses[i % 4]}</span>
                      <span className="text-sm font-bold gradient-text">₹{job.pay_rate}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SAVED JOBS TAB */}
        {activeTab === 'saved' && (
          <div className="max-w-4xl animate-fade-in">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('dashboard.savedJobs')}</h1>
            <div className="grid sm:grid-cols-2 gap-4 stagger-children">
              {MOCK_JOBS.slice(0, 4).map(job => (
                <div key={job.id} className="card glow-card">
                  <div className="flex justify-between items-start mb-2">
                    <span className="badge badge-new">{job.category}</span>
                    <Bookmark size={18} className="text-[var(--primary)] fill-[var(--primary)]" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{job.title}</h3>
                  <p className="text-sm text-gray-500 mb-2 flex items-center gap-1"><MapPin size={12}/>{job.location}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold gradient-text">₹{job.pay_rate}</span>
                    <Link to="/find-work" className="btn btn-secondary btn-sm">View</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MESSAGES TAB */}
        {activeTab === 'messages' && (
          <div className="max-w-3xl animate-fade-in">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('dashboard.messages')}</h1>
            <div className="flex flex-col gap-3 stagger-children">
              {[
                { name: 'Tech Solutions Ltd', msg: 'Hi Ramesh, we are interested in your services for our office rewiring project.', time: '2 hours ago', unread: true },
                { name: 'Sharma Family', msg: 'Can you come for an inspection this Saturday?', time: '1 day ago', unread: false },
                { name: 'Grand Stay Hotels', msg: 'Thanks for the great work! We will send a review.', time: '3 days ago', unread: false },
              ].map((conv, i) => (
                <div key={i} className={`card flex items-center gap-4 cursor-pointer ${conv.unread ? 'border-[var(--primary)]/30 bg-indigo-50/30' : ''}`}>
                  <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0" style={{ background: conv.unread ? 'var(--gradient-primary)' : '#94A3B8' }}>
                    {conv.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-semibold text-sm ${conv.unread ? 'text-gray-900' : 'text-gray-600'}`}>{conv.name}</h3>
                      <span className="text-xs text-gray-400">{conv.time}</span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{conv.msg}</p>
                  </div>
                  {conv.unread && <div className="w-2.5 h-2.5 rounded-full bg-[var(--primary)] flex-shrink-0" />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CERTIFICATIONS TAB */}
        {activeTab === 'certifications' && (
          <div className="max-w-3xl animate-fade-in">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('dashboard.certifications')}</h1>
            <div className="flex flex-col gap-4 stagger-children">
              {[
                { name: 'Electrical Safety Level 2', partner: 'ITI', status: 'Approved', statusColor: 'badge-verified' },
                { name: 'Advanced Wiring Certification', partner: 'Elev8', status: 'Pending', statusColor: 'badge-pending' },
                { name: 'Solar Panel Installation', partner: 'Udemy', status: 'Rejected', statusColor: 'badge-rejected' },
              ].map((cert, i) => (
                <div key={i} className="card flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--accent-light)' }}>
                    <Award size={22} className="text-amber-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                    <p className="text-sm text-gray-500">{cert.partner}</p>
                  </div>
                  <span className={`badge ${cert.statusColor}`}>
                    {cert.status === 'Approved' && <CheckCircle size={10}/>}
                    {cert.status === 'Pending' && <Clock size={10}/>}
                    {cert.status}
                  </span>
                </div>
              ))}
            </div>
            <Link to="/certifications" className="btn btn-primary mt-6">Get New Certification</Link>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl animate-fade-in">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('dashboard.settings')}</h1>
            <div className="card mb-6">
              <h3 className="font-bold text-gray-900 mb-4">Account Settings</h3>
              <div className="flex flex-col gap-4">
                <div className="form-group">
                  <label className="label">Email</label>
                  <input className="input" defaultValue={user?.email || ''} />
                </div>
                <div className="form-group">
                  <label className="label">Phone</label>
                  <input className="input" type="tel" placeholder="+91 9876543210" />
                </div>
                <div className="form-group">
                  <label className="label">Language</label>
                  <select className="select">
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="mr">Marathi</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="card mb-6">
              <h3 className="font-bold text-gray-900 mb-4">Notifications</h3>
              <div className="flex flex-col gap-4">
                {['New job matches', 'Application updates', 'Messages', 'Certification status'].map(item => (
                  <label key={item} className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-gray-700">{item}</span>
                    <div className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider" />
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <button className="btn btn-primary">Save Settings</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkerDashboard;
