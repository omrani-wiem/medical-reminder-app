// components/dashboard/DashboardContent.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import AccueilDashboard from '../AccueilDashboard';
import MesMedicaments from '../MesMedicaments';
import Calendrier from '../Calendrier';
import Rappels from '../Rappels';
import Historique from '../Historique';
import Statistiques from '../Statistiques';
import Parametres from '../Parametres';

const ContactsContent = () => {
  const { t } = useTranslation();
  return (
    <div className="dashboard-section">
      <h2>{t('nav.contacts')} 👨‍⚕️</h2>
      <p>{t('dashboard.subtitle')}</p>
    </div>
  );
};

const DashboardContent = ({ activeTab }) => {
  switch (activeTab) {
    case 'accueil':      return <AccueilDashboard />;
    case 'medicaments':  return <MesMedicaments />;
    case 'calendrier':   return <Calendrier />;
    case 'rappels':      return <Rappels />;
    case 'historique':   return <Historique />;
    case 'statistiques': return <Statistiques />;
    case 'contacts':     return <ContactsContent />;
    case 'parametres':   return <Parametres />;
    default:             return <AccueilDashboard />;
  }
};

export default DashboardContent;