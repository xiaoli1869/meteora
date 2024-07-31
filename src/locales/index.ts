import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en";
import zhtw from "./zhtw";
import zhcn from "./zhcn";
import jp from "./jp";
import ko from "./ko";
i18n.use(initReactI18next).init({
  resources: {
    en: {
      translations: en,
    },
    zhtw: {
      translations: zhtw,
    },
    zhcn: {
      translations: zhcn,
    },
    jp: {
      translations: jp,
    },
    ko: {
      translations: ko,
    },
  },
  lng: localStorage.lang || "zhcn",
  fallbackLng: localStorage.lang || "zhcn",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
