import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const useRTL = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    const dir = isRTL ? 'rtl' : 'ltr';
    const lang = i18n.language;

    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
    document.documentElement.setAttribute('data-direction', dir);
  }, [i18n.language, isRTL]);

  return { isRTL, direction: isRTL ? 'rtl' : 'ltr' };
};
