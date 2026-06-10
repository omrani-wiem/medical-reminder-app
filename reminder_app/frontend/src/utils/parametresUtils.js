export const FORM_INITIAL = {
     nom: '', prenom: '', email: '',
  telephone: '', dateNaissance: '', adresse: '',
  theme: 'clair', langue: 'fr', timezone: 'Europe/Paris',
  notifPush: true, notifEmail: true, notifSMS: false, rappelAvance: 15,
  motDePasseActuel: '', nouveauMotDePasse: '', confirmMotDePasse: '',
  allergies: '', maladiesChroniques: '', medecinTraitant: '', pharmacie: ''
};

export const TIMEZONES = [
  'Europe/Paris',
  'Europe/London',
  'America/New_York'
];

export const getSections = (t) => [
  { id: 'profil',       label: t('settings.profile') },
  { id: 'preferences',  label: t('settings.preferences') },
  { id: 'notifications', label: t('settings.notifications') },
  { id: 'securite',     label: t('settings.security') },
  { id: 'medical',      label: t('settings.medical') },
  { id: 'donnees',      label: t('settings.dataManagement') }
];

export const getUserFromStorage = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return {
    nom: user.nom || '',
    prenom: user.prenom || '',
    email: user.email || '',
    telephone: user.telephone || '',
    dateNaissance: user.dateNaissance || '',
    adresse: user.adresse || ''
  };
};