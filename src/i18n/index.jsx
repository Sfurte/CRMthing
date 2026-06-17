import { createContext, useContext } from 'react';
import useSettingsStore from '../store/settingsStore';
import { translations } from './translations';

function translate(key, lang) {
  if (translations[lang]?.[key]) return translations[lang][key];
  if (translations.ru?.[key]) return translations.ru[key];
  return key;
}

const I18nContext = createContext({
  t: (key) => key,
  language: 'ru',
});

export function I18nProvider({ children }) {
  const language = useSettingsStore((state) => state.language);
  const t = (key) => translate(key, language);
  
  return (
    <I18nContext.Provider value={{ t, language }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  return useContext(I18nContext);
}
