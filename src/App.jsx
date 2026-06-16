import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { ConfigProvider, theme } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import enUS from 'antd/locale/en_US';
import AppLayout from './components/AppLayout';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Help from './pages/Help';
import EditorShell from './pages/EditorShell';
import useSettingsStore from './store/settingsStore';

function AppContent() {
  const { theme: themeMode, language } = useSettingsStore();
  const isDark = themeMode === 'dark';

  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.style.background = '#141414';
      document.body.style.color = '#e8e8e8';
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.body.style.background = '#f5f7fa';
      document.body.style.color = '#202020';
    }
  }, [isDark]);

  const antdLocale = language === 'ru' ? ruRU : enUS;

  return (
    <ConfigProvider
      locale={antdLocale}
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#3B82F6',
          borderRadius: 6,
          fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/help" element={<Help />} />
          </Route>
          <Route path="/editor/:projectId" element={<EditorShell />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default function App() {
  return <AppContent />;
}