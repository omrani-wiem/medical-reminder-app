import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function ForgotPassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email) {
      setError(t('forgotPassword.errorEmail'));
      setLoading(false);
      return;
    }

     try {
      const response = await fetch('http://localhost:5000/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/reset-password', { state: { email } });
        }, 3000);
      } else {
        setError(data.error || t('forgotPassword.errorServer'));
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError(t('forgotPassword.errorServer'));
    } finally {
      setLoading(false);
    }
  };

     return (
    <div style={{ 
      fontFamily: "'Poppins', 'Inter', 'Roboto', sans-serif",
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '20px'
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />

      <div style={{
        backgroundColor: 'white',
        borderRadius: '24px',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)',
        maxWidth: '500px',
        width: '100%',
        padding: '50px 40px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Élément décoratif */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '150px',
          height: '150px',
          background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
          borderRadius: '50%',
          opacity: 0.1
        }}></div>

        {/* Icône principale */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '30px'
        }}>
            <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%)',
            borderRadius: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0 15px 30px rgba(59, 130, 246, 0.3)'
          }}>
            <span className="material-icons" style={{
              fontSize: '2.5rem',
              color: 'white'
            }}>lock_reset</span>
          </div>
        </div>
        {/* Titre */}
        <h1 style={{
          fontSize: '2rem',
          fontWeight: '700',
          color: '#1e293b',
          textAlign: 'center',
          marginBottom: '10px'
        }}>
          {t('forgotPassword.title')}
        </h1>

        <p style={{
          textAlign: 'center',
          color: '#64748b',
          fontSize: '0.95rem',
          marginBottom: '35px',
          lineHeight: '1.6'
        }}>
          {t('forgotPassword.subtitle')}
        </p>

        {success ? (
          <div style={{
            backgroundColor: '#dcfce7',
            border: '2px solid #86efac',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center',
            marginBottom: '25px'
          }}>
            <span className="material-icons" style={{
              fontSize: '3rem',
              color: '#16a34a',
              marginBottom: '15px',
              display: 'block'
            }}>mark_email_read</span>
            <h3 style={{
              color: '#15803d',
              fontSize: '1.1rem',
              fontWeight: '600',
              marginBottom: '10px'
            }}>
              {t('forgotPassword.successTitle')}
            </h3>
            <p style={{
              color: '#166534',
              fontSize: '0.9rem',
              lineHeight: '1.5'
            }}>
              {t('forgotPassword.successMessage')} <strong>{email}</strong>.
            </p>
            <p style={{
              color: '#166534',
              fontSize: '0.85rem',
              marginTop: '10px',
              fontStyle: 'italic'
            }}>
              {t('forgotPassword.redirecting')}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{
                backgroundColor: '#fef2f2',
                border: '2px solid #fca5a5',
                borderRadius: '12px',
                color: '#dc2626',
                padding: '12px 16px',
                marginBottom: '20px',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center'
              }}>
                <span className="material-icons" style={{ marginRight: '8px', fontSize: '1.2rem' }}>error</span>
                {error}
              </div>
            )}

            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                marginBottom: '10px',
                fontWeight: '600',
                color: '#374151',
                fontSize: '0.95rem'
              }}>
                {t('forgotPassword.emailLabel')}
              </label>
              <div style={{ position: 'relative' }}>
                <span className="material-icons" style={{
                  position: 'absolute',
                  left: '15px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                  fontSize: '1.3rem'
                }}>email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('forgotPassword.emailPlaceholder')}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '14px 14px 14px 50px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '0.95rem',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                    opacity: loading ? 0.7 : 1
                  }}
                  onFocus={(e) => {
                    if (!loading) {
                      e.target.style.borderColor = '#3b82f6';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                background: loading ? '#94a3b8' : 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: loading ? 'none' : '0 10px 25px rgba(59, 130, 246, 0.3)'
              }}
              onMouseOver={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 15px 35px rgba(59, 130, 246, 0.4)';
                }
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 10px 25px rgba(59, 130, 246, 0.3)';
              }}
            >
              {loading && (
                <span className="material-icons" style={{ 
                  marginRight: '8px', 
                  fontSize: '1.2rem',
                  animation: 'spin 1s linear infinite'
                }}>refresh</span>
              )}
              {loading ? t('forgotPassword.sending') : t('forgotPassword.sendCode')}
            </button>

            <style>
              {`
                @keyframes spin {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }
              `}
            </style>
          </form>
        )}

        {/* Lien retour */}
        <div style={{ textAlign: 'center' }}>
          <Link 
            to="/login"
            style={{
              color: '#3b82f6',
              textDecoration: 'none',
              fontWeight: '500',
              fontSize: '0.9rem',
              display: 'inline-flex',
              alignItems: 'center',
              transition: 'color 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.color = '#1e3a8a'}
            onMouseOut={(e) => e.target.style.color = '#3b82f6'}
          >
            <span className="material-icons" style={{ fontSize: '1rem', marginRight: '5px' }}>arrow_back</span>
            {t('forgotPassword.backToLogin')}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;





