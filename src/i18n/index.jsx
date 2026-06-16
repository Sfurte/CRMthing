import { createContext, useContext } from 'react';
import useSettingsStore from '../store/settingsStore';
export { translations } from './translations';

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