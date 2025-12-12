import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('i18nextLng', newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 hover:border-teal-500/50 transition-all text-gray-300 hover:text-teal-400"
      aria-label="Change language"
    >
      <Globe className="w-4 h-4" />
      <span className="text-sm font-semibold">
        {i18n.language === 'en' ? 'العربية' : 'English'}
      </span>
    </button>
  );
};
