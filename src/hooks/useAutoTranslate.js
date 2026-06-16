import { useState, useEffect } from 'react';
import useSettingsStore from '../store/settingsStore';

// Простой словарь переводов (без API)
const translations = {
  ru: {
    'Все проекты': 'Все проекты',
    'Поиск': 'Поиск',
    'Фильтры': 'Фильтры',
    'Создать проект': 'Создать проект',
    'Нет проектов': 'Нет проектов',
    'Создайте первый проект, чтобы начать работу': 'Создайте первый проект, чтобы начать работу',
    'Все проекты': 'Все проекты',
    'Активные': 'Активные',
    'Архив': 'Архив',
    'Пауза': 'Пауза',
  },
  en: {
    'Все проекты': 'All Projects',
    'Поиск': 'Search',
    'Фильтры': 'Filters',
    'Создать проект': 'Create Project',
    'Нет проектов': 'No projects',
    'Создайте первый проект, чтобы начать работу': 'Create your first project to get started',
    'Все проекты': 'All Projects',
    'Активные': 'Active',
    'Архив': 'Archived',
    'Пауза': 'Paused',
  },
};

export function useAutoTranslate(text) {
  const language = useSettingsStore((s) => s.language);

  if (!text) return '';

  // Если язык русский — возвращаем как есть
  if (language === 'ru') {
    return text;
  }

  // Ищем перевод
  return translations[language]?.[text] || translations.en[text] || text;
}

export default useAutoTranslate;