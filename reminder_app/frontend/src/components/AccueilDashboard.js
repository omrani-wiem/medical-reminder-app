// AccueilDashboard.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAccueilDashboard } from '../hooks/useAccueilDashboard';
import './AccueilDashboard.css';

const AccueilDashboard = () => {
  const { t } = useTranslation();
  const { prochainRappels, statistiques, loading, error, marquerCommePris } = useAccueilDashboard();

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="acceuil-dashboard">
      <div className="dashboard-grid">
        <div className="dashboard-card large-card">
          <div className="card-header">
            <h3>{t('dashboard.upcomingReminders')}</h3>
            <span className="card-badge">
              {prochainRappels.length} {t('dashboard.reminderscount')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccueilDashboard;