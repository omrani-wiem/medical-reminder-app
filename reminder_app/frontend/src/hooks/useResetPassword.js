
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { resetPassword } from '../services/authService';
import { validerResetPassword } from '../utils/resetPasswordUtils';

export const useResetPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: location.state?.email || '',
    code: '',
    new_password: '',
    confirm_password: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const erreur = validerResetPassword(formData, t);
    if (erreur) { setError(erreur); return; }

    try {
      setLoading(true);
      await resetPassword(formData.email, formData.code, formData.new_password);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.error || t('resetPassword.errorServer'));
    } finally {
      setLoading(false);
    }
  };

  return {
    formData, loading, success, error,
    showPassword, setShowPassword,
    showConfirmPassword, setShowConfirmPassword,
    handleChange, handleSubmit
  };
};