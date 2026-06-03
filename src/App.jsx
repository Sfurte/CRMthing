import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import EditorShell from './pages/EditorShell';
import Settings from './pages/Settings';
import Help from './pages/Help'; // 🆕 Импорт страницы помощи
import useSettingsStore from './store/settingsStore';
import { I18nProvider } from './i18n';

function AppContent() {
  const { theme } = useSettingsStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.style.background = '#141414';
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.body.style.background = '#f5f7fa';
    }
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/editor/:projectId" element={<EditorShell />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/help" element={<Help />} /> {/* 🆕 Маршрут помощи */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}