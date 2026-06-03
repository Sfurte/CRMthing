export const translations = {
  ru: {
    projects: 'Проекты', lastProject: 'Последний проект', allProjects: 'Все проекты',
    searchProjects: 'Поиск проектов', filter: 'Фильтр', createProject: '+ Создать проект',
    noProjects: 'Проектов пока нет', noProjectsHint: 'Создайте первый проект',
    back: 'Назад', settings: 'Настройки', profile: 'Профиль',
    interfaceTheme: 'Тема интерфейса', light: '☀ Светлая', dark: '☾ Тёмная',
    interfaceLanguage: 'Язык интерфейса', russian: 'Русский', english: 'English',
    saving: 'Сохранение', autoSave: 'Автосохранение изменений', system: 'Система',
    resetSettings: 'Сбросить настройки', settingsSaved: 'Настройки сохранены в localStorage',
    currentTheme: 'Текущая тема', selectedLanguage: 'Выбран язык',
    autoSaveEnabled: 'включено', autoSaveDisabled: 'выключено',
    autoSaveHint: 'Изменения сохраняются автоматически',
    autoSaveHintDisabled: 'Вам нужно вручную сохранять изменения',
    resetHint: 'Вернёт все настройки к значениям по умолчанию',
    components: 'Компоненты', help: 'Помощь', logout: 'Выход', username: 'Имя пользователя',
    confirm: 'Подтвердить', success: 'Успешно',
    // Добавь остальные ключи по необходимости
  },
  en: {
    projects: 'Projects', lastProject: 'Last Project', allProjects: 'All Projects',
    searchProjects: 'Search projects', filter: 'Filter', createProject: '+ Create Project',
    noProjects: 'No projects yet', noProjectsHint: 'Create your first project',
    back: 'Back', settings: 'Settings', profile: 'Profile',
    interfaceTheme: 'Interface Theme', light: ' Light', dark: '☾ Dark',
    interfaceLanguage: 'Interface Language', russian: 'Русский', english: 'English',
    saving: 'Saving', autoSave: 'Auto-save changes', system: 'System',
    resetSettings: 'Reset Settings', settingsSaved: 'Settings saved to localStorage',
    currentTheme: 'Current theme', selectedLanguage: 'Selected language',
    autoSaveEnabled: 'enabled', autoSaveDisabled: 'disabled',
    autoSaveHint: 'Changes are saved automatically',
    autoSaveHintDisabled: 'You need to manually save changes',
    resetHint: 'Will reset all settings to default values',
    components: 'Components', help: 'Help', logout: 'Logout', username: 'Username',
    confirm: 'Confirm', success: 'Success',
    radio: 'Переключатель',
    direction: 'Расположение',
    horizontal: 'Горизонтально',
    vertical: 'Вертикально',
    addOption: '+ Добавить вариант',
    radio: 'Radio Button',
    direction: 'Direction',
    horizontal: 'Horizontal',
    vertical: 'Vertical',
    addOption: '+ Add Option',
  }
};

export const t = (key, lang = 'ru') => {
  return translations[lang]?.[key] || translations.ru[key] || key;
};