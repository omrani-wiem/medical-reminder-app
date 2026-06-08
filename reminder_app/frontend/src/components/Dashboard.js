// Dashboard.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FiActivity, FiLogOut } from 'react-icons/fi';
import { useDashboard } from '../hooks/useDashboard';
import { getMenuItems } from '../utils/dashboardMenuItems';
import DashboardContent from './dashboard/DashboardContent';
import './Dashboard.css';

const Dashboard = ({ onLogout }) => {
  const { t } = useTranslation();
  const { activeTab, sidebarCollapsed, handleMenuClick, toggleSidebar } = useDashboard();
  const menuItems = getMenuItems(t);

  return (
    <div className="dashboard-container">

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon"><FiActivity /></span>
            {!sidebarCollapsed && <span className="logo-text">MedReminder</span>}
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul className="nav-list">
            {menuItems.map(item => (
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

      {/* Main content */}
      <main className="main-content">
        <header className="main-header">
          <div className="header-left">
            <h1 className="page-title">
              {menuItems.find(item => item.id === activeTab)?.label || t('nav.home')}
            </h1>
            <div className="breadcrumb">
              <span>{t('nav.dashboard')}</span>
              <span className="breadcrumb-separator">›</span>
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
                  hour: '2-digit', minute: '2-digit'
                })}
              </div>
            </div>
          </div>
        </header>

        <div className="content-area">
          <DashboardContent activeTab={activeTab} />
        </div>
      </main>

    </div>
  );
};

export default Dashboard;