import { useCallback } from 'react';
import useSettingsStore from '../store/settingsStore';
import { translations } from '../i18n/translations';

export function useLang() {
  const language = useSettingsStore((state) => state.language);

  const t = useCallback((key) => {
    if (!key) return '';
    return translations[language]?.[key] || translations.ru[key] || key;
  }, [language]);

  return { t, language };
}

export default useLang;