import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    
    document.documentElement.setAttribute(
      'dir',
      i18n.language === 'ar' ? 'rtl' : 'ltr'
    );
  }, [i18n.language]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('langue', lng);
  };

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
  ];

  return (
    <div className="language-switcher">
      <div className="language-buttons">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`language-btn ${i18n.language === lang.code ? 'active' : ''}`}
            title={lang.name}
          >
            <span className="language-flag">{lang.flag}</span>
            <span className="language-name">{lang.name}</span>
          </button>
        ))}
      </div>
      
      <div className="current-language">
        <span className="current-label">Langue actuelle :</span>
        <span className="current-value">
          {languages.find(l => l.code === i18n.language)?.flag}
          {' '}
          {languages.find(l => l.code === i18n.language)?.name}
        </span>
      </div>
    </div>
  );
};

export default LanguageSwitcher;


