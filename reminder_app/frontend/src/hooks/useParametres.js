// hooks/useParametres.js
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getSettings, saveSettings } from '../services/settingsService';
import { FORM_INITIAL, getUserFromStorage } from '../utils/parametresUtils';

export const useParametres = () => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState('profil');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState(FORM_INITIAL);

  useEffect(() => {
    const loadSettings = async () => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      if (!user?.email) {
        setLoading(false);
        return;
      }

      try {
        const settings = await getSettings(user.email);
        setFormData(prev => ({ ...prev, ...settings }));
      } catch {
        // Fallback localStorage si backend indisponible
        setFormData(prev => ({ ...prev, ...getUserFromStorage() }));
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
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
    setError('');
    setSuccessMsg('');

    // Validation mot de passe
    if (formData.nouveauMotDePasse &&
        formData.nouveauMotDePasse !== formData.confirmMotDePasse) {
      setError(t('settings.passwordMismatch'));
      return;
    }

    try {
      setSaving(true);
      await saveSettings(formData);

      // Sync localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...user, ...formData }));

      setSuccessMsg(t('common.successSave'));
    } catch {
      setError(t('common.error'));
    } finally {
      setSaving(false);
    }
  };

  return {
    activeSection, setActiveSection,
    loading, saving,
    formData, error, successMsg,
    handleInputChange, handleSubmit
  };
};