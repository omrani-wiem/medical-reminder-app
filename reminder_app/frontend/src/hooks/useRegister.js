// hooks/useRegister.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { register } from '../services/authService';
import { FORM_INITIAL, validerRegister } from '../utils/registerUtils';

export const useRegister = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(FORM_INITIAL);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const erreur = validerRegister(formData, acceptTerms, t);
    if (erreur) { setError(erreur); return; }

    try {
      setLoading(true);
      await register({
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        password: formData.password,
        faculte: formData.faculte,
        niveau: formData.niveau
      });
      alert(t('auth.accountCreated'));
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || t('auth.loginError'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    setError('');
    setLoading(true);
    setTimeout(() => {
      alert('⚠️ Fonctionnalité Google OAuth en développement.');
      setLoading(false);
    }, 1000);
  };

  return {
    formData, error, loading,
    showPassword, setShowPassword,
    showConfirmPassword, setShowConfirmPassword,
    acceptTerms, setAcceptTerms,
    showLangDropdown, setShowLangDropdown,
    handleInputChange, handleSubmit, handleGoogleRegister
  };
};