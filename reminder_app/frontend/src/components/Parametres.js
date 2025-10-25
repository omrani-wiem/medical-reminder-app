import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import './Parametres.css';

const Parametres = () => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState('profil');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    dateNaissance: '',
    adresse: '',
    
    // Préférences
    theme: 'clair',
    langue: 'fr',
    timezone: 'Europe/Paris',
    
    // Notifications
    notifPush: true,
    notifEmail: true,
    notifSMS: false,
    rappelAvance: 15,
    
    // Sécurité
    motDePasseActuel: '',
    nouveauMotDePasse: '',
    confirmMotDePasse: '',
    
    // Données médicales
    allergies: '',
    maladiesChroniques: '',
    medecinTraitant: '',
    pharmacie: ''
  });

  // Charger les données utilisateur depuis localStorage et backend
  useEffect(() => {
    const loadUserSettings = async () => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.email) {
        try {
          // Charger depuis le backend
          const response = await fetch(`http://localhost:5000/settings?email=${user.email}`);
          if (response.ok) {
            const settings = await response.json();
            setFormData(prev => ({
              ...prev,
              ...settings
            }));
          } else {
            // Fallback sur localStorage si le backend n'a pas de données
            setFormData(prev => ({
              ...prev,
              nom: user.nom || '',
              prenom: user.prenom || '',
              email: user.email || '',
              telephone: user.telephone || '',
              dateNaissance: user.dateNaissance || '',
              adresse: user.adresse || ''
            }));
          }
        } catch (error) {
          console.error('Erreur lors du chargement des paramètres:', error);
          // Fallback sur localStorage
          setFormData(prev => ({
            ...prev,
            nom: user.nom || '',
            prenom: user.prenom || '',
            email: user.email || '',
            telephone: user.telephone || '',
            dateNaissance: user.dateNaissance || '',
            adresse: user.adresse || ''
          }));
        }
      }
      setLoading(false);
    };

    loadUserSettings();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Sauvegarder dans le backend
      const response = await fetch('http://localhost:5000/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Mettre à jour localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = { ...user, ...formData };
        localStorage.setItem('user', JSON.stringify(updatedUser));

        alert(t('common.successSave'));
      } else {
        alert(t('common.error'));
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert(t('common.error'));
    } finally {
      setSaving(false);
    }
  };

  const sections = [
    { id: 'profil', label: t('settings.profile') },
    { id: 'preferences', label: t('settings.preferences') },
    { id: 'notifications', label: t('settings.notifications') },
    { id: 'securite', label: t('settings.security') },
    { id: 'medical', label: t('settings.medical') },
    { id: 'donnees', label: t('settings.dataManagement') }
  ];

  if (loading) {
    return (
      <div className="parametres-loading">
        <div className="spinner"></div>
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <div className="parametres">
      <div className="parametres-container">
        {/* Menu de navigation */}
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

        {/* Contenu principal */}
        <div className="parametres-content">
          <form onSubmit={handleSubmit}>
            
            {/* Section Profil Personnel */}
            {activeSection === 'profil' && (
              <div className="settings-section">
                <div className="form-grid">
                  <div className="form-group">
                    <label>{t('settings.firstName')}</label>
                    <input
                      type="text"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>{t('settings.lastName')}</label>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>{t('settings.email')}</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>{t('settings.phone')}</label>
                    <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>{t('settings.birthDate')}</label>
                    <input
                      type="date"
                      name="dateNaissance"
                      value={formData.dateNaissance}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>{t('settings.address')}</label>
                    <input
                      type="text"
                      name="adresse"
                      value={formData.adresse}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Section Préférences */}
            {activeSection === 'preferences' && (
              <div className="settings-section">
                {/* Sélecteur de langue */}
                <div className="language-section">
                  <h3>{t('settings.languageTitle')}</h3>
                  <LanguageSwitcher />
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>{t('settings.theme')}</label>
                    <select
                      name="theme"
                      value={formData.theme}
                      onChange={handleInputChange}
                    >
                      <option value="clair">{t('settings.themeLight')}</option>
                      <option value="sombre">{t('settings.themeDark')}</option>
                      <option value="auto">{t('settings.themeAuto')}</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>{t('settings.timezone')}</label>
                    <select
                      name="timezone"
                      value={formData.timezone}
                      onChange={handleInputChange}
                    >
                      <option value="Europe/Paris">Europe/Paris</option>
                      <option value="Europe/London">Europe/London</option>
                      <option value="America/New_York">America/New_York</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Section Notifications */}
            {activeSection === 'notifications' && (
              <div className="settings-section">
                <div className="form-grid">
                  <div className="form-group checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="notifEmail"
                        checked={formData.notifEmail}
                        onChange={handleInputChange}
                      />
                      <span className="checkmark"></span>
                      {t('settings.emailNotif')}
                    </label>
                  </div>
                  <div className="form-group checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="notifSMS"
                        checked={formData.notifSMS}
                        onChange={handleInputChange}
                      />
                      <span className="checkmark"></span>
                      {t('settings.smsNotif')}
                    </label>
                  </div>
                  <div className="form-group">
                    <label>{t('settings.advanceReminder')}</label>
                    <select
                      name="rappelAvance"
                      value={formData.rappelAvance}
                      onChange={handleInputChange}
                    >
                      <option value={5}>5 {t('common.minutes')}</option>
                      <option value={15}>15 {t('common.minutes')}</option>
                      <option value={30}>30 {t('common.minutes')}</option>
                      <option value={60}>1 {t('common.hour')}</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Section Sécurité */}
            {activeSection === 'securite' && (
              <div className="settings-section">
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>{t('settings.currentPassword')}</label>
                    <input
                      type="password"
                      name="motDePasseActuel"
                      value={formData.motDePasseActuel}
                      onChange={handleInputChange}
                      placeholder={t('settings.currentPasswordPlaceholder')}
                    />
                  </div>
                  <div className="form-group">
                    <label>{t('settings.newPassword')}</label>
                    <input
                      type="password"
                      name="nouveauMotDePasse"
                      value={formData.nouveauMotDePasse}
                      onChange={handleInputChange}
                      placeholder={t('settings.newPasswordPlaceholder')}
                    />
                  </div>
                  <div className="form-group">
                    <label>{t('settings.confirmPassword')}</label>
                    <input
                      type="password"
                      name="confirmMotDePasse"
                      value={formData.confirmMotDePasse}
                      onChange={handleInputChange}
                      placeholder={t('settings.confirmPasswordPlaceholder')}
                    />
                  </div>
                </div>
                <div className="security-info">
                  <div className="info-box">
                    <h4>{t('settings.securityTips')}</h4>
                    <ul>
                      <ol>{t('settings.tip1')}</ol>
                      <ol>{t('settings.tip2')}</ol>
                      <ol>{t('settings.tip3')}</ol>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Section Informations Médicales */}
            {activeSection === 'medical' && (
              <div className="settings-section">
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>{t('settings.allergies')}</label>
                    <textarea
                      name="allergies"
                      value={formData.allergies}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder={t('settings.allergiesPlaceholder')}
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>{t('settings.chronicDiseases')}</label>
                    <textarea
                      name="maladiesChroniques"
                      value={formData.maladiesChroniques}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder={t('settings.chronicDiseasesPlaceholder')}
                    />
                  </div>
                  <div className="form-group">
                    <label>{t('settings.doctor')}</label>
                    <input
                      type="text"
                      name="medecinTraitant"
                      value={formData.medecinTraitant}
                      onChange={handleInputChange}
                      placeholder={t('settings.doctorPlaceholder')}
                    />
                  </div>
                  <div className="form-group">
                    <label>{t('settings.pharmacy')}</label>
                    <input
                      type="text"
                      name="pharmacie"
                      value={formData.pharmacie}
                      onChange={handleInputChange}
                      placeholder={t('settings.pharmacyPlaceholder')}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Section Gestion des Données */}
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
            <div className="form-actions" style={{ backgroundColor: 'white' }}>
              <button type="submit" className="btn-save" disabled={saving}>
                {saving ? '⏳ ' + t('common.saving') : ' ' + t('common.save')}
              </button>
              <button type="button" className="btn-cancel">
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