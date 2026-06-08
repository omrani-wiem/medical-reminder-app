// Register.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useRegister } from '../hooks/useRegister';
import { LANGUAGES } from '../utils/languageUtils';
import { FACULTES, NIVEAUX } from '../utils/registerUtils';

function Register() {
  const { t, i18n } = useTranslation();
  const {
    formData, error, loading,
    showPassword, setShowPassword,
    showConfirmPassword, setShowConfirmPassword,
    acceptTerms, setAcceptTerms,
    showLangDropdown, setShowLangDropdown,
    handleInputChange, handleSubmit, handleGoogleRegister
  } = useRegister();

  const currentLang = LANGUAGES.find(l => l.code === i18n.language);

  const inputStyle = {
    width: '100%', padding: '12px 16px',
    border: '2px solid #e5e7eb', borderRadius: '10px',
    fontSize: '0.95rem', boxSizing: 'border-box'
  };

  const labelStyle = {
    display: 'block', marginBottom: '8px',
    fontWeight: '500', color: '#374151', fontSize: '0.9rem'
  };

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", minHeight: '100vh', display: 'flex' }}>
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
              <button key={lang.code}
                onClick={() => {
                  i18n.changeLanguage(lang.code);
                  localStorage.setItem('language', lang.code);
                  setShowLangDropdown(false);
                }}
                style={{
                  width: '100%', padding: '12px 16px', border: 'none',
                  background: i18n.language === lang.code ? '#f0f9ff' : 'white',
                  color: i18n.language === lang.code ? '#3b82f6' : '#1e3a8a',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px',
                  fontSize: '0.95rem', fontWeight: i18n.language === lang.code ? '600' : '500'
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
        color: 'white', padding: '20px 40px',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', position: 'relative', overflow: 'hidden'
      }}>
        {[
          { top: '-50px', right: '-50px', size: 200 },
          { bottom: '-100px', left: '-100px', size: 300 }
        ].map((el, i) => (
          <div key={i} style={{
            position: 'absolute', ...el,
            width: `${el.size}px`, height: `${el.size}px`,
            background: 'rgba(255,255,255,0.05)', borderRadius: '50%'
          }} />
        ))}

        <div style={{ position: 'relative', zIndex: 2 }}>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '700', marginBottom: '20px' }}>
            Rejoignez Medical Reminder
          </h1>
          <h2 style={{ fontSize: 'clamp(1.2rem, 2vw, 1.5rem)', fontWeight: '400', marginBottom: '40px', opacity: 0.9 }}>
            La plateforme révolutionnaire pour le suivi médical !
          </h2>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', opacity: 0.8 }}>
            Destinée aux professionnels de la santé et aux patients qui souhaitent optimiser leur suivi médical
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
            <div style={{
              width: '300px', height: '200px',
              background: 'rgba(255,255,255,0.1)', borderRadius: '20px',
              display: 'flex', justifyContent: 'center',
              alignItems: 'center', backdropFilter: 'blur(10px)'
            }}>
              <span className="material-icons" style={{ fontSize: '4rem', color: 'white', marginRight: '20px' }}>local_hospital</span>
              <span className="material-icons" style={{ fontSize: '3rem', color: 'white', opacity: 0.7 }}>medication</span>
            </div>
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
            {t('auth.register')}
          </h2>
          <p style={{ color: '#64748b', textAlign: 'center', marginBottom: '30px', fontSize: '0.95rem' }}>
            {t('auth.registerSubtitle')}
          </p>

          {/* Google */}
          <button onClick={handleGoogleRegister} disabled={loading}
            style={{
              width: '100%', padding: '12px', border: '2px solid #e5e7eb',
              borderRadius: '10px', background: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '20px', cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '0.95rem', fontWeight: '500', opacity: loading ? 0.6 : 1
            }}>
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
              <label style={labelStyle}>{t('auth.email')}</label>
              <input type="email" name="email" value={formData.email}
                onChange={handleInputChange} placeholder={t('auth.emailPlaceholder')}
                style={inputStyle} />
            </div>

            {/* Nom + Prénom */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
              {[
                { name: 'nom', label: t('auth.lastName') },
                { name: 'prenom', label: t('auth.firstName') }
              ].map(field => (
                <div key={field.name} style={{ flex: 1 }}>
                  <label style={labelStyle}>{field.label}</label>
                  <input type="text" name={field.name} value={formData[field.name]}
                    onChange={handleInputChange} placeholder={field.label}
                    style={inputStyle} />
                </div>
              ))}
            </div>

            {/* Mot de passe */}
            {[
              { name: 'password', label: t('auth.password'), show: showPassword, toggle: () => setShowPassword(!showPassword) },
              { name: 'confirmPassword', label: t('auth.confirmPassword'), show: showConfirmPassword, toggle: () => setShowConfirmPassword(!showConfirmPassword) }
            ].map(field => (
              <div key={field.name} style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>{field.label}</label>
                <div style={{ position: 'relative' }}>
                  <input type={field.show ? 'text' : 'password'}
                    name={field.name} value={formData[field.name]}
                    onChange={handleInputChange} placeholder={field.label}
                    style={{ ...inputStyle, paddingRight: '45px' }} />
                  <button type="button" onClick={field.toggle}
                    style={{
                      position: 'absolute', right: '12px', top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', color: '#64748b'
                    }}>
                    <span className="material-icons" style={{ fontSize: '1.2rem' }}>
                      {field.show ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>
            ))}

            {/* Faculté + Niveau */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>{t('auth.faculty')}</label>
                <select name="faculte" value={formData.faculte}
                  onChange={handleInputChange} style={inputStyle}>
                  <option value="">Sélectionner...</option>
                  {FACULTES.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>{t('auth.level')}</label>
                <select name="niveau" value={formData.niveau}
                  onChange={handleInputChange} style={inputStyle}>
                  <option value="">Sélectionner...</option>
                  {NIVEAUX.map(n => <option key={n.value} value={n.value}>{n.label}</option>)}
                </select>
              </div>
            </div>

            {/* Conditions */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '0.9rem', color: '#374151' }}>
                <input type="checkbox" checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  style={{ marginRight: '10px', transform: 'scale(1.2)', accentColor: '#3b82f6' }} />
                {t('auth.acceptTerms')}
              </label>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              style={{
                width: '100%', padding: '14px',
                background: loading ? '#94a3b8' : 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)',
                color: 'white', border: 'none', borderRadius: '10px',
                fontSize: '1rem', fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginBottom: '20px', display: 'flex',
                alignItems: 'center', justifyContent: 'center'
              }}>
              {loading && (
                <span className="material-icons" style={{ marginRight: '8px', fontSize: '1.2rem', animation: 'spin 1s linear infinite' }}>
                  refresh
                </span>
              )}
              {loading ? t('common.saving') : t('auth.registerButton')}
            </button>

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          </form>

          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#64748b', marginBottom: '10px', fontSize: '0.9rem' }}>{t('auth.haveAccount')}</p>
            <Link to="/login" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem' }}>
              {t('auth.loginButton')}
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Register;