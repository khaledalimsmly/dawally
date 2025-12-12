import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import commonEn from './locales/en/common.json';
import navigationEn from './locales/en/navigation.json';
import homeEn from './locales/en/home.json';
import landingEn from './locales/en/landing.json';
import searchEn from './locales/en/search.json';
import scannerEn from './locales/en/scanner.json';
import compareModelsEn from './locales/en/compareModels.json';
import pricingEn from './locales/en/pricing.json';
import authEn from './locales/en/auth.json';
import dashboardEn from './locales/en/dashboard.json';
import stockDetailEn from './locales/en/stockDetail.json';
import predictionsEn from './locales/en/predictions.json';
import adminEn from './locales/en/admin.json';
import modelsEn from './locales/en/models.json';
import demoEn from './locales/en/demo.json';
import docsEn from './locales/en/docs.json';

import commonAr from './locales/ar/common.json';
import navigationAr from './locales/ar/navigation.json';
import homeAr from './locales/ar/home.json';
import landingAr from './locales/ar/landing.json';
import searchAr from './locales/ar/search.json';
import scannerAr from './locales/ar/scanner.json';
import compareModelsAr from './locales/ar/compareModels.json';
import pricingAr from './locales/ar/pricing.json';
import authAr from './locales/ar/auth.json';
import dashboardAr from './locales/ar/dashboard.json';
import stockDetailAr from './locales/ar/stockDetail.json';
import predictionsAr from './locales/ar/predictions.json';
import adminAr from './locales/ar/admin.json';
import modelsAr from './locales/ar/models.json';
import demoAr from './locales/ar/demo.json';
import docsAr from './locales/ar/docs.json';

const resources = {
  en: {
    common: commonEn,
    navigation: navigationEn,
    home: homeEn,
    landing: landingEn,
    search: searchEn,
    scanner: scannerEn,
    compareModels: compareModelsEn,
    pricing: pricingEn,
    auth: authEn,
    dashboard: dashboardEn,
    stockDetail: stockDetailEn,
    predictions: predictionsEn,
    admin: adminEn,
    models: modelsEn,
    demo: demoEn,
    docs: docsEn,
  },
  ar: {
    common: commonAr,
    navigation: navigationAr,
    home: homeAr,
    landing: landingAr,
    search: searchAr,
    scanner: scannerAr,
    compareModels: compareModelsAr,
    pricing: pricingAr,
    auth: authAr,
    dashboard: dashboardAr,
    stockDetail: stockDetailAr,
    predictions: predictionsAr,
    admin: adminAr,
    models: modelsAr,
    demo: demoAr,
    docs: docsAr,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: [
      'common',
      'navigation',
      'home',
      'landing',
      'search',
      'scanner',
      'compareModels',
      'pricing',
      'auth',
      'dashboard',
      'stockDetail',
      'predictions',
      'admin',
      'models',
      'demo',
      'docs',
    ],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
