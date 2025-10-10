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
                leetter-spacing: normal;
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
            <divid="hero-text"
            data-animate
            style={{
                ...fadeInUp,
                ...Home(isVisible['hero-text'] ? visible : {})
            }}
            >
              <h1 style={{
                fontSize: 'clamp(2.5rem, 4vw, 3.25rem)',
                marginBottom: '30px',
                fontWeight: '700',
                lineHeight: '1.1'
              }}>


       


    );
};