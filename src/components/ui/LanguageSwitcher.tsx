import React from 'react';
import { useTranslation } from 'react-i18next';

export type Language = 'en' | 'hi' | 'mr';

interface LanguageSwitcherProps {
  className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className = '' }) => {
  const { i18n } = useTranslation();
  const current = i18n.language as Language;

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'EN' },
    { code: 'hi', label: 'HI' },
    { code: 'mr', label: 'MR' },
  ];

  const handleChange = (lang: Language) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('elev8_lang', lang);
  };

  return (
    <div className={`inline-flex items-center gap-1 bg-gray-100 rounded-full p-1 ${className}`}>
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleChange(lang.code)}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
            current === lang.code
              ? 'bg-white text-[var(--primary)] shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
