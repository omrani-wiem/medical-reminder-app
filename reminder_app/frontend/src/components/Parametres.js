// Parametres.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParametres } from '../hooks/useParametres';
import { getSections, TIMEZONES } from '../utils/parametresUtils';
import LanguageSwitcher from './LanguageSwitcher';
import './Parametres.css';

const Parametres = () => {
  const { t } = useTranslation();
  const {
    activeSection, setActiveSection,
    loading, saving,
    formData, error, successMsg,
    handleInputChange, handleSubmit
  } = useParametres();

  const sections = getSections(t);

  if (loading) return (
    <div className="parametres-loading">
      <div className="spinner"></div>
      <p>{t('common.loading')}</p>
    </div>
  );

  return (
    <div className="parametres">
      <div className="parametres-container">

        {/* Navigation */}
        <nav className="parametres-nav">
          {sections.map(section => (
            <button
              key={section.id}
              className={`nav-item ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => setActiveSection(section.id)}
            >
              <span className="nav-label">{section.label}</span>
            </button>
          ))}
        </nav>

        {/* Contenu */}
        <div className="parametres-content">

          {/* Messages */}
          {error && <div className="alert alert-error">{error}</div>}
          {successMsg && <div className="alert alert-success">{successMsg}</div>}

          <form onSubmit={handleSubmit}>

            {/* Profil */}
            {activeSection === 'profil' && (
              <div className="settings-section">
                <div className="form-grid">
                  {[
                    { label: t('settings.firstName'), name: 'prenom', type: 'text' },
                    { label: t('settings.lastName'), name: 'nom', type: 'text' },
                    { label: t('settings.email'), name: 'email', type: 'email' },
                    { label: t('settings.phone'), name: 'telephone', type: 'tel' },
                    { label: t('settings.birthDate'), name: 'dateNaissance', type: 'date' },
                  ].map(field => (
                    <div className="form-group" key={field.name}>
                      <label>{field.label}</label>
                      <input type={field.type} name={field.name}
                        value={formData[field.name]} onChange={handleInputChange} />
                    </div>
                  ))}
                  <div className="form-group full-width">
                    <label>{t('settings.address')}</label>
                    <input type="text" name="adresse"
                      value={formData.adresse} onChange={handleInputChange} />
                  </div>
                </div>
              </div>
            )}

            {/* Préférences */}
            {activeSection === 'preferences' && (
              <div className="settings-section">
                <div className="language-section">
                  <h3>{t('settings.languageTitle')}</h3>
                  <LanguageSwitcher />
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>{t('settings.theme')}</label>
                    <select name="theme" value={formData.theme} onChange={handleInputChange}>
                      <option value="clair">{t('settings.themeLight')}</option>
                      <option value="sombre">{t('settings.themeDark')}</option>
                      <option value="auto">{t('settings.themeAuto')}</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>{t('settings.timezone')}</label>
                    <select name="timezone" value={formData.timezone} onChange={handleInputChange}>
                      {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeSection === 'notifications' && (
              <div className="settings-section">
                <div className="form-grid">
                  {[
                    { name: 'notifEmail', label: t('settings.emailNotif') },
                    { name: 'notifSMS',   label: t('settings.smsNotif') },
                  ].map(field => (
                    <div className="form-group checkbox-group" key={field.name}>
                      <label className="checkbox-label">
                        <input type="checkbox" name={field.name}
                          checked={formData[field.name]} onChange={handleInputChange} />
                        <span className="checkmark"></span>
                        {field.label}
                      </label>
                    </div>
                  ))}
                  <div className="form-group">
                    <label>{t('settings.advanceReminder')}</label>
                    <select name="rappelAvance" value={formData.rappelAvance} onChange={handleInputChange}>
                      <option value={5}>5 {t('common.minutes')}</option>
                      <option value={15}>15 {t('common.