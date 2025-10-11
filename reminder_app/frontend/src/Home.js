import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import medicineAnimation from './Medicine.json';
import { useTranslation } from 'react-i18next';

const Home = () => {
    const {t, i18n } = useTranslation();
    const [isVisible, setIsVisible] = useState({});

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
                    }
                });
            },
            { threshold: 0.1 }
        );
        const elements = document.querySelectorAll('.fade-in-section');
        elements.forEach(e1 => observer.observe(e1));

        return () => observer.disconnect();
    }, []);

    // styles pour les animations
    const fadeInUp = {
        opacity: 0,
        transform: 'translateY(30px)',
        transition: 'all 0.8s ease-out'
    };

    const visible = {
        opacity: 1,
        transform: 'translateY(0)',
    };

    const pulseAnimation = {
        animation: 'pulse 2s infinite',
    };

    const floatAnimation = {
        animation: 'float 3s ease-in-out infinite',
    };

    // Animations pour les sections de fonctionnalités
    const slideInLeft = {
        opacity: 0,
        transform: 'translateX(-50px)',
        transition: 'all 0.8s ease-out'
    };

    const slideInRight = {
        opacity: 0,
        transform: 'translateX(50px)',
        transition: 'all 0.8s ease-out'
    };

    const slideInUp = {
        opacity: 0,
        transform: 'translateY(50px)',
        transition: 'all 0.8s ease-out'
    };

    const visibleSlide = {
        opacity: 1,
        transform: 'translateX(0, 0)'
    };
    
    return (
        <div style={{ fontFamily: "'Poppins', 'Inter', 'Roboto', sans-serif" }}>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
            <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <style>
            {`
              .material-icons {
                font-family: 'Material Icons';
                font-weight: normal;
                font-style: normal;
                font-size: inherit;
                line-height: 1;
                letter-spacing: normal;
                text-transform: none;
                display: inline-block;
                white-space: nowrap;
                direction: ltr;
                -webkit-font-feature-settings: 'liga';
                -webkit-font-smoothing: antialiased;
              }

              @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
              }
            
              @keyframes float {
                     0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
            }
          
               @keyframes rotate {
                   from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
               @keyframes bounce {
                    0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
                    40%, 43% { transform: translate3d(0,-30px,0); }
                    70% { transform: translate3d(0,-15px,0); }
                    90% { transform: translate3d(0,-4px,0); }
                }
            `}
        </style>
        <nav style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            backgroundColor: 'rgba(30, 58, 138, 0.95)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 1000,
            borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
            <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 24px',
          height: '70px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
           <Link to="/" style={{
            fontSize: '1.7rem',
            fontWeight: '700',
            textDecoration: 'none',
            color: 'inherit',
            display: 'flex',
            alignItems: 'center'
            }}>
                <span className="material-icons" style={{
                    color: '#60a5fa',
                    marginRight: '8px',
                    fontSize: '2rem',
                    ...pulseAnimation
                }}>local_hospital</span>
                 <span style={{ color: '#60a5fa' }}>Medical</span>
                 <span style={{ color: 'white', marginLeft: '5px' }}>Reminder</span>
              </Link>

              <ul style={{
                display: 'flex',
                listStyle: 'none',
                margin: 0,
                padding: 0,
                gap: '32px',
                alignItems: 'center'
              }}>
                <li>
                    <a href="#hero" style={{
                        color: 'white',
                        textDecoration: 'none' ,
                        fontSize: '1rem',
                        transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#60a5fa' }
                    onMouseLeave={(e) => e.target.style.color = 'white' }>
                         {t('home.nav.home')}
                    </a>
                </li>
                <li>
                    <a href="#advantages" style={{
                        color: 'white',
                        textDecoration: 'none',
                        fontSize: '1rem',
                        transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#60a5fa' }
                    onMouseLeave={(e) => e.target.style.color = 'white' }>
                         {t('home.nav.benefits')}
                    </a>
                </li>
                <li>
                    <a href="#fonctionnalites" style={{
                        color: 'white',
                        textDecoration: 'none',
                        fontSize: '1rem',
                        transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#60a5fa' }
                    onMouseLeave={(e) => e.target.style.color = 'white' }>
                         {t('home.nav.features')}
                    </a>
                </li>

                 {/* Language Selector Dropdown */}
                <li style={{ position: 'relative'}}>
                    <button
                       onClick={() => setIsVisible(prev => ({ ...prev, langDropdown: !prev.langDropdown }))}
                       style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        color: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        fontWeight: '500',
                        transition: 'all 0.3s ease'
                       }}
                       onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                       onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                    >
                        <span style={{ fontSize: '1.2rem' }}>
                           {i18n.language === 'fr' ? '🇫🇷' : i18n.language === 'en' ? '🇬🇧' : '🇸🇦'}
                        </span>
                        <span>{i18n.language === 'fr' ? 'FR' : i18n.language === 'en' ? 'EN' : 'AR'}</span>
                        <span className="material-icons" style={{ fontSize: '18px' }}>arrow_drop_down</span>
                    </button>

                     {/* Dropdown Menu */}
                    {isVisible.langDropdown && (
                        <div style={{
                            position: 'absolute',
                            top: '110%',
                            right: 0,
                            marginTop: '8px',
                            background: 'white',
                            borderRadius: '12px',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                            overflow: 'hidden',
                            zIndex: 1000,
                            minWidth: '150px'
    
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
                                        setIsVisible(prev => ({ ...prev, langDropdown: false }));
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
                                        if (i18n.language !==lang.code) {
                                            e.currentTarget.style.background = 'white';
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
                                   {i18n.language === lang.code  &&(
                                    <span className="material-icons" style={{ marginLeft: 'auto', fontSize: '18px' }}>check</span>
                                   )}
                                </button>
                            ))} 
                        </div>
                    )}
                </li>
             </ul>
            {/*buttons */}
             <div style={{ display: 'flex', gap: '16px' }}>
                <Link
                    to="/register"
                    style={{
                        padding: '10px 20px',
                        border: '2px solid #60a5fa',
                        borderRadius: '8px',
                        color: '#60a5fa',
                        textDecoration: 'none',
                        fontSize: '0.95rem',
                        fontWeight: '500',
                        transition: 'all 0.3s ease',
                        backgroundColor: 'transparent'

                    }}
                >
                    Register
                </Link>
                <Link
                    to="/login"
                    style={{
                        padding: '10px 20px',
                        border: '2px solid #60a5fa',
                        borderRadius: '8px',
                        color: '#60a5fa',
                        textDecoration: 'none',
                        fontSize: '0.95rem',
                        fontWeight: '500',
                        transition: 'all 0.3s ease',
                        backgroundColor: 'transparent'
                    }}
                    onMouseOver={(e) => {
                e.target.style.backgroundColor = '#60a5fa';
                e.target.style.color = '#1e3a8a';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#60a5fa';
              }}
            >
              {t('landing.nav.signUp')}
              </Link>
                <Link 
                to="/login"
              style={{
                padding: '10px 20px',
                backgroundColor: '#3b82f6',
                borderRadius: '8px',
                color: 'white',
                textDecoration: 'none',
                fontSize: '0.95rem',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                border: '2px solid #3b82f6'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#2563eb';
                e.target.style.borderColor = '#2563eb';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#3b82f6';
                e.target.style.borderColor = '#3b82f6';
              }}
            >
            </Link>
          </div>
        </div>
      </nav>
      {/* section hero */}
      <section id="hero" style={{
         minHeight: '80vh',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)',
        display: 'flex',
        alignItems: 'center',
        color: 'white',
        paddingTop: '70px'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '60px',
          alignItems: 'center'
        }}>
            {/* Texte Hero */}
            <div
            id="hero-text"
            data-animate
            style={{
                ...fadeInUp,
                ...(isVisible['hero-text'] ? visible : {})
            }}
            >
              <h1 style={{
                fontSize: 'clamp(2.5rem, 4vw, 3.25rem)',
                marginBottom: '30px',
                fontWeight: '700',
                lineHeight: '1.1'
              }}
              dangerouslySetInnerHTML={{
                __html: t('landing.hero.title').replace('<span>', '<span style=\"color:#fbbf24\">')
              }}
              />
              <p style={{
                fontSize: '1.2rem',
                lineHeight: '1.6',
                marginBottom: '40px',
                opacity: 0.9
              }}>
                {t('landing.hero.subtitle')}
              </p>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <Link 
                    to="/register" 
                    style={{
                        display: 'inline-block',
                  padding: '18px 40px',
                  fontSize: '1.2rem',
                  backgroundColor: '#fbbf24',
                  color: '#1e3a8a',
                  textDecoration: 'none',
                  borderRadius: '12px',
                  fontWeight: '600',
                  boxShadow: '0 10px 30px rgba(251, 191, 36, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 15px 40px rgba(251, 191, 36, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 10px 30px rgba(251, 191, 36, 0.3)';
                }}  
                >
                    <span className="material-icons" style={{ marginRight: '8px', verticalAlign: 'middle' }}>rocket_launch</span>
                    {t('landing.hero.startFree')}
                    </Link>
                    <Link
                    to="#advantages"
                    style={{
                        display: 'inline-block',
                  padding: '18px 40px',
                  fontSize: '1.2rem',
                  backgroundColor: 'transparent',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '12px',
                  fontWeight: '600',
                  border: '2px solid white',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.color = '#1e3a8a';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = 'white';
                }}
              >
                <span className="material-icons" style={{ marginRight: '8px', verticalAlign: 'middle' }}>menu_book</span>
                {t('landing.hero.learnMore')}
              </Link>
            </div>
          </div>
          {/* Image Hero avec animation Lottie */}
          <div 
            id="hero-image"
            data-animate
            style={{
                ...floatAnimation,
                ...(isVisible['hero-image'] ? visible : {}),
                display: 'flex',
                justifyContent: 'center',
             alignItems: 'center'
            }}
            >
                <div style={{
              width: '500px',
              height: '500px',
              borderRadius: '50%',
              background: 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(251,191,36,0.2))',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
              ...floatAnimation
            }}>
                {/* Animation Lottie */}
              <div style={{
                width: '400px',
                height: '400px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                 <Lottie
                  animationData={medicineAnimation}
                  loop={true}
                  autoplay={true}
                  style={{
                    width: '100%',
                    height: '100%'
                  }}
                />
              </div>
              {/* Cercles animés en arrière-plan */}
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                border: '2px solid rgba(251,191,36,0.3)',
                animation: 'rotate 20s linear infinite',
                top: 0,
                left: 0
                  }}></div>
              <div style={{
                position: 'absolute',
                width: '80%',
                height: '80%',
                borderRadius: '50%',
                border: '2px solid rgba(255,255,255,0.2)',
                animation: 'rotate 15s linear infinite reverse',
                top: '10%',
                left: '10%'
              }}></div>
            </div>
          </div>
        </div>
  </section>
 {/* Section Avantages */}
 <section id="avantages" style={{
    padding: '100px 0',
    backgroundColor: 'white'
 }}>
    <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 24px',
        textAlign: 'center'
    }}>
      <div
      id="avantage-title"
      data-animate
      style={{
        ...fadeInUp,
        ...(isVisible['avantage-title'] ? visible : {}),
        marginBottom: '80px'
      }}
    >
        <h2 style={{
            fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
            fontWeight: '700',
            color: '#64748b',
            marginBottom: '20px'
        }}>
            {t('landing.benefits.title')}
        </h2>
        <p style={{
            fontSize: '1.3rem',
            color:'#64748b',
            maxWidth: '800px',
            margin: '0 auto'
        }}>
            {t('landing.benefits.subtitle')}
        </p>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '40px'
      }}>
        {[
          {
            icon: 'track_changes'
          },
          {
                icon: 'analytics'
              },
              {
                icon: 'security'
              },
              {
                icon: 'lightbulb'
              },
              {
                icon: 'devices'
              },
              {
                icon: 'money_off'
              }
              ].map((avantage, index) => (
              <div
                key={index}
                id={`avantage-${index}`}
                data-animate
                style={{
                    ...fadeInUp,
                    ...(isVisible[`avantage-${index}`] ? visible : {}),
                    backgroundColor: 'white',
                    padding: '40px 30px',
                    borderRadius: '20px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-10px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                }}
                 onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                }}
              >
                <div style={{
                  marginBottom: '20px',
                  ...pulseAnimation
                }}>
                  <span className="material-icons" style={{
                    fontSize: '4rem',
                    color: '#3b82f6'
                  }}>{avantage.icon}</span>
                </div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#1e3a8a',
                  marginBottom: '15px'
                }}>
                  {t(`landing.benefits.items.${index}.title`)}
                </h3>
                <p style={{
                  color: '#64748b',
                  lineHeight: '1.6',
                  fontSize: '1.1rem'
                }}>
                  {t(`landing.benefits.items.${index}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Section Fonctionnalités */}
      <section id="fonctionnalites" style={{
        padding: '100px 0',
        backgroundColor: 'white'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 24px'
        }}>
          <div
            id="fonctionnalites-title"
            data-animate
            style={{
              ...fadeInUp,
              ...(isVisible['fonctionnalites-title'] ? visible : {}),
              textAlign: 'center',
              marginBottom: '80px'
            }}
          >
            <h2 style={{
              fontSize: 'clamp(1.8rem, 2.8vw, 3rem)',
              fontWeight: '700',
              color: '#1e3a8a',
              marginBottom: '20px'
            }}>
              {t('landing.features.title')}
            </h2>
            <p style={{
              fontSize: '1.3rem',
              color: '#64748b',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              {t('landing.features.subtitle')}
            </p>
          </div>
          {/* Fonctionnalité 1 - Image à gauche, texte à droite */}
           <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '60px',
              marginBottom: '100px',
              flexWrap: 'wrap'
            }}
          >
            <div 
              id="feature-1-image"
              data-animate//indique que cet élément doit être observé pour les animations d’apparition.
              style={{ 
                flex: '1', 
                minWidth: '300px',
                ...slideInLeft,
                ...(isVisible['feature-1-image'] ? visibleSlide : {})
              }}
            >
               <div style={{
                width: '100%',
                height: '400px',
                background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
                borderRadius: '20px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden',
                ...floatAnimation
              }}>
                <div style={{
                  ...pulseAnimation
                }}>
                  <span className="material-icons" style={{
                    fontSize: '8rem',
                    color: 'white'
                  }}>schedule</span>
                </div>
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  width: '60px',
                  height: '60px',
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '50%',
                  animation: 'bounce 2s infinite'
                }}></div>
              </div>
            </div>
            <div 
             id="feature-1-text"
              data-animate
              style={{ 
                flex: '1', 
                minWidth: '300px',
                ...slideInRight,
                ...(isVisible['feature-1-text'] ? visibleSlide : {})
              }}
            >
              <h3 style={{
                fontSize: '2.3rem',
                fontWeight: '700',
                color: '#1e3a8a',
                marginBottom: '20px'
              }}>
                {t('landing.features.smartReminders.title')}
              </h3>
              <p style={{
                fontSize: '1.2rem',
                color: '#64748b',
                lineHeight: '1.7',
                marginBottom: '30px'
              }}>
                {t('landing.features.smartReminders.description')}
              </p>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}>
                {[
                  { icon: 'email'},
                  {icon: 'schedule' },
                  { icon: 'settings'},
                  { icon: 'repeat'}
                  ].map((item, i) => (
                  <li key={i} style={{
                    fontSize: '1.1rem',
                    color: '#64748b',
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <span className="material-icons" style={{ marginRight: '10px', color: '#3b82f6' }}>{item.icon}</span>
                    {t(`landing.features.smartReminders.points.${i}`)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
           {/* Fonctionnalité 2 - Image à droite, texte à gauche */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '60px',
              marginBottom: '100px',
              flexWrap: 'wrap',
              flexDirection: 'row-reverse'
              }}
          >
            <div 
              id="feature-2-image"
              data-animate
              style={{ 
                flex: '1', 
                minWidth: '300px',
                ...slideInRight,
                ...(isVisible['feature-2-image'] ? visibleSlide : {})
              }}
            >
              <div style={{
                width: '100%',
                height: '400px',
                background: 'linear-gradient(135deg, #10b981, #34d399)',
                borderRadius: '20px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden',
                ...floatAnimation
              }}>
                <div style={{
                  ...pulseAnimation
                }}>
                  <span className="material-icons" style={{
                    fontSize: '8rem',
                    color: 'white'
                  }}>analytics</span>
                </div>
                <div style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '20px',
                  width: '40px',
                  height: '40px',
                  background: 'rgba(255,255,255,0.3)',
                  borderRadius: '50%',
                  animation: 'bounce 2s infinite 0.5s'
                }}></div>
              </div>
            </div>
            <div 
              id="feature-2-text"
              data-animate
              style={{ 
                flex: '1', 
                minWidth: '300px',
                ...slideInLeft,
                ...(isVisible['feature-2-text'] ? visibleSlide : {})
              }}
            >
              <h3 style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                color: '#1e3a8a',
                marginBottom: '20px'
              }}>
                {t('landing.features.personalTracking.title')}
              </h3>
              <p style={{
                fontSize: '1.2rem',
                color: '#64748b',
                lineHeight: '1.7',
                marginBottom: '30px'
              }}>
                {t('landing.features.personalTracking.description')}
              </p>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}>
                {[
                  { icon: 'trending_up' },
                  { icon: 'event' },
                  { icon: 'track_changes' },
                  { icon: 'assignment' }
                ].map((item, i) => (
                  <li key={i} style={{
                    fontSize: '1.1rem',
                    color: '#64748b',
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <span className="material-icons" style={{ marginRight: '10px', color: '#10b981' }}>{item.icon}</span>
                    {t(`landing.features.personalTracking.points.${i}`)}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Fonctionnalité 3 - Image à gauche, texte à droite */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '60px',
              marginBottom: '100px',
              flexWrap: 'wrap'
            }}
          >
            <div 
              id="feature-3-image"
              data-animate
              style={{ 
                flex: '1', 
                minWidth: '300px',
                ...slideInLeft,
                ...(isVisible['feature-3-image'] ? visibleSlide : {})
              }}
            >
              <div style={{
                width: '100%',
                height: '400px',
                background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                borderRadius: '20px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden',
                ...floatAnimation
              }}>
                <div style={{
                  ...pulseAnimation
                }}>
                  <span className="material-icons" style={{
                    fontSize: '8rem',
                    color: 'white'
                  }}>security</span>
                </div>
                <div style={{
                  position: 'absolute',
                  top: '30px',
                  left: '30px',
                  width: '50px',
                  height: '50px',
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '50%',
                  animation: 'bounce 2s infinite 1s'
                }}></div>
              </div>
            </div>
            <div 
              id="feature-3-text"
              data-animate
              style={{ 
                flex: '1', 
                minWidth: '300px',
                ...slideInRight,
                ...(isVisible['feature-3-text'] ? visibleSlide : {})
              }}
            >
              <h3 style={{
                fontSize: '2.3rem',
                fontWeight: '700',
                color: '#1e3a8a',
                marginBottom: '20px'
              }}>
                {t('landing.features.maxSecurity.title')}
              </h3>
              <p style={{
                fontSize: '1.2rem',
                color: '#64748b',
                lineHeight: '1.7',
                marginBottom: '30px'
              }}>
                {t('landing.features.maxSecurity.description')}
              </p>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}>
                {[
                  { icon: 'shield' },
                  { icon: 'local_hospital' },
                  { icon: 'lock' },
                  { icon: 'cloud_done' }
                ].map((item, i) => (
                  <li key={i} style={{
                    fontSize: '1.1rem',
                    color: '#64748b',
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <span className="material-icons" style={{ marginRight: '10px', color: '#f59e0b' }}>{item.icon}</span>
                    {t(`landing.features.maxSecurity.points.${i}`)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      {/* Section CTA */}
      <section style={{ padding: '100px 0',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)',
        color: 'white',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          padding: '0 24px'
        }}>
          <div
            id="cta-content"
            data-animate
            style={{
              ...fadeInUp,
              ...(isVisible['cta-content'] ? visible : {})
            }}
          >
            <h2 style={{
              fontSize: 'clamp(2rem, 2.5vw, 3rem)',
              fontWeight: '700',
              marginBottom: '30px'
            }}>
              {t('landing.cta.title')}
            </h2>
            <p style={{
              fontSize: '1.3rem',
              marginBottom: '50px',
              opacity: 0.9,
              lineHeight: '1.6'
            }}>
              {t('landing.cta.subtitle')}
            </p>
            <div style={{
              display: 'flex',
              gap: '20px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <Link
                to="/register"
                style={{
                  display: 'inline-block',
                  padding: '20px 50px',
                  fontSize: '1.3rem',
                  backgroundColor: '#fbbf24',
                  color: '#1e3a8a',
                  textDecoration: 'none',
                  borderRadius: '15px',
                  fontWeight: '700',
                  boxShadow: '0 15px 40px rgba(251, 191, 36, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-5px)';
                  e.target.style.boxShadow = '0 20px 50px rgba(251, 191, 36, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 15px 40px rgba(251, 191, 36, 0.3)';
                }}
              >
                <span className="material-icons" style={{ marginRight: '8px', verticalAlign: 'middle' }}>rocket_launch</span>
                Commencer maintenant
              </Link>
              <div style={{
                fontSize: '0.9rem',
                opacity: 0.7,
                marginTop: '10px',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '35px'
              }}>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: '1rem', marginRight: '4px' }}></span>
                  Sans engagement
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer style={{
        backgroundColor: '#1e293b',
        color: 'white',
        padding: '80px 0 40px'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 24px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '40px',
            marginBottom: '60px'
          }}>
            {/* logo et description */}
            <div
            id="footer-logo"
            data-animate
            style={{
              ...slideInUp,
              ...(isVisible['footer-logo'] ? visible : {}),
              transitionDelay: '0.2s'
            }}
            >
            <div style={{
                fontSize: '1.8rem',
                fontWeight: '700',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center'
              }}>
                <span className="material-icons" style={{ color: '#60a5fa', marginRight: '8px', fontSize: '1.5rem' }}>local_hospital</span>
                <span style={{ color: '#60a5fa' }}>Medical</span>
                <span style={{ marginLeft: '5px' }}>Reminder</span>
              </div>
              <p
                id="footer-description"
                data-animate
                style={{
                  opacity: 0.8,
                  lineHeight: '1.6',
                  marginBottom: '30px',
                  ...slideInUp,
                  ...(isVisible['footer-description'] ? visibleSlide : {}),
                  transitionDelay: '0.4s'
                }}
              >
                {t('landing.footer.description')}
              </p>
              <div
                id="footer-social"
                data-animate
                style={{
                  display: 'flex',
                  gap: '15px',
                  ...slideInUp,
                  ...(isVisible['footer-social'] ? visibleSlide : {}),
                  transitionDelay: '0.6s'
                }}
              >
                {['email', 'smartphone', 'language'].map((icon,i) => (
                  <div key={i} style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#334155',
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#60a5fa';
                    e.target.style.transform = 'scale(1.1)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = '#334155';
                    e.target.style.transform = 'scale(1)';
                  }}>
                    <span className="material-icons" style={{ color: 'white' }}>{icon}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Liens */}
            <div
              id="footer-links"
              style={{
                ...slideInUp,
                ...(isVisible['footer-links'] ? visibleSlide : {}),
                transitionDelay: '0.8s'
              }}
            >
              <h4 style={{
                fontSize: '1.2rem',
                fontWeight: '600',
                marginBottom: '20px',
                color: '#60a5fa'
              }}>{t('landing.footer.quickLinks')}</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {[
                  { href: '#hero' },
                  { href: '#avantages' },
                  { href: '#fonctionnalites' },
                  { href: '/register' }
                ].map((link, i) => (
                  <li key={i} style={{ marginBottom: '10px' }}>
                    <a href={link.href} style={{
                      color: 'white',
                      textDecoration: 'none',
                      opacity: 0.8,
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.opacity = 1;
                      e.target.style.color = '#60a5fa';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.opacity = 0.8;
                      e.target.style.color = 'white';
                    }}>
                      {t(`landing.footer.links.${i}`)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div
              id="footer-support"
              data-animate
              style={{
                ...slideInUp,
                ...(isVisible['footer-support'] ? visibleSlide : {}),
                transitionDelay: '1.0s'
              }}
            >
              <h4 style={{
                fontSize: '1.2rem',
                fontWeight: '600',
                marginBottom: '20px',
                color: '#60a5fa'
              }}>{t('landing.footer.support')}</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {[0, 1, 2, 3].map((i) => (
                  <li key={i} style={{ marginBottom: '10px' }}>
                    <a href="#" style={{
                      color: 'white',
                      textDecoration: 'none',
                      opacity: 0.8,
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.opacity = 1;
                      e.target.style.color = '#60a5fa';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.opacity = 0.8;
                      e.target.style.color = 'white';
                    }}>
                      {t(`landing.footer.supportLinks.${i}`)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div
              id="footer-newsletter"
              data-animate
              style={{
                ...slideInUp,
                ...(isVisible['footer-newsletter'] ? visibleSlide : {}),
                transitionDelay: '1.2s'
              }}
            >
              <h4 style={{
                fontSize: '1.2rem',
                fontWeight: '600',
                marginBottom: '20px',
                color: '#60a5fa'
              }}>{t('landing.footer.newsletter')}</h4>
              <p style={{
                opacity: 0.8,
                marginBottom: '20px',
                fontSize: '0.9rem'
              }}>
                {t('landing.footer.newsletterText')}
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="email"
                  placeholder={t('landing.footer.emailPlaceholder')}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#334155',
                    color: 'white',
                    fontSize: '0.9rem'
                  }}
                />
                <button style={{
                  padding: '12px 20px',
                  backgroundColor: '#60a5fa',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#3b82f6'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#60a5fa'}>
                  <span className="material-icons">send</span>
                </button>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div
            id="footer-copyright"
            data-animate
            style={{
              borderTop: '1px solid #334155',
              paddingTop: '30px',
              textAlign: 'center',
              opacity: 0.7,
              ...slideInUp,
              ...(isVisible['footer-copyright'] ? visibleSlide : {}),
              transitionDelay: '1.4s'
            }}
          >
            <p style={{ margin: 0, fontSize: '0.9rem' }}>
              {t('landing.footer.copyright')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;