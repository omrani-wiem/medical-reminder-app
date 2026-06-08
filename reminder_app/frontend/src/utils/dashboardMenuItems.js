
import {
  FiHome, FiPackage, FiBell, FiClipboard,
  FiBarChart2, FiUsers, FiSettings
} from 'react-icons/fi';

export const getMenuItems = (t) => [
  { id: 'accueil',      icon: <FiHome />,     label: t('nav.home') },
  { id: 'medicaments',  icon: <FiPackage />,   label: t('nav.medications') },
  { id: 'rappels',      icon: <FiBell />,      label: t('nav.reminders') },
  { id: 'historique',   icon: <FiClipboard />, label: t('nav.history') },
  { id: 'statistiques', icon: <FiBarChart2 />, label: t('nav.statistics') },
  { id: 'contacts',     icon: <FiUsers />,     label: t('nav.contacts') },
  { id: 'parametres',   icon: <FiSettings />,  label: t('nav.settings') },
];