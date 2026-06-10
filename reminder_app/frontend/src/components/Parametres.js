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
                    { label: t('settings.lastName'),  name: 'nom',    type: 'text' },
                    { label: t('settings.email'),     name: 'email',  type: 'email' },
                    { label: t('settings.phone'),     name: 'telephone', type: 'tel' },
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
                      <option value={15}>15 {t('common.minutes')}</option>
                      <option value={30}>30 {t('common.minutes')}</option>
                      <option value={60}>1 {t('common.hour')}</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Sécurité */}
            {activeSection === 'securite' && (
              <div className="settings-section">
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>{t('settings.currentPassword')}</label>
                    <input type="password" name="motDePasseActuel"
                      value={formData.motDePasseActuel} onChange={handleInputChange}
                      placeholder={t('settings.currentPasswordPlaceholder')} />
                  </div>
                  <div className="form-group">
                    <label>{t('settings.newPassword')}</label>
                    <input type="password" name="nouveauMotDePasse"
                      value={formData.nouveauMotDePasse} onChange={handleInputChange}
                      placeholder={t('settings.newPasswordPlaceholder')} />
                  </div>
                  <div className="form-group">
                    <label>{t('settings.confirmPassword')}</label>
                    <input type="password" name="confirmMotDePasse"
                      value={formData.confirmMotDePasse} onChange={handleInputChange}
                      placeholder={t('settings.confirmPasswordPlaceholder')} />
                  </div>
                </div>
                <div className="security-info">
                  <div className="info-box">
                    <h4>{t('settings.securityTips')}</h4>
                    <ul>
                      <li>{t('settings.tip1')}</li>
                      <li>{t('settings.tip2')}</li>
                      <li>{t('settings.tip3')}</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Médical */}
            {activeSection === 'medical' && (
              <div className="settings-section">
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>{t('settings.allergies')}</label>
                    <textarea name="allergies" value={formData.allergies}
                      onChange={handleInputChange} rows="3"
                      placeholder={t('settings.allergiesPlaceholder')} />
                  </div>
                  <div className="form-group full-width">
                    <label>{t('settings.chronicDiseases')}</label>
                    <textarea name="maladiesChroniques" value={formData.maladiesChroniques}
                      onChange={handleInputChange} rows="3"
                      placeholder={t('settings.chronicDiseasesPlaceholder')} />
                  </div>
                  <div className="form-group">
                    <label>{t('settings.doctor')}</label>
                    <input type="text" name="medecinTraitant"
                      value={formData.medecinTraitant} onChange={handleInputChange}
                      placeholder={t('settings.doctorPlaceholder')} />
                  </div>
                  <div className="form-group">
                    <label>{t('settings.pharmacy')}</label>
                    <input type="text" name="pharmacie"
                      value={formData.pharmacie} onChange={handleInputChange}
                      placeholder={t('settings.pharmacyPlaceholder')} />
                  </div>
                </div>
              </div>
            )}

            {/* Données */}
            {activeSection === 'donnees' && (
              <div className="settings-section">
                <div className="data-management">
                  <div className="data-section">
                    <h3>{t('settings.exportData')}</h3>
                    <p>{t('settings.exportDescription')}</p>
                    <div className="button-group">
                      <button type="button" className="btn-export">
                        📄 {t('settings.exportPDF')}
                      </button>
                      <button type="button" className="btn-export">
                        💾 {t('settings.exportJSON')}
                      </button>
                    </div>
                  </div>

                  <div className="data-section">
                    <h3>{t('settings.backupData')}</h3>
                    <p>{t('settings.backupDescription')}</p>
                    <button type="button" className="btn-backup">
                      ☁️ {t('settings.createBackup')}
                    </button>
                  </div>

                  <div className="data-section danger-zone">
                    <h3>{t('settings.dangerZone')}</h3>
                    <p>{t('settings.dangerDescription')}</p>
                    <div className="button-group">
                      <button type="button" className="btn-danger">
                        {t('settings.deleteAllData')}
                      </button>
                      <button type="button" className="btn-danger">
                        {t('settings.deleteAccount')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Boutons d'action */}
            <div className="form-actions">
              <button type="submit" className="btn-save" disabled={saving}>
                {saving ? `⏳ ${t('common.saving')}` : `💾 ${t('common.save')}`}
              </button>
              <button type="button" className="btn-cancel"
                onClick={() => window.location.reload()}>
                {t('common.cancel')}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Parametres;