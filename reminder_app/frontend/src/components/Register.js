import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Register() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    confirmPassword: '',
    faculte: '',
    niveau: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const handleGoogleRegister = () => {
    setError('');
    setLoading(true);
    // Simulation de l'inscription Google
    setTimeout(() => {
      alert('⚠️ Fonctionnalité Google OAuth en développement.\n\nVeuillez utiliser le formulaire d\'inscription classique pour créer votre compte.');
      setLoading(false);
    }, 1000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.nom || !formData.prenom || !formData.email || !formData.password || !formData.confirmPassword) {
      setError(t('auth.allFieldsRequired'));
      setLoading(false);
      return;
    }

    if (!acceptTerms) {
      setError(t('auth.acceptTermsRequired'));
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.passwordMismatch'));
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError(t('auth.passwordTooShort'));
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          password: formData.password,
          faculte: formData.faculte,
          niveau: formData.niveau
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(t('auth.accountCreated'));
        navigate('/login');
      } else {
        setError(data.error || t('auth.loginError'));
      }
    } catch (error) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      fontFamily: "'Poppins', 'Inter', 'Roboto', sans-serif",
      minHeight: '100vh',
      display: 'flex'
    }}>
      {/* Language Selector - Top Right */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000
      }}>
        <button
          onClick={() => setShowLangDropdown(!showLangDropdown)}
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '12px',
            padding: '10px 16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.95rem',
            fontWeight: '600',
            color: '#1e3a8a',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.boxShadow = '0 6px 25px rgba(59, 130, 246, 0.3)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>
            {i18n.language === 'fr' ? '🇫🇷' : i18n.language === 'en' ? '🇬🇧' : '🇸🇦'}
          </span>
          <span>{i18n.language === 'fr' ? 'FR' : i18n.language === 'en' ? 'EN' : 'AR'}</span>
          <span className="material-icons" style={{ fontSize: '18px' }}>arrow_drop_down</span>
        </button>
        
        {showLangDropdown && (
          <div style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '8px',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
            overflow: 'hidden',
            minWidth: '160px',
            animation: 'fadeIn 0.2s ease'
          }}>
            {[
              { code: 'fr', label: 'Français', flag: '🇫🇷' },
              { code: 'en', label: 'English', flag: '🇬🇧' },
              { code: 'ar', label: 'العربية', flag: '🇸🇦' }
            ].map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  i18n.changeLanguage(lang.code);
                  localStorage.setItem('language', lang.code);
                  setShowLangDropdown(false);
                }}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: 'none',
                  background: i18n.language === lang.code ? '#f0f9ff' : 'white',
                  color: i18n.language === lang.code ? '#3b82f6' : '#1e3a8a',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '0.95rem',
                  fontWeight: i18n.language === lang.code ? '600' : '500',
                  transition: 'all 0.2s ease',
                  textAlign: 'left'
                }}
                onMouseOver={(e) => {
                  if (i18n.language !== lang.code) {
                    e.currentTarget.style.background = '#f8fafc';
                  }
                }}
                onMouseOut={(e) => {
                  if (i18n.language !== lang.code) {
                    e.currentTarget.style.background = 'white';
                  }
                }}
              >
                <span style={{ fontSize: '1.3rem' }}>{lang.flag}</span>
                <span>{lang.label}</span>
                {i18n.language === lang.code && (
                  <span className="material-icons" style={{ marginLeft: 'auto', fontSize: '18px', color: '#3b82f6' }}>check</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Import Google Fonts et Material Icons */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />

      {/* Section gauche - Informations */}
      <div style={{
        flex: '1',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)',
        color: 'white',
        padding: '20px 40px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Éléments décoratifs */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          opacity: 0.3
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-100px',
          left: '-100px',
          width: '300px',
          height: '300px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '50%',
          opacity: 0.3
        }}></div>

        <div style={{ position: 'relative', zIndex: 2 }}>
          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: '700',
            marginBottom: '20px',
            lineHeight: '1.2'
          }}>
            Rejoignez Medical Reminder
          </h1>
          
          <h2 style={{
            fontSize: 'clamp(1.2rem, 2vw, 1.5rem)',
            fontWeight: '400',
            marginBottom: '40px',
            opacity: 0.9,
            lineHeight: '1.4'
          }}>
            La plateforme révolutionnaire pour le suivi médical !
          </h2>

          <p style={{
            fontSize: '1.1rem',
            lineHeight: '1.6',
            marginBottom: '40px',
            opacity: 0.8
          }}>
            Destinée aux professionnels de la santé et aux patients qui souhaitent optimiser leur suivi médical
          </p>

          {/* Illustration médicale */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '40px'
          }}>
            <div style={{
              width: '300px',
              height: '200px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '20px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backdropFilter: 'blur(10px)'
            }}>
              <span className="material-icons" style={{
                fontSize: '4rem',
                color: 'white',
                marginRight: '20px'
              }}>local_hospital</span>
              <span className="material-icons" style={{
                fontSize: '3rem',
                color: 'white',
                opacity: 0.7
              }}>medication</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section droite - Formulaire */}
      <div style={{
        flex: '1',
        backgroundColor: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px'
      }}>
        <div style={{
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          padding: '40px',
          width: '100%',
          maxWidth: '480px'
        }}>
          {/* Retour à l'accueil */}
          <div style={{ marginBottom: '30px' }}>
            <Link to="/" style={{
              display: 'flex',
              alignItems: 'center',
              color: '#64748b',
              textDecoration: 'none',
              fontSize: '0.9rem',
              transition: 'color 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.color = '#1e3a8a'}
            onMouseOut={(e) => e.target.style.color = '#64748b'}>
              <span className="material-icons" style={{ marginRight: '8px', fontSize: '1.2rem' }}>arrow_back</span>
              {t('common.back')}
            </Link>
          </div>

          <h2 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#1e3a8a',
            marginBottom: '10px',
            textAlign: 'center'
          }}>
            {t('auth.register')}
          </h2>

          <p style={{
            color: '#64748b',
            textAlign: 'center',
            marginBottom: '30px',
            fontSize: '0.95rem'
          }}>
            {t('auth.registerSubtitle')}
          </p>

          {/* Option Google */}
          <button 
            onClick={handleGoogleRegister}
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '0.95rem',
              fontWeight: '500',
              opacity: loading ? 0.6 : 1
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseOut={(e) => {
              if (!loading) {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.transform = 'translateY(0)';
              }
            }}>
            <span className="material-icons" style={{ marginRight: '8px', color: '#4285f4' }}>
              login
            </span>
            {t('auth.googleLogin')}
          </button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            margin: '20px 0',
            color: '#64748b',
            fontSize: '0.9rem'
          }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
            <span style={{ margin: '0 15px' }}>{t('auth.or')}</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
          </div>

          {error && (
            <div style={{
              backgroundColor: '#fef2f2',
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

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                color: '#374151',
                fontSize: '0.9rem'
              }}>
                {t('auth.email')}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder={t('auth.emailPlaceholder')}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: 'none',
                  fontSize: '0.95rem',
                  transition: 'border-color 0.3s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                }}
              />
            </div>

            {/* Nom et Prénom */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
              <div style={{ flex: 1 }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '500',
                  color: '#374151',
                  fontSize: '0.9rem'
                }}>
                  {t('auth.lastName')}
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  placeholder={t('auth.lastName')}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: 'none',
                    fontSize: '0.95rem',
                    transition: 'border-color 0.3s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.backgroundColor = 'white';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.backgroundColor = '#f9fafb';
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '500',
                  color: '#374151',
                  fontSize: '0.9rem'
                }}>
                  {t('auth.firstName')}
                </label>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleInputChange}
                  placeholder={t('auth.firstName')}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: 'none',
                    fontSize: '0.95rem',
                    transition: 'border-color 0.3s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.backgroundColor = 'white';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.backgroundColor = '#f9fafb';
                  }}
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                color: '#374151',
                fontSize: '0.9rem'
              }}>
                {t('auth.password')}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={t('auth.passwordPlaceholder')}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    paddingRight: '45px',
                    border: 'none',
                    fontSize: '0.95rem',
                    transition: 'border-color 0.3s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.backgroundColor = 'white';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.backgroundColor = '#f9fafb';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#64748b'
                  }}
                >
                  <span className="material-icons" style={{ fontSize: '1.2rem' }}>
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Confirmation mot de passe */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                color: '#374151',
                fontSize: '0.9rem'
              }}>
                {t('auth.confirmPassword')}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder={t('auth.confirmPassword')}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    paddingRight: '45px',
                    border: 'none',
                    fontSize: '0.95rem',
                    transition: 'border-color 0.3s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.backgroundColor = 'white';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.backgroundColor = '#f9fafb';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#64748b'
                  }}
                >
                  <span className="material-icons" style={{ fontSize: '1.2rem' }}>
                    {showConfirmPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Faculté et Niveau (optionnels) */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
              <div style={{ flex: 1 }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '500',
                  color: '#374151',
                  fontSize: '0.9rem'
                }}>
                  {t('auth.faculty')}
                </label>
                <select
                  name="faculte"
                  value={formData.faculte}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: 'none',
                    fontSize: '0.95rem',
                    transition: 'border-color 0.3s ease',
                    boxSizing: 'border-box',
                    cursor: 'pointer'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.backgroundColor = 'white';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.backgroundColor = '#f9fafb';
                  }}
                >
                  <option value="">Sélectionner...</option>
                  <option value="medecine">Médecine</option>
                  <option value="pharmacie">Pharmacie</option>
                  <option value="dentaire">Médecine Dentaire</option>
                  <option value="infirmier">Sciences Infirmières</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '500',
                  color: '#374151',
                  fontSize: '0.9rem'
                }}>
                  {t('auth.level')}
                </label>
                <select
                  name="niveau"
                  value={formData.niveau}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: 'none',
                    fontSize: '0.95rem',
                    transition: 'border-color 0.3s ease',
                    boxSizing: 'border-box',
                    cursor: 'pointer'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.backgroundColor = 'white';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.backgroundColor = '#f9fafb';
                  }}
                >
                  <option value="">Sélectionner...</option>
                  <option value="L1">Licence 1</option>
                  <option value="L2">Licence 2</option>
                  <option value="L3">Licence 3</option>
                  <option value="M1">Master 1</option>
                  <option value="M2">Master 2</option>
                  <option value="doctorat">Doctorat</option>
                  <option value="professionnel">Professionnel</option>
                </select>
              </div>
            </div>

            {/* Accepter les termes */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                fontSize: '0.9rem',
                color: '#374151'
              }}>
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  style={{
                    marginRight: '10px',
                    transform: 'scale(1.2)',
                    accentColor: '#3b82f6'
                  }}
                />
                {t('auth.acceptTerms')}
              </label>
            </div>

            {/* Bouton d'inscription */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                background: loading ? '#94a3b8' : 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)',
                color: 'white',
                border: 'none',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseOver={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 10px 25px rgba(59, 130, 246, 0.3)';
                }
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              {loading && (
                <span className="material-icons" style={{ 
                  marginRight: '8px', 
                  fontSize: '1.2rem',
                  animation: 'spin 1s linear infinite'
                }}>refresh</span>
              )}
              {loading ? t('common.saving') : t('auth.registerButton')}
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

          {/* Lien vers connexion */}
          <div style={{ textAlign: 'center' }}>
            <p style={{ 
              color: '#64748b', 
              marginBottom: '10px',
              fontSize: '0.9rem'
            }}>
              {t('auth.haveAccount')}
            </p>
            <Link 
              to="/login"
              style={{
                color: '#3b82f6',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '0.95rem',
                transition: 'color 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.color = '#1e3a8a'}
              onMouseOut={(e) => e.target.style.color = '#3b82f6'}
            >
              {t('auth.loginButton')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;