import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../ui/LanguageSwitcher';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  const cols = [
    {
      title: t('footer.platform'),
      links: [
        { label: t('footer.findWork'), to: '/find-work' },
        { label: t('footer.browseWorkers'), to: '/browse-workers' },
        { label: t('footer.postRequirement'), to: '/post-requirements' },
        { label: t('footer.certifications'), to: '/certifications' },
      ],
    },
    {
      title: t('footer.company'),
      links: [
        { label: t('footer.about'), to: '/about' },
        { label: t('footer.privacy'), to: '/privacy' },
        { label: t('footer.terms'), to: '/terms' },
      ],
    },
    {
      title: t('footer.support'),
      links: [
        { label: t('footer.helpCenter'), to: '/help' },
        { label: t('footer.contactUs'), to: '/contact' },
        { label: t('footer.safetyTips'), to: '/safety' },
      ],
    },
  ];

  return (
    <footer className="bg-[#0F172A] text-gray-300 mt-auto">
      {/* Gradient accent line */}
      <div className="h-1" style={{ background: 'var(--gradient-primary)' }} />
      
      <div className="container py-12">
        {/* Top */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-10">
          <div className="max-w-xs">
            <Link to="/" className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
                <span className="text-white font-bold text-sm">E8</span>
              </div>
              <span className="text-xl font-extrabold text-white">Elev8</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">{t('footer.tagline')}</p>
          </div>
          <div className="mt-2">
            <LanguageSwitcher className="!bg-slate-800 !border-slate-700" />
          </div>
        </div>

        {/* Link columns — 3 instead of 5 */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 border-t border-slate-800 pt-10">
          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="text-white font-semibold text-sm mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm text-slate-400 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-sm text-slate-500">{t('footer.copyright')}</p>
          <div className="flex gap-4 text-sm text-slate-500">
            <Link to="/privacy" className="hover:text-white transition-colors">{t('footer.privacy')}</Link>
            <Link to="/terms" className="hover:text-white transition-colors">{t('footer.terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
