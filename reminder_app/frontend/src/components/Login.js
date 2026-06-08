// Login.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLogin } from '../hooks/useLogin';
import { LANGUAGES } from '../utils/languageUtils';
import './Login.css';

function Login({ onLogin }) {
  const { t, i18n } = useTranslation();
  const {
    formData, error, loading,
    showPassword, setShowPassword,
    showLangDropdown, setShowLangDropdown,
    handleInputChange, handleSubmit, handleGoogleLogin
  } = useLogin({ onLogin });

  const currentLang = LANGUAGES.find(l => l.code === i18n.language);

  return (
    <div style={{ fontFamily: "'Poppins', 'Inter', 'Roboto', sans-serif", minHeight: '100vh', display: 'flex' }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />

      {/* Sélecteur de langue */}
      <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000 }}>
        <button
          onClick={() => setShowLangDropdown(!showLangDropdown)}
          style={{
            background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)',
            border: '1px solid rgba(59,130,246,0.3)', borderRadius: '12px',
            padding: '10px 16px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px',
            fontSize: '0.95rem', fontWeight: '600', color: '#1e3a8a',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>{currentLang?.flag}</span>
          <span>{currentLang?.code.toUpperCase()}</span>
          <span className="material-icons" style={{ fontSize: '18px' }}>arrow_drop_down</span>
        </button>

        {showLangDropdown && (
          <div style={{
            position: 'absolute', top: '100%', right: 0, marginTop: '8px',
            background: 'white', borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
            overflow: 'hidden', minWidth: '160px'
          }}>
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => {
                  i18n.changeLanguage(lang.code);
                  localStorage.setItem('language', lang.code);
                  setShowLangDropdown(false);
                }}
                style={{
                  width: '100%', padding: '12px 16px', border: 'none',
                  background: i18n.language === lang.code ? '#f0f9ff' : 'white',
                  color: i18n.language === lang.code ? '#3b82f6' : '#1e3a8a',
                  cursor: 'pointer', display: 'flex', alignItems: 'center',
                  gap: '12px', fontSize: '0.95rem',
                  fontWeight: i18n.language === lang.code ? '600' : '500'
                }}
              >
                <span style={{ fontSize: '1.3rem' }}>{lang.flag}</span>
                <span>{lang.name}</span>
                {i18n.language === lang.code && (
                  <span className="material-icons" style={{ marginLeft: 'auto', fontSize: '18px', color: '#3b82f6' }}>check</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Section gauche — décorative */}
      <div style={{
        flex: '1',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)',
        color: 'white', padding: '60px 40px',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', position: 'relative', overflow: 'hidden'
      }}>
        {/* Éléments décoratifs */}
        {[
          { top: '10%', right: '10%', size: 120, color: '59, 130, 246', delay: '6s' },
          { bottom: '20%', left: '15%', size: 80, color: '16, 185, 129', delay: '8s' },
          { top: '60%', right: '20%', size: 60, color: '245, 101, 101', delay: '7s' },
        ].map((el, i) => (
          <div key={i} style={{
            position: 'absolute', ...el,
            width: `${el.size}px`, height: `${el.size}px`,
            background: `rgba(${el.color}, 0.1)`,
            borderRadius: '50%',
            animation: `float ${el.delay} ease-in-out infinite`
          }} />
        ))}

        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          {/* Logo */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
            <div style={{
              width: '100px', height: '100px',
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '24px', display: 'flex',
              justifyContent: 'center', alignItems: 'center',
              boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
              border: '2px solid rgba(255,255,255,0.2)'
            }}>
              <span className="material-icons" style={{ fontSize: '3.5rem', color: 'white' }}>
                local_hospital
              </span>
            </div>
          </div>

          <h1 style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', fontWeight: '800', marginBottom: '15px' }}>
            <span style={{ color: 'white' }}>{t('auth.welcome')}</span><br />
            <span style={{ color: '#93c5fd' }}>Medical Reminder</span>
          </h1>

          <p style={{ fontSize: '1rem', lineHeight: '1.7', opacity: 0.85, color: '#cbd5e1', maxWidth: '450px', margin: '0 auto 60px' }}>
            Connectez-vous pour accéder à votre tableau de bord et gérer vos médicaments et rappels avec précision
          </p>

          {/* Badges */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            {[
              { icon: 'dashboard', color: '#3b82f6', label: 'Tableau de bord' },
              { icon: 'schedule', color: '#10b981', label: 'Rappels précis' }
            ].map(item => (
              <div key={item.icon} style={{
                width: '75px', height: '75px',
                background: item.color, borderRadius: '20px',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                boxShadow: `0 15px 30px ${item.color}66`
              }}>
                <span className="material-icons" style={{ fontSize: '2.2rem', color: 'white' }}>
                  {item.icon}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section droite — formulaire */}
      <div style={{
        flex: '1', backgroundColor: '#f8fafc',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '40px'
      }}>
        <div style={{ width: '100%', maxWidth: '480px', padding: '40px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>

          <div style={{ marginBottom: '30px' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', color: '#64748b', textDecoration: 'none', fontSize: '0.9rem' }}>
              <span className="material-icons" style={{ marginRight: '8px', fontSize: '1.2rem' }}>arrow_back</span>
              {t('common.back')}
            </Link>
          </div>

          <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#1e3a8a', marginBottom: '10px', textAlign: 'center' }}>
            {t('auth.login')}
          </h2>
          <p style={{ color: '#64748b', textAlign: 'center', marginBottom: '30px', fontSize: '0.95rem' }}>
            {t('auth.loginSubtitle')}
          </p>

          {/* Bouton Google */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            style={{
              width: '100%', padding: '12px', border: '1px solid #e5e7eb',
              background: 'white', borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '20px', cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '0.95rem', fontWeight: '500', opacity: loading ? 0.6 : 1
            }}
          >
            <span className="material-icons" style={{ marginRight: '8px', color: '#4285f4' }}>login</span>
            {t('auth.googleLogin')}
          </button>

          {/* Séparateur */}
          <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', color: '#64748b', fontSize: '0.9rem' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
            <span style={{ margin: '0 15px' }}>{t('auth.or')}</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
          </div>

          {/* Erreur */}
          {error && (
            <div style={{
              backgroundColor: '#fef2f2', color: '#dc2626',
              padding: '12px 16px', marginBottom: '20px',
              borderRadius: '10px', fontSize: '0.9rem',
              display: 'flex', alignItems: 'center'
            }}>
              <span className="material-icons" style={{ marginRight: '8px', fontSize: '1.2rem' }}>error</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '0.9rem' }}>
                {t('auth.email')}
              </label>
              <input
                type="email" name="email"
                value={formData.email} onChange={handleInputChange}
                placeholder={t('auth.emailPlaceholder')}
                disabled={loading}
                style={{
                  width: '100%', padding: '12px 16px',
                  border: '2px solid #e5e7eb', borderRadius: '10px',
                  fontSize: '0.95rem', boxSizing: 'border-box',
                  opacity: loading ? 0.7 : 1
                }}
              />
            </div>

            {/* Mot de passe */}
            <div style={{ marginBottom: '25px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontWeight: '500', color: '#374151', fontSize: '0.9rem' }}>
                  {t('auth.password')}
                </label>
                <Link to="/forgot-password" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '500' }}>
                  {t('auth.forgotPassword')}
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password} onChange={handleInputChange}
                  placeholder={t('auth.passwordPlaceholder')}
                  disabled={loading}
                  style={{
                    width: '100%', padding: '12px 45px 12px 16px',
                    border: '2px solid #e5e7eb', borderRadius: '10px',
                    fontSize: '0.95rem', boxSizing: 'border-box',
                    opacity: loading ? 0.7 : 1
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  style={{
                    position: 'absolute', right: '12px', top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer', color: '#64748b'
                  }}
                >
                  <span className="material-icons" style={{ fontSize: '1.2rem' }}>
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              style={{
                width: '100%', padding: '14px',
                background: loading ? '#94a3b8' : 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)',
                color: 'white', border: 'none', borderRadius: '10px',
                fontSize: '1rem', fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginBottom: '20px', display: 'flex',
                alignItems: 'center', justifyContent: 'center'
              }}
            >
              {loading && (
                <span className="material-icons" style={{ marginRight: '8px', fontSize: '1.2rem', animation: 'spin 1s linear infinite' }}>
                  refresh
                </span>
              )}
              {loading ? t('common.loading') : t('auth.loginButton')}
            </button>

            <style>{`
              @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
              @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
            `}</style>
          </form>

          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#64748b', marginBottom: '10px', fontSize: '0.9rem' }}>{t('auth.noAccount')}</p>
            <Link to="/register" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem' }}>
              {t('auth.createAccount')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;