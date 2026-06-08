import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { isRTL} from '../utils/languageUtils';


export const useLanguageSwitcher = () => {
    const { i18n } = useTranslation();



    useEffect(() => {
        document.documentElement.setAttribute('dir', isRTL(i18n.language) ? 'rtl' : 'ltr');
    }, [i18n.language]);

     const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('langue', lng);
  };

  return { currentLanguage: i18n.language, changeLanguage };
};

