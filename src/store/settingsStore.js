import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useSettingsStore = create(
  persist(
    (set) => ({
      theme: 'light',
      language: 'ru',
      autoSave: true,
      
      resetSettings: () => {
        set({
          theme: 'light',
          language: 'ru',
          autoSave: true,
        });
      },
      
      setTheme: (theme) => set({ theme }),
      
      setLanguage: (language) => set({ language }),
      
      toggleAutoSave: () => set((state) => ({ autoSave: !state.autoSave })),
    }),
    {
      name: 'crmthing-settings',
    }
  )
);

export default useSettingsStore;