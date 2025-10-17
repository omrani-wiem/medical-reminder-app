import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationFR from './locales/fr.json';
import translationEN from './locales/en.json';
import translationAR from './locales/ar.json';

//traductions
const resources = {
    fr: {
        translation: translationFR
    },
    en: {
        translation: translationEN
    },
    ar: {
        translation: translationAR  
    }
};

i18n
.use(LanguageDetector)
.use(initReactI18next)
.init({
    resources,
    fallbackLng: 'fr',
    debug: false,

    interpolation: {
        escapeValue: false
    },
    detection: {
        order: ['localStorage', 'navigator', 'htmlTag'],
        caches: ['localStorage'],
        lookupLocalStorage: 'i18nextLng',
    }
});

export default i18n;


