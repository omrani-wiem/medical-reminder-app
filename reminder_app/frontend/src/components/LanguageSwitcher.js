// LanguageSwitcher.js
import React from 'react';
import { useLanguageSwitcher } from '../hooks/useLanguageSwitcher';
import { LANGUAGES } from '../utils/languageUtils';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const { currentLanguage, changeLanguage } = useLanguageSwitcher();
  const currentLang = LANGUAGES.find(l => l.code === currentLanguage);

  return (
    <div className="language-switcher">
      <div className="language-buttons">
        {LANGUAGES.map(lang => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`language-btn ${currentLanguage === lang.code ? 'active' : ''}`}
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
          {currentLang?.flag} {currentLang?.name}
        </span>
      </div>
    </div>
  );
};

export default LanguageSwitcher;