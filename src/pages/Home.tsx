import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  CheckCircle, Zap, Shield, Users, ArrowRight, Star,
  ClipboardList, Search, Handshake, ChevronRight
} from 'lucide-react';
import WorkerCard from '../components/workers/WorkerCard';
import { MOCK_WORKERS, CATEGORIES, TESTIMONIALS, PARTNERS } from '../lib/mockData';

const STATS = [
  { value: 10000, label: 'hero.stat1', suffix: '+' },
  { value: 5000, label: 'hero.stat2', suffix: '+' },
  { value: 2500, label: 'hero.stat3', suffix: '+' },
  { value: 98, label: 'hero.stat4', suffix: '%' },
];

function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

const StatItem: React.FC<{ value: number; label: string; suffix: string; animate: boolean }> = ({ value, label, suffix, animate }) => {
  const { t } = useTranslation();
  const count = useCountUp(value, 1800, animate);
  return (
    <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
      <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '4px' }}>
        {count.toLocaleString()}{suffix}
      </div>
      <div style={{ fontSize: '0.875rem', fontWeight: 500, color: '#CBD5E1' }}>{t(label)}</div>
    </div>
  );
};

const CATEGORY_ICONS: Record<string, string> = {
  electrician: '⚡', plumber: '🔧', carpenter: '🪚', cook: '👨‍🍳',
  cleaning: '🧹', driver: '🚗', security: '🔒', painter: '🎨',
  welder: '🔥', mason: '🧱', acTech: '❄️', gardener: '🌿',
};

const HOW_STEPS = [
  { icon: ClipboardList, titleKey: 'home.step1Title', descKey: 'home.step1Desc', color: '#EEF2FF', iconColor: '#4F46E5' },
  { icon: Search, titleKey: 'home.step2Title', descKey: 'home.step2Desc', color: '#ECFDF5', iconColor: '#10B981' },
  { icon: Handshake, titleKey: 'home.step3Title', descKey: 'home.step3Desc', color: '#FFFBEB', iconColor: '#F59E0B' },
];

const WHY_FEATURES = [
  { icon: CheckCircle, titleKey: 'home.feature1Title', descKey: 'home.feature1Desc', color: '#10B981' },
  { icon: Zap, titleKey: 'home.feature2Title', descKey: 'home.feature2Desc', color: '#4F46E5' },
  { icon: Shield, titleKey: 'home.feature3Title', descKey: 'home.feature3Desc', color: '#F59E0B' },
  { icon: Users, titleKey: 'home.feature4Title', descKey: 'home.feature4Desc', color: '#8B5CF6' },
];

const Home: React.FC = () => {
  const { t } = useTranslation();
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setStatsVisible(true);
    }, { threshold: 0.3 });
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="pb-16 md:pb-0">
      {/* ── Hero (Dark Gradient) ── */}
      <section className="hero-dark py-20 md:py-24">
        <div className="container relative z-10">
          <div className="text-center mb-12">
            <span className="inline-block bg-white/10 text-indigo-300 text-sm font-medium px-5 py-2 rounded-full mb-8 border border-white/10 backdrop-blur-sm">
              🇮🇳 India's Skill Employment Platform
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
              {t('hero.title')}
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed mb-10 max-w-xl mx-auto">
              {t('hero.subtitle')}
            </p>
          </div>

          {/* Dual CTA Cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Worker CTA */}
            <Link
              to="/find-work"
              style={{
                display: 'block',
                background: 'rgba(255,255,255,0.08)',
                border: '1.5px solid rgba(255,255,255,0.2)',
                borderRadius: '20px',
                padding: '32px 28px',
                textDecoration: 'none',
                transition: 'all 0.25s',
                backdropFilter: 'blur(12px)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.15)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>👷</div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
                I'm Looking for Work
              </h2>
              <p style={{ fontSize: '14px', color: '#CBD5E1', marginBottom: '20px', lineHeight: '1.6' }}>
                Browse thousands of jobs near you. Apply with one click and get hired fast.
              </p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--gradient-primary)', color: '#fff', padding: '10px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: 700 }}>
                Find Jobs →
              </div>
            </Link>

            {/* Employer CTA */}
            <Link
              to="/post-requirements"
              style={{
                display: 'block',
                background: 'rgba(245,158,11,0.12)',
                border: '1.5px solid rgba(245,158,11,0.3)',
                borderRadius: '20px',
                padding: '32px 28px',
                textDecoration: 'none',
                transition: 'all 0.25s',
                backdropFilter: 'blur(12px)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(245,158,11,0.2)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(245,158,11,0.12)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏠</div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
                I Need a Worker
              </h2>
              <p style={{ fontSize: '14px', color: '#CBD5E1', marginBottom: '20px', lineHeight: '1.6' }}>
                Post your requirement and get matched with verified skilled workers near you.
              </p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--gradient-accent)', color: '#fff', padding: '10px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: 700 }}>
                Post a Job →
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section style={{ background: '#0F172A', padding: '48px 0' }} ref={statsRef}>
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {STATS.map((s) => (
              <StatItem key={s.label} value={s.value} label={s.label} suffix={s.suffix} animate={statsVisible} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust Bar ── */}
      <section style={{ padding: '32px 0', background: '#FFFFFF', borderBottom: '1px solid #F1F5F9' }}>
        <div className="container">
          <p style={{ fontSize: '11px', color: '#94A3B8', textAlign: 'center', marginBottom: '16px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.1em' }}>Trusted by leading partners</p>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {PARTNERS.map((p) => (
              <span key={p} style={{ color: '#94A3B8', fontWeight: 700, fontSize: '15px', letterSpacing: '0.05em' }}>{p}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="section bg-white">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{t('home.howItWorks')}</h2>
            <p className="text-gray-500 max-w-lg mx-auto">{t('home.howSubtitle')}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto stagger-children">
            {HOW_STEPS.map((step, i) => (
              <div key={i} className="card text-center relative glow-card">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                  style={{ background: step.color }}
                >
                  <step.icon size={28} color={step.iconColor} />
                </div>
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: 'var(--gradient-primary)' }}>
                  {i + 1}
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">{t(step.titleKey)}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{t(step.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories (6 shown) ── */}
      <section className="section" style={{ background: '#F8FAFC' }}>
        <div className="container">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{t('home.browseCategories')}</h2>
              <p className="text-gray-500 mt-1">{t('home.categoriesSubtitle')}</p>
            </div>
            <Link to="/browse-workers" className="hidden md:flex items-center gap-1 text-[var(--primary)] font-semibold hover:underline">
              {t('misc.seeAll')} <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 stagger-children">
            {CATEGORIES.slice(0, 6).map((cat) => (
              <Link
                key={cat.key}
                to={`/find-work?category=${cat.key}`}
                className="card text-center cursor-pointer group glow-card"
              >
                <div className="text-4xl mb-3">{CATEGORY_ICONS[cat.key] || '🛠️'}</div>
                <div className="font-semibold text-sm text-gray-900 group-hover:text-[var(--primary)] transition-colors">
                  {t(`categories.${cat.key}`)}
                </div>
                <div className="text-xs text-gray-400 mt-1">{cat.count.toLocaleString()} available</div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6 md:hidden">
            <Link to="/browse-workers" className="btn btn-secondary btn-sm">{t('misc.seeAll')}</Link>
          </div>
        </div>
      </section>

      {/* ── Featured Workers ── */}
      <section className="section bg-white">
        <div className="container">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{t('home.featuredWorkers')}</h2>
              <p className="text-gray-500 mt-1">{t('home.featuredSubtitle')}</p>
            </div>
            <Link to="/browse-workers" className="hidden md:flex items-center gap-1 text-[var(--primary)] font-semibold hover:underline">
              {t('btn.browseAll')} <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {MOCK_WORKERS.slice(0, 3).map((w) => (
              <WorkerCard key={w.id} worker={w} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Elev8 ── */}
      <section className="section" style={{ background: '#F8FAFC' }}>
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{t('home.whyElev8')}</h2>
            <p className="text-gray-500 max-w-lg mx-auto">{t('home.whySubtitle')}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
            {WHY_FEATURES.map((f, i) => (
              <div key={i} className="card glow-card">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: f.color + '15' }}>
                  <f.icon size={24} color={f.color} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{t(f.titleKey)}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{t(f.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="section bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('home.testimonials')}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 stagger-children max-w-5xl mx-auto">
            {TESTIMONIALS.map((t2, i) => (
              <div key={i} className="card glow-card">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} size={14} className={s < t2.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">"{t2.text}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm ${t2.isWorker ? 'bg-[var(--primary)]' : 'bg-[var(--success)]'}`}>
                    {t2.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-gray-900">{t2.name}</div>
                    <div className="text-xs text-gray-500">{t2.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner (Dark Gradient) ── */}
      <section className="hero-dark py-20">
        <div className="container text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to find work or hire talent?
          </h2>
          <p className="text-indigo-200 mb-10 max-w-xl mx-auto">
            Join thousands of workers and employers on Elev8. Free to get started.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register-worker" className="btn btn-lg" style={{ background: 'white', color: 'var(--primary)' }}>
              {t('nav.joinWorkers')}
            </Link>
            <Link to="/post-requirements" className="btn btn-cta btn-lg">
              {t('btn.postFree')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
