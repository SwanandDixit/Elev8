import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Heart, Eye, Users, Award, Zap, Star, ArrowRight } from 'lucide-react';
import { TEAM } from '../lib/mockData';

const About: React.FC = () => {
  const { t } = useTranslation();

  const stats = [
    { value: '47%', label: t('about.problem1') },
    { value: '3x', label: t('about.problem2') },
    { value: '80%', label: t('about.problem3') },
  ];

  const values = [
    { icon: Heart, title: t('about.value1Title'), desc: t('about.value1Desc'), color: '#EF4444' },
    { icon: Users, title: t('about.value2Title'), desc: t('about.value2Desc'), color: '#4F46E5' },
    { icon: Star, title: t('about.value3Title'), desc: t('about.value3Desc'), color: '#10B981' },
    { icon: Award, title: t('about.value4Title'), desc: t('about.value4Desc'), color: '#F59E0B' },
  ];

  const timeline = [
    { year: '2023', event: 'Elev8 founded in Mumbai with a mission to dignify blue-collar work' },
    { year: 'Q1 2024', event: 'Launched in 5 cities — 1,000 workers registered in first month' },
    { year: 'Q2 2024', event: 'Partnered with NSDC and ITI for skill verification' },
    { year: 'Q3 2024', event: 'Reached 5,000 active workers and 2,500 job postings' },
    { year: 'Q4 2024', event: '10,000+ workers, operating across 20 Indian cities' },
  ];

  return (
    <div className="pb-16 md:pb-0">
      {/* Hero */}
      <section className="hero-dark py-20 md:py-28">
        <div className="container text-center max-w-3xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-5 tracking-tight">{t('about.title')}</h1>
          <p className="text-slate-300 text-lg leading-relaxed">{t('about.subtitle')}</p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section bg-white">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto stagger-children">
            <div className="card glow-card" style={{ borderLeft: '4px solid var(--primary)' }}>
              <div className="flex items-center gap-2 mb-3">
                <Eye size={20} className="text-[var(--primary)]" />
                <h2 className="font-bold text-gray-900">{t('about.missionTitle')}</h2>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">{t('about.missionDesc')}</p>
            </div>
            <div className="card glow-card" style={{ borderLeft: '4px solid var(--accent)' }}>
              <div className="flex items-center gap-2 mb-3">
                <Zap size={20} className="text-amber-500" />
                <h2 className="font-bold text-gray-900">{t('about.visionTitle')}</h2>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">{t('about.visionDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="container max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">{t('about.problemTitle')}</h2>
            <p className="text-gray-500">{t('about.problemDesc')}</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 stagger-children">
            {stats.map((s, i) => (
              <div key={i} className="card text-center glow-card">
                <div className="text-4xl font-extrabold gradient-text mb-2">{s.value}</div>
                <p className="text-sm text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-white">
        <div className="container">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">{t('about.valuesTitle')}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto stagger-children">
            {values.map((v, i) => (
              <div key={i} className="card text-center glow-card">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: v.color + '15' }}>
                  <v.icon size={26} color={v.color} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="container max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">{t('about.timelineTitle')}</h2>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--primary)] to-[var(--accent)]" />
            <div className="flex flex-col gap-8">
              {timeline.map((item, i) => (
                <div key={i} className="flex gap-5 pl-12 relative animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="absolute left-0 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--gradient-primary)' }}>
                    <div className="w-3 h-3 rounded-full bg-white" />
                  </div>
                  <div>
                    <div className="text-sm font-bold gradient-text mb-1">{item.year}</div>
                    <p className="text-sm text-gray-600">{item.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section bg-white">
        <div className="container">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">{t('about.teamTitle')}</h2>
          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto stagger-children">
            {TEAM.map((m, i) => (
              <div key={i} className="card text-center glow-card">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4" style={{ background: 'var(--gradient-primary)' }}>
                  {m.initials}
                </div>
                <h3 className="font-bold text-gray-900">{m.name}</h3>
                <p className="text-sm gradient-text font-semibold mb-3">{m.role}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hero-dark py-20">
        <div className="container text-center relative z-10">
          <h2 className="text-3xl font-bold text-white mb-4">{t('about.ctaTitle')}</h2>
          <p className="text-slate-300 mb-10 max-w-lg mx-auto">{t('about.ctaSubtitle')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register-worker" className="btn btn-lg" style={{ background:'white', color:'var(--primary)' }}>
              {t('about.joinWorker')}
            </Link>
            <Link to="/post-requirements" className="btn btn-cta btn-lg">
              {t('about.postJob')} <ArrowRight size={18}/>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
