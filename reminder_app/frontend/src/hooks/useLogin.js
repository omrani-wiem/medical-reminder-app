// hooks/useLogin.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { login } from '../services/authService';

export const useLogin = ({ onLogin }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError(t('auth.allFieldsRequired'));
      return;
    }

    try {
      setLoading(true);
      const data = await login(formData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onLogin();
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || t('auth.loginError'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setError('');
    setLoading(true);
    setTimeout(() => {
      alert('⚠️ Fonctionnalité Google OAuth en développement.\n\nVeuillez créer un compte pour vous connecter.');
      setLoading(false);
    }, 1000);
  };

  return {
    formData, error, loading,
    showPassword, setShowPassword,
    showLangDropdown, setShowLangDropdown,
    handleInputChange, handleSubmit, handleGoogleLogin
  };
};