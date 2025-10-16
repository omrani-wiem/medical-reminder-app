import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function ResetPassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = location.state?.email || '';
  
  const [formData, setFormData] = useState({
    email: emailFromState,
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.email || !formData.code || !formData.new_password) {
      setError(t('auth.allFieldsRequired'));
      setLoading(false);
      return;
    }

    if (formData.new_password !== formData.confirm_password) {
      setError(t('auth.passwordMismatch'));
      setLoading(false);
      return;
    }

    if (formData.new_password.length < 6) {
      setError(t('auth.passwordTooShort'));
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          code: formData.code,
          new_password: formData.new_password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        // Rediriger vers login après 3 secondes
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(data.error || t('resetPassword.errorServer'));
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError(t('resetPassword.errorServer'));
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
        maxWidth: '550px',
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
          background: 'linear-gradient(135deg, #10b981, #34d399)',
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
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            borderRadius: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0 15px 30px rgba(16, 185, 129, 0.3)'
          }}>
            <span className="material-icons" style={{
              fontSize: '2.5rem',
              color: 'white'
            }}>vpn_key</span>
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
          {t('resetPassword.title')}
        </h1>

        <p style={{
          textAlign: 'center',
          color: '#64748b',
          fontSize: '0.95rem',
          marginBottom: '35px',
          lineHeight: '1.6'
        }}>
          {t('resetPassword.subtitle')}
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
            }}>check_circle</span>
            <h3 style={{
              color: '#15803d',
              fontSize: '1.1rem',
              fontWeight: '600',
              marginBottom: '10px'
            }}>
              {t('resetPassword.successTitle')}
            </h3>
            <p style={{
              color: '#166534',
              fontSize: '0.9rem',
              lineHeight: '1.5'
            }}>
              {t('resetPassword.successMessage')}
            </p>
            <p style={{
              color: '#166534',
              fontSize: '0.85rem',
              marginTop: '10px',
              fontStyle: 'italic'
            }}>
              {t('resetPassword.redirecting')}
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

            {/* Email */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '10px',
                fontWeight: '600',
                color: '#374151',
                fontSize: '0.95rem'
              }}>
                {t('resetPassword.emailLabel')}
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
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t('resetPassword.emailPlaceholder')}
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
                      e.target.style.borderColor = '#10b981';
                      e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Code */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '10px',
                fontWeight: '600',
                color: '#374151',
                fontSize: '0.95rem'
              }}>
                {t('resetPassword.codeLabel')}
              </label>
              <div style={{ position: 'relative' }}>
                <span className="material-icons" style={{
                  position: 'absolute',
                  left: '15px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                  fontSize: '1.3rem'
                }}>pin</span>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder={t('resetPassword.codePlaceholder')}
                  maxLength="6"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '14px 14px 14px 50px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '1.2rem',
                    letterSpacing: '0.3em',
                    textAlign: 'center',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                    opacity: loading ? 0.7 : 1
                  }}
                  onFocus={(e) => {
                    if (!loading) {
                      e.target.style.borderColor = '#10b981';
                      e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              <p style={{
                fontSize: '0.8rem',
                color: '#94a3b8',
                marginTop: '5px',
                marginLeft: '5px'
              }}>
                {t('resetPassword.checkEmail')}
              </p>
            </div>

            {/* Nouveau mot de passe */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '10px',
                fontWeight: '600',
                color: '#374151',
                fontSize: '0.95rem'
              }}>
                {t('resetPassword.newPasswordLabel')}
              </label>
              <div style={{ position: 'relative' }}>
                <span className="material-icons" style={{
                  position: 'absolute',
                  left: '15px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                  fontSize: '1.3rem'
                }}>lock</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="new_password"
                  value={formData.new_password}
                  onChange={handleChange}
                  placeholder={t('resetPassword.passwordPlaceholder')}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '14px 50px 14px 50px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '0.95rem',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                    opacity: loading ? 0.7 : 1
                  }}
                  onFocus={(e) => {
                    if (!loading) {
                      e.target.style.borderColor = '#10b981';
                      e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  style={{
                    position: 'absolute',
                    right: '15px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    color: '#64748b',
                    opacity: loading ? 0.5 : 1
                  }}
                >
                  <span className="material-icons" style={{ fontSize: '1.2rem' }}>
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Confirmation mot de passe */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                marginBottom: '10px',
                fontWeight: '600',
                color: '#374151',
                fontSize: '0.95rem'
              }}>
                {t('resetPassword.confirmPasswordLabel')}
              </label>
              <div style={{ position: 'relative' }}>
                <span className="material-icons" style={{
                  position: 'absolute',
                  left: '15px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                  fontSize: '1.3rem'
                }}>lock_outline</span>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  placeholder={t('resetPassword.confirmPasswordPlaceholder')}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '14px 50px 14px 50px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '0.95rem',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                    opacity: loading ? 0.7 : 1
                  }}
                  onFocus={(e) => {
                    if (!loading) {
                      e.target.style.borderColor = '#10b981';
                      e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                  style={{
                    position: 'absolute',
                    right: '15px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    color: '#64748b',
                    opacity: loading ? 0.5 : 1
                  }}
                >
                  <span className="material-icons" style={{ fontSize: '1.2rem' }}>
                    {showConfirmPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                background: loading ? '#94a3b8' : 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)',
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
                boxShadow: loading ? 'none' : '0 10px 25px rgba(16, 185, 129, 0.3)'
              }}
              onMouseOver={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 15px 35px rgba(16, 185, 129, 0.4)';
                }
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 10px 25px rgba(16, 185, 129, 0.3)';
              }}
            >
              {loading && (
                <span className="material-icons" style={{ 
                  marginRight: '8px', 
                  fontSize: '1.2rem',
                  animation: 'spin 1s linear infinite'
                }}>refresh</span>
              )}
              {loading ? t('resetPassword.resetting') : t('resetPassword.resetButton')}
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

        {/* Liens */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Link 
            to="/forgot-password"
            style={{
              color: '#64748b',
              textDecoration: 'none',
              fontSize: '0.85rem',
              transition: 'color 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.color = '#3b82f6'}
            onMouseOut={(e) => e.target.style.color = '#64748b'}
          >
            {t('resetPassword.resendCode')}
          </Link>
          <Link 
            to="/login"
            style={{
              color: '#3b82f6',
              textDecoration: 'none',
              fontWeight: '500',
              fontSize: '0.9rem',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.color = '#1e3a8a'}
            onMouseOut={(e) => e.target.style.color = '#3b82f6'}
          >
            <span className="material-icons" style={{ fontSize: '1rem', marginRight: '5px' }}>arrow_back</span>
            {t('resetPassword.backToLogin')}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
