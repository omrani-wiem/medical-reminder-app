import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { forgotPassword } from '../services/authService';

export const useForgotPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError(t('forgotPassword.errorEmail'));
      return;
    }

    try {
      setLoading(true);
      await forgotPassword(email);
      setSuccess(true);
      setTimeout(() => {
        navigate('/reset-password', { state: { email } });
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.error || t('forgotPassword.errorServer'));
    } finally {
      setLoading(false);
    }
  };

  return { email, setEmail, loading, success, error, handleSubmit };
};