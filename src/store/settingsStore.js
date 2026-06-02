import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useSettingsStore = create(
  persist(
    (set) => ({
      // Тема: 'light' | 'dark'
      theme: 'light',
      
      // Язык: 'ru' | 'en'
      language: 'ru',
      
      // Автосохранение
      autoSave: true,
      
      // Сброс настроек по умолчанию
      resetSettings: () => {
        set({
          theme: 'light',
          language: 'ru',
          autoSave: true,
        });
      },
      
      // Установить тему
      setTheme: (theme) => {
        set({ theme });
        // Применяем тему к document
        if (theme === 'dark') {
          document.documentElement.setAttribute('data-theme', 'dark');
          document.body.style.background = '#141414';
          document.body.style.color = '#fff';
        } else {
          document.documentElement.removeAttribute('data-theme');
          document.body.style.background = '#f5f7fa';
          document.body.style.color = '#000';
        }
      },
      
      // Установить язык
      setLanguage: (language) => {
        set({ language });
        // Здесь можно добавить загрузку переводов
        console.log('Language changed to:', language);
      },
      
      // Переключить автосохранение
      toggleAutoSave: () => {
        set((state) => ({ autoSave: !state.autoSave }));
      },
    }),
    {
      name: 'crmthing-settings', // ключ в localStorage
    }
  )
);

export default useSettingsStore;