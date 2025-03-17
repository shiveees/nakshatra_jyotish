import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { translations } from "@shared/translations";

i18next.use(initReactI18next).init({
  resources: {
    en: { translation: translations.en },
    hi: { translation: translations.hi }
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false
  }
});

export default i18next;
