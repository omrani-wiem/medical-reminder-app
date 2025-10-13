import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Login({ onLogin }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);///contorle l'affichage du menu deroulant de langue

  //cette partie concerne l'option de connexion avec le compte google
  //On définit une fonction fléchée qui sera appelée au clic sur le bouton Google.
  const handleGoogleLogin = () => {
    setError('');
    setLoading(true);// pendant la vérification
    // Simulation de la connexion Google
    setTimeout(() => {//ne fait rien d’autre que attendre 1 seconde avant d’afficher l’alerte
      alert('⚠️ Fonctionnalité Google OAuth en développement.\n\nVeuillez créer un compte pour vous connecter.');
      setLoading(false);
    }, 1000);//1000 c'est le temps d'attente egale a 1s
  };
//c’est la fonction qui garde ton formulaire synchronisé avec ce que l’utilisateur tape.
  const handleInputChange = (e) => {
    const { name, value } = e.target; //e.target et le nom du champ et value c'est ce que l'utilisateur a tapez
    setFormData(prev => ({
      ...prev, //garde les anciennes valeurs.
      [name]: value //modifie seulement  le champ qui a changé
    }));
  };

  const handleSubmit = async (e) => {//fonction fleche quand va l'appeler quand on clic sur se connecter
    e.preventDefault();//Empêche le rechargement automatique de la page quand le formulaire est soumis.
    setError('');
    setLoading(true);

    // Validation simple
    if (!formData.email || !formData.password) {
      setError(t('auth.allFieldsRequired'));
      setLoading(false);
      return;
    }

    try {
      // Tentative de connexion avec l'API
      const response = await fetch('http://localhost:5000/auth/login', {//envoie une requête HTTP à ton serveur (localhost:5000) pour vérifier les identifiants.
        method: 'POST',//on envoie des données au serveur.
        headers: {//on précise que les données sont au format JSON.
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),// on envoie les informations du formulaire au serveur 
      });

      const data = await response.json(); // on attend la reponse avant de continuer

      if (response.ok) {
        // Connexion réussie
  return (
        localStorage.setItem('token', data.token);// on stocke le token et les infos de l'utilisateur dans le stockage local du navigateur.
        localStorage.setItem('user', JSON.stringify(data.user));
        onLogin();
        navigate('/dashboard');
      } else {
        setError(data.error || t('auth.loginError'));
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      setError(t('auth.loginError'));
    } finally {//s'execute dans tous les cas
      setLoading(false);//remet l'etat loading a false pour reactivier le bouton ou cacher le spinner
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
      <link rel="preconnect" href="https://fonts.googleapis.com" />{/*serveur Google Fonts pour accélérer le chargement des polices.*/}
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />{/*Préconnexion au serveur des fichiers de polices (fonts.gstatic.com) avec **cross-origin**.*/}
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />{/* **de meme pour les polices** de Google.*/}
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />{/* **Charge les icônes Material** de Google.*/}
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />{/* **Charge les icônes Material** de Google.*/}

      {/* Section gauche - Informations */}
      <div style={{
        flex: '1',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)',
        color: 'white',
        padding: '60px 40px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',//pour placer les éléments décoratifs par dessus
        overflow: 'hidden'
      }}>
        {/* Éléments décoratifs modernes */}
        <div style={{
          position: 'absolute',
          top: '10%',
          right: '10%',
          width: '120px',
          height: '120px',
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 197, 253, 0.05))',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '20%',
          left: '15%',
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(52, 211, 153, 0.05))',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite reverse'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '60%',
          right: '20%',
          width: '60px',
          height: '60px',
          background: 'linear-gradient(135deg, rgba(245, 101, 101, 0.1), rgba(252, 165, 165, 0.05))',
          borderRadius: '50%',
          animation: 'float 7s ease-in-out infinite'
        }}></div>

        {/* Forme géométrique moderne */}
        <div style={{
          position: 'absolute',
          top: '30%',
          left: '10%',
          width: '200px',
          height: '200px',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          animation: 'rotate 20s linear infinite'
        }}></div>

        <div style={{ position: 'relative', zIndex: 2 }}>
          {/* Logo/Icon principal */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',//centree horizontalement
            alignItems: 'center',//centree verticalement
            marginBottom: '40px'//espace en dessous
          }}>
            <div style={{
              width: '100px',
              height: '100px',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
              borderRadius: '24px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2), inset 0 0 40px rgba(255,255,255,0.1)',
              border: '2px solid rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                inset: '-2px',
                background: 'linear-gradient(135deg, #3b82f6, #1e3a8a, #10b981)',
                borderRadius: '24px',
                opacity: 0.3,
                filter: 'blur(15px)',
                zIndex: -1
              }}></div>
              <span className="material-icons" style={{
                fontSize: '3.5rem',
                color: 'white',
                filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.3))'
              }}>local_hospital</span>
            </div>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
            fontWeight: '800',
            marginBottom: '15px',
            lineHeight: '1.1',
            textAlign: 'center',
            letterSpacing: '-0.02em'
          }}>
            <span style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>{t('auth.welcome')}</span><br/>
            <span style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',//Crée un dégradé de couleurs en arrière-plan.
              WebkitBackgroundClip: 'text',//le texte prend la couleur du dégradé défini en arrière-plan. et webkit est necessaire pour la comptabitlite avec chrome  safari et a autres navigaterus basés sur webkit
              WebkitTextFillColor: 'transparent',//Rend le texte transparent pour laisser apparaître le dégradé
              backgroundClip: 'text',//Version standard pour que le dégradé s’applique au texte
              filter: 'drop-shadow(0 2px 8px rgba(59, 130, 246, 0.3))'//Ajoute une ombre portée douce autour du texte.
            }}>Medical Reminder</span>
          </h1>
          
          <h2 style={{
            fontSize: 'clamp(1.15rem, 2vw, 1.5rem)',
            fontWeight: '600',
            marginBottom: '20px',
            lineHeight: '1.4',
            textAlign: 'center',
            color: '#e2e8f0',
            letterSpacing: '-0.01em'
          }}>
            {t('auth.loginSubtitle')}
          </h2>

          <p style={{
            fontSize: '1rem',
            lineHeight: '1.7',
            marginBottom: '60px',
            opacity: 0.85,
            textAlign: 'center',
            color: '#cbd5e1',
            maxWidth: '450px',
            margin: '0 auto 60px auto',
            fontWeight: '400'
          }}>
            Connectez-vous pour accéder à votre tableau de bord et gérer vos médicaments et rappels avec précision
          </p>

          {/* Illustration médicale moderne */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '60px'
          }}>
            <div style={{
              position: 'relative',
              width: '380px',
              height: '240px',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)',
              borderRadius: '28px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backdropFilter: 'blur(20px)',
              border: '2px solid rgba(255,255,255,0.15)',
              boxShadow: '0 30px 60px rgba(0,0,0,0.15), inset 0 0 40px rgba(255,255,255,0.05)',
              overflow: 'hidden'
            }}>
              {/* Éléments décoratifs internes améliorés */}
              <div style={{
                position: 'absolute',
                top: '25px',
                left: '25px',
                width: '50px',
                height: '50px',
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.25), rgba(59, 130, 246, 0.1))',
                borderRadius: '50%',
                animation: 'pulse 3s ease-in-out infinite',
                boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)'
              }}></div>
              <div style={{
                position: 'absolute',
                bottom: '25px',
                right: '25px',
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(16, 185, 129, 0.1))',
                borderRadius: '50%',
                animation: 'pulse 4s ease-in-out infinite',
                boxShadow: '0 0 15px rgba(16, 185, 129, 0.3)'
              }}></div>
              <div style={{
                position: 'absolute',
                top: '50%',
                right: '30px',
                width: '30px',
                height: '30px',
                background: 'linear-gradient(135deg, rgba(245, 101, 101, 0.25), rgba(245, 101, 101, 0.1))',
                borderRadius: '50%',
                animation: 'pulse 3.5s ease-in-out infinite',
                boxShadow: '0 0 12px rgba(245, 101, 101, 0.3)'
              }}></div>

              {/* Icônes principales améliorées */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                zIndex: 2
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  marginBottom: '28px'
                }}>
                  <div style={{
                    width: '75px',
                    height: '75px',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    borderRadius: '20px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: '0 15px 30px rgba(59, 130, 246, 0.4)',
                    transform: 'rotate(-3deg)',
                    transition: 'transform 0.3s ease',
                    border: '2px solid rgba(255,255,255,0.2)'
                  }}>
                    <span className="material-icons" style={{
                      fontSize: '2.2rem',
                      color: 'white',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                    }}>dashboard</span>
                  </div>
                  <div style={{
                    width: '65px',
                    height: '65px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    borderRadius: '18px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: '0 12px 25px rgba(16, 185, 129, 0.4)',
                    transform: 'rotate(3deg)',
                    transition: 'transform 0.3s ease',
                    border: '2px solid rgba(255,255,255,0.2)'
                  }}>
                    <span className="material-icons" style={{
                      fontSize: '1.9rem',
                      color: 'white',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                    }}>schedule</span>
                  </div>
                </div>

                <div style={{
                  fontSize: '1rem',
                  color: 'rgba(255,255,255,0.95)',
                  fontWeight: '700',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  textShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    background: '#3b82f6',
                    borderRadius: '50%',
                    boxShadow: '0 0 10px #3b82f6'
                  }}></span>
                  Suivi Intelligent
                  <span style={{
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: '1.2rem'
                  }}>•</span>
                  Rappels Précis
                  <span style={{
                    width: '8px',
                    height: '8px',
                    background: '#10b981',
                    borderRadius: '50%',
                    boxShadow: '0 0 10px #10b981'
                  }}></span>
                </div>
              </div>
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
            {t('auth.login')}
          </h2>

          <p style={{
            color: '#64748b',
            textAlign: 'center',
            marginBottom: '30px',
            fontSize: '0.95rem'
          }}>
            {t('auth.loginSubtitle')}
          </p>

          {/* Compte de démonstration */}
          {/* Option Google */}
          <button 
            onClick={handleGoogleLogin}
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              border: 'none',
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
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: 'none',
                  fontSize: '0.95rem',
                  transition: 'border-color 0.3s ease',
                  boxSizing: 'border-box',
                  opacity: loading ? 0.7 : 1
                }}
                onFocus={(e) => {
                  if (!loading) {
                    e.target.style.borderColor = '#3b82f6';
                  }
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                }}
              />
            </div>

            {/* Mot de passe */}
            <div style={{ marginBottom: '25px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{
                  fontWeight: '500',
                  color: '#374151',
                  fontSize: '0.9rem'
                }}>
                  {t('auth.password')}
                </label>
                <Link 
                  to="/forgot-password"
                  style={{
                    color: '#3b82f6',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseOver={(e) => e.target.style.color = '#1e3a8a'}
                  onMouseOut={(e) => e.target.style.color = '#3b82f6'}
                >
                  {t('auth.forgotPassword')}
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={t('auth.passwordPlaceholder')}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    paddingRight: '45px',
                    border: 'none',
                    fontSize: '0.95rem',
                    transition: 'border-color 0.3s ease',
                    boxSizing: 'border-box',
                    opacity: loading ? 0.7 : 1
                  }}
                  onFocus={(e) => {
                    if (!loading) {
                      e.target.style.borderColor = '#3b82f6';
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  style={{
                    position: 'absolute',
                    right: '12px',
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

            {/* Bouton de connexion */}
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
              {loading ? t('common.loading') : t('auth.loginButton')}
            </button>

            <style>
              {`
                @keyframes spin {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }
                @keyframes float {
                  0%, 100% { transform: translateY(0px); }
                  50% { transform: translateY(-20px); }
                }
                @keyframes rotate {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }
                @keyframes pulse {
                  0%, 100% { opacity: 0.2; transform: scale(1); }
                  50% { opacity: 0.5; transform: scale(1.1); }
                }
              `}
            </style>
          </form>

          {/* Liens vers inscription */}
          <div style={{ textAlign: 'center' }}>
            <p style={{ 
              color: '#64748b', 
              marginBottom: '10px',
              fontSize: '0.9rem'
            }}>
              {t('auth.noAccount')}
            </p>
            <Link 
              to="/register"
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
              {t('auth.createAccount')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;