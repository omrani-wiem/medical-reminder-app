import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Traductions pour les différentes langues
const translations = {
  fr: {
    // Navigation
    dashboard: "Dashboard",
    overview: "Accueil",
    yourProfile: "Votre Profil",
    myMedications: "Mes Médicaments",
    reminders: "Rappels & Notifications",
    statistics: "Statistiques",
    settings: "Paramètres",
    logout: "Déconnexion",
    hello: "Bonjour",
    
    // Dashboard
    upcomingReminders: "Prochains rappels",
    medicationStatus: "État des médicaments",
    nextDose: "Prochaine dose",
    todaySchedule: "Programme d'aujourd'hui",
    adherenceRate: "Taux d'adhérence",
    
    // Profil
    personalInfo: "Informations personnelles",
    username: "Nom d'utilisateur",
    email: "Email",
    notProvided: "Non renseigné",
    tip: "Conseil",
    tipMessage: "Gardez vos informations à jour pour recevoir les meilleurs rappels personnalisés !",
    
    // Paramètres
    notifications: "Notifications",
    emailNotifications: "Recevoir les rappels par email",
    browserNotifications: "Notifications du navigateur",
    language: "Langue",
    selectLanguage: "Sélectionner la langue",
    
    // Médicaments
    addNewMedication: "Ajouter un nouveau médicament",
    medicationName: "Nom du médicament",
    dose: "Dose",
    time: "Heure de prise",
    frequency: "Fréquence",
    duration: "Durée du traitement",
    emailForReminders: "Email pour les rappels",
    addMedication: "Ajouter le médicament",
    testEmail: "Test Email",
    addingInProgress: "Ajout en cours...",
    myMedications: "Mes médicaments",
    noMedicationsRegistered: "Aucun médicament enregistré",
    addFirstMedication: "Ajoutez votre premier médicament pour commencer à recevoir des rappels !",
    
    // Rappels
    manageReminders: "Gestion des rappels",
    enableReminders: "Activer les rappels",
    disableReminders: "Désactiver les rappels",
    modifyTime: "Modifier l'heure",
    reminderSettings: "Paramètres des rappels",
    activeReminders: "Rappels actifs",
    inactiveReminders: "Rappels inactifs",
    
    // Statistiques
    adherenceStats: "Statistiques d'adhérence",
    takenCorrectly: "Prises correctes",
    missedDoses: "Doses manquées",
    weeklyProgress: "Progression hebdomadaire",
    monthlyProgress: "Progression mensuelle",
    totalMedications: "Total médicaments",
    thisWeek: "Cette semaine",
    
    // Placeholders
    medicationNamePlaceholder: "Ex: Paracétamol, Doliprane...",
    dosePlaceholder: "Ex: 1 comprimé, 5ml, 2 gélules...",
    frequencyPlaceholder: "Ex: 1 fois/jour, 3 fois/jour, Matin et soir...",
    durationPlaceholder: "Ex: 7 jours, 2 semaines, 1 mois...",
    emailPlaceholder: "votre.email@exemple.com"
  },
  
  en: {
    // Navigation
    dashboard: "Dashboard",
    overview: "Overview",
    yourProfile: "Your Profile",
    myMedications: "My Medications",
    reminders: "Reminders & Notifications",
    statistics: "Statistics",
    settings: "Settings",
    logout: "Logout",
    hello: "Hello",
    
    // Dashboard
    upcomingReminders: "Upcoming reminders",
    medicationStatus: "Medication status",
    nextDose: "Next dose",
    todaySchedule: "Today's schedule",
    adherenceRate: "Adherence rate",
    
    // Profile
    personalInfo: "Personal Information",
    username: "Username",
    email: "Email",
    notProvided: "Not provided",
    tip: "Tip",
    tipMessage: "Keep your information up to date to receive the best personalized reminders!",
    
    // Settings
    notifications: "Notifications",
    emailNotifications: "Receive email reminders",
    browserNotifications: "Browser notifications",
    language: "Language",
    selectLanguage: "Select language",
    
    // Medications
    addNewMedication: "Add a new medication",
    medicationName: "Medication name",
    dose: "Dose",
    time: "Time to take",
    frequency: "Frequency",
    duration: "Treatment duration",
    emailForReminders: "Email for reminders",
    addMedication: "Add medication",
    testEmail: "Test Email",
    addingInProgress: "Adding in progress...",
    myMedications: "My medications",
    noMedicationsRegistered: "No medications registered",
    addFirstMedication: "Add your first medication to start receiving reminders!",
    
    // Reminders
    manageReminders: "Manage reminders",
    enableReminders: "Enable reminders",
    disableReminders: "Disable reminders",
    modifyTime: "Modify time",
    reminderSettings: "Reminder settings",
    activeReminders: "Active reminders",
    inactiveReminders: "Inactive reminders",
    
    // Statistics
    adherenceStats: "Adherence statistics",
    takenCorrectly: "Taken correctly",
    missedDoses: "Missed doses",
    weeklyProgress: "Weekly progress",
    monthlyProgress: "Monthly progress",
    totalMedications: "Total medications",
    thisWeek: "This week",
    
    // Placeholders
    medicationNamePlaceholder: "Ex: Paracetamol, Aspirin...",
    dosePlaceholder: "Ex: 1 tablet, 5ml, 2 capsules...",
    frequencyPlaceholder: "Ex: Once a day, 3 times a day, Morning and evening...",
    durationPlaceholder: "Ex: 7 days, 2 weeks, 1 month...",
    emailPlaceholder: "your.email@example.com"
  }
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('fr');

  // Charger la langue depuis localStorage au démarrage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('appLanguage') || 'fr';
    setCurrentLanguage(savedLanguage);
    
    // Mettre à jour la langue du document
    document.documentElement.lang = savedLanguage;
  }, []);

  const changeLanguage = (language) => {
    setCurrentLanguage(language);
    localStorage.setItem('appLanguage', language);
    
    // Mettre à jour la langue du document
    document.documentElement.lang = language;
  };

  const t = (key) => {
    return translations[currentLanguage][key] || key;
  };

  const value = {
    currentLanguage,
    changeLanguage,
    t,
    availableLanguages: [
      { code: 'fr', name: 'Français', flag: '🇫🇷' },
      { code: 'en', name: 'English', flag: '🇺🇸' }
    ]
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};