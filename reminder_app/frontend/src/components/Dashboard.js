import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './Dashboard.css';
import {
     FiHome, 
  FiPackage,
  FiBell,
  FiClipboard,
  FiBarChart2,
  FiUsers,
  FiSettings,
  FiLogOut,
  FiUser,
  FiActivity,
  FiMenu,
  FiChevronLeft
} from 'react-icons/fi';

import AccueilDashboard from './AccueilDashboard';
import MesMedicaments from './MesMedicaments';
import Calendrier from './Calendrier';
import Rappels from './Rappels';
import Parametres from './Parametres';
import Historique from './Historique';
import Statistiques from './Statistiques';

const Dashboard = ({ onLogout, currentUser = 'Utilisateur' }) => {
  const { t } = useTranslation();
  
  // Restaurer le dernier onglet visité ou utiliser 'accueil' par défaut
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('dashboardActiveTab') || 'accueil';
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Sauvegarder l'onglet actif à chaque changement
  useEffect(() => {
    localStorage.setItem('dashboardActiveTab', activeTab);
  }, [activeTab]);

  const menuItems = [
    { id: 'accueil', icon: <FiHome />, label: t('nav.home'), path: '/dashboard' },
    { id: 'medicaments', icon: <FiPackage />, label: t('nav.medications'), path: '/medicaments' },
    { id: 'rappels', icon: <FiBell />, label: t('nav.reminders'), path: '/rappels' },
    { id: 'historique', icon: <FiClipboard />, label: t('nav.history'), path: '/historique' },
    { id: 'statistiques', icon: <FiBarChart2 />, label: t('nav.statistics'), path: '/statistiques' },
    { id: 'contacts', icon: <FiUsers />, label: t('nav.contacts'), path: '/contacts' },
    { id: 'parametres', icon: <FiSettings />, label: t('nav.settings'), path: '/parametres' }
  ];
  const handleMenuClick = (itemId) => {
    setActiveTab(itemId);
  };

  return (
    <div className="dashboard-container">
        {/*sidebar*/}
        <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
            <div className="logo">
                <span className="logo-icon"><FiActivity /></span>
                {!sidebarCollapsed && <span className="logo-text">MedReminder</span>}
            </div>
            <button
                className="sidebar-toggle"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
                {sidebarCollapsed ? <FiMenu /> : <FiChevronLeft />}
            </button>
        </div>
        <nav className="sidebar-nav">
            <ul className="nav-list">
                {menuItems.map((item) => (
                    <li key={item.id} className="nav-item">
                        <button
                            className={`nav-link ${activeTab === item.id ? 'active' : ''}`}
                            onClick={() => handleMenuClick(item.id)}
                            title={sidebarCollapsed ? item.label : ''}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            {!sidebarCollapsed && <span className="nav-label">{item.label}</span>}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
        <div className="sidebar-footer">
            <div className="user-info">
                <div className="user-avatar"><FiUser /></div>
                {!sidebarCollapsed && (
                  <div className="user-details">
                    <span className="user-name">{currentUser}</span>
                    <span className="user-role">{t('dashboard.patient')}</span>
                   </div>
                )}
            </div>
            <button 
            className="logout-btn"
            onClick={onLogout}
            title={sidebarCollapsed ? t('nav.logout') : ''}
          >
            <span className="logout-icon"><FiLogOut /></span>
            {!sidebarCollapsed && <span>{t('nav.logout')}</span>}
          </button>
        </div>
      </aside>

        {/*main content*/}
        <main className="main-content">
            <header className="main-header">
                <div className="header-left">
                    <h1 className="page-title">
                        {menuItems.find(item => item.id === activeTab)?.label || t('nav.home')}
                    </h1>
                    <div className="breadcrumb">{/*fil d'Ariane*/}
              <span>{t('nav.dashboard')}</span>
              <span className="breadcrumb-separator">›</span>{/*séparateur*/}
              <span>{menuItems.find(item => item.id === activeTab)?.label}</span>
            </div>
          </div>
          <div className="header-right">
            <div className="header-actions">
              <button className="notification-btn">
                🔔
                <span className="notification-badge">3</span>
              </button>
              <div className="current-time">
                {new Date().toLocaleTimeString('fr-FR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </div>
        </header>

        <div className="content-area">
          <DefaultDashboardContent activeTab={activeTab} />
        </div>
      </main>
    </div>
  );
};

// Contenu par défaut pour chaque section
const DefaultDashboardContent = ({ activeTab }) => {
    switch (activeTab) {
        case 'accueil':
            return <AccueilContent />;
        case 'medicaments':
            return <MedicamentsContent />;
        case 'calendrier':
            return <CalendrierContent />;
        case 'rappels':
            return <RappelsContent />;
         case 'historique':
        return <HistoriqueContent />;
      case 'statistiques':
        return <StatistiquesContent />;
      case 'contacts':
        return <ContactsContent />;
      case 'parametres':
        return <ParametresContent />;
      default:
        return <AccueilContent />;
    }
};

const AccueilContent = () => <AccueilDashboard />;
const MedicamentsContent = () => <MesMedicaments />;
const CalendrierContent = () => <Calendrier />;
const RappelsContent = () => <Rappels />;

const HistoriqueContent = () => <Historique />;

const StatistiquesContent = () => <Statistiques />;

const ContactsContent = () => {
  const { t } = useTranslation();
  return (
    <div className="dashboard-section">
      <h2>{t('nav.contacts')} 👨‍⚕️</h2>
      <p>{t('dashboard.subtitle')}</p>
    </div>
  );
};

const ParametresContent = () => <Parametres />;

export default Dashboard;