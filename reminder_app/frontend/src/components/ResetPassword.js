
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useResetPassword } from '../hooks/useResetPassword';

function ResetPassword() {
  const { t } = useTranslation();
  const {
    formData, loading, success, error,
    showPassword, setShowPassword,
    showConfirmPassword, setShowConfirmPassword,
    handleChange, handleSubmit
  } = useResetPassword();

  const inputBase = {
    width: '100%', padding: '14px 50px',
    border: '2px solid #e5e7eb', borderRadius: '12px',
    fontSize: '0.95rem', boxSizing: 'border-box',
    opacity: loading ? 0.7 : 1, transition: 'all 0.3s ease'
  };

  const iconLeft = {
    position: 'absolute', left: '15px', top: '50%',
    transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '1.3rem'
  };

  const eyeBtn = {
    position: 'absolute', right: '15px', top: '50%',
    transform: 'translateY(-50%)', background: 'none', border: 'none',
    cursor: loading ? 'not-allowed' : 'pointer',
    color: '#64748b', opacity: loading ? 0.5 : 1
  };

  const onFocus = (e) => {
    if (!loading) {
      e.target.style.borderColor = '#10b981';
      e.target.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.1)';
    }
  };

  const onBlur = (e) => {
    e.target.style.borderColor = '#e5e7eb';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div style={{
      fontFamily: "'Poppins', sans-serif", minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', padding: '20px'
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />

      <div style={{
        backgroundColor: 'white', borderRadius: '24px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.1)',
        maxWidth: '550px', width: '100%',
        padding: '50px 40px', position: 'relative', overflow: 'hidden'
      }}>

        {/* Décoratif */}
        <div style={{
          position: 'absolute', top: '-50px', right: '-50px',
          width: '150px', height: '150px',
          background: 'linear-gradient(135deg, #10b981, #34d399)',
          borderRadius: '50%', opacity: 0.1
        }} />

        {/* Icône */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
          <div style={{
            width: '80px', height: '80px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            borderRadius: '20px', display: 'flex',
            justifyContent: 'center', alignItems: 'center',
            boxShadow: '0 15px 30px rgba(16,185,129,0.3)'
          }}>
            <span className="material-icons" style={{ fontSize: '2.5rem', color: 'white' }}>vpn_key</span>
          </div>
        </div>

        {/* Titre */}
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1e293b', textAlign: 'center', marginBottom: '10px' }}>
          {t('resetPassword.title')}
        </h1>
        <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.95rem', marginBottom: '35px', lineHeight: '1.6' }}>
          {t('resetPassword.subtitle')}
        </p>

        {/* Succès */}
        {success ? (
          <div style={{
            backgroundColor: '#dcfce7', border: '2px solid #86efac',
            borderRadius: '12px', padding: '20px',
            textAlign: 'center', marginBottom: '25px'
          }}>
            <span className="material-icons" style={{ fontSize: '3rem', color: '#16a34a', marginBottom: '15px', display: 'block' }}>
              check_circle
            </span>
            <h3 style={{ color: '#15803d', fontSize: '1.1rem', fontWeight: '600', marginBottom: '10px' }}>
              {t('resetPassword.successTitle')}
            </h3>
            <p style={{ color: '#166534', fontSize: '0.9rem', lineHeight: '1.5' }}>
              {t('resetPassword.successMessage')}
            </p>
            <p style={{ color: '#166534', fontSize: '0.85rem', marginTop: '10px', fontStyle: 'italic' }}>
              {t('resetPassword.redirecting')}
            </p>
          </div>

        ) : (
          <form onSubmit={handleSubmit}>

            {/* Erreur */}
            {error && (
              <div style={{
                backgroundColor: '#fef2f2', border: '2px solid #fca5a5',
                borderRadius: '12px', color: '#dc2626',
                padding: '12px 16px', marginBottom: '20px',
                fontSize: '0.9rem', display: 'flex', alignItems: 'center'
              }}>
                <span className="material-icons" style={{ marginRight: '8px', fontSize: '1.2rem' }}>error</span>
                {error}
              </div>
            )}

            {/* Email */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: '#374151', fontSize: '0.95rem' }}>
                {t('resetPassword.emailLabel')}
              </label>
              <div style={{ position: 'relative' }}>
                <span className="material-icons" style={iconLeft}>email</span>
                <input type="email" name="email" value={formData.email}
                  onChange={handleChange} placeholder={t('resetPassword.emailPlaceholder')}
                  disabled={loading} style={inputBase}
                  onFocus={onFocus} onBlur={onBlur} />
              </div>
            </div>

            {/* Code */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: '#374151', fontSize: '0.95rem' }}>
                {t('resetPassword.codeLabel')}
              </label>
              <div style={{ position: 'relative' }}>
                <span className="material-icons" style={iconLeft}>pin</span>
                <input type="text" name="code" value={formData.code}
                  onChange={handleChange} placeholder={t('resetPassword.codePlaceholder')}
                  maxLength="6" disabled={loading}
                  style={{ ...inputBase, fontSize: '1.2rem', letterSpacing: '0.3em', textAlign: 'center', fontWeight: '600' }}
                  onFocus={onFocus} onBlur={onBlur} />
              </div>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '5px', marginLeft: '5px' }}>
                {t('resetPassword.checkEmail')}
              </p>
            </div>

            {/* Nouveau mot de passe + Confirmation */}
            {[
              { name: 'new_password', label: t('resetPassword.newPasswordLabel'), icon: 'lock', show: showPassword, toggle: () => setShowPassword(!showPassword) },
              { name: 'confirm_password', label: t('resetPassword.confirmPasswordLabel'), icon: 'lock_outline', show: showConfirmPassword, toggle: () => setShowConfirmPassword(!showConfirmPassword) }
            ].map(field => (
              <div key={field.name} style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: '#374151', fontSize: '0.95rem' }}>
                  {field.label}
                </label>
                <div style={{ position: 'relative' }}>
                  <span className="material-icons" style={iconLeft}>{field.icon}</span>
                  <input type={field.show ? 'text' : 'password'}
                    name={field.name} value={formData[field.name]}
                    onChange={handleChange} disabled={loading}
                    placeholder={t('resetPassword.passwordPlaceholder')}
                    style={inputBase} onFocus={onFocus} onBlur={onBlur} />
                  <button type="button" onClick={field.toggle} disabled={loading} style={eyeBtn}>
                    <span className="material-icons" style={{ fontSize: '1.2rem' }}>
                      {field.show ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>
            ))}

            {/* Submit */}
            <button type="submit" disabled={loading}
              style={{
                width: '100%', padding: '14px',
                background: loading ? '#94a3b8' : 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)',
                color: 'white', border: 'none', borderRadius: '12px',
                fontSize: '1rem', fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginBottom: '20px', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                boxShadow: loading ? 'none' : '0 10px 25px rgba(16,185,129,0.3)'
              }}>
              {loading && (
                <span className="material-icons" style={{ marginRight: '8px', fontSize: '1.2rem', animation: 'spin 1s linear infinite' }}>
                  refresh
                </span>
              )}
              {loading ? t('resetPassword.resetting') : t('resetPassword.resetButton')}
            </button>

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          </form>
        )}

        {/* Liens */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Link to="/forgot-password" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.85rem' }}>
            {t('resetPassword.resendCode')}
          </Link>
          <Link to="/login" style={{
            color: '#3b82f6', textDecoration: 'none', fontWeight: '500',
            fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <span className="material-icons" style={{ fontSize: '1rem', marginRight: '5px' }}>arrow_back</span>
            {t('resetPassword.backToLogin')}
          </Link>
        </div>

      </div>
    </div>
  );
}

export default ResetPassword;