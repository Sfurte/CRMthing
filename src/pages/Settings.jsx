import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserOutlined, FolderOutlined, StarOutlined, 
  QuestionCircleOutlined, SettingOutlined, LogoutOutlined,
  LeftOutlined
} from '@ant-design/icons';
import useSettingsStore from '../store/settingsStore';
import { useTranslation } from '../i18n';

// 🔹 Вспомогательный компонент пункта меню
function SidebarItem({ icon, label, active, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div 
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 20px',
        cursor: 'pointer',
        fontSize: 14,
        color: active ? '#1890ff' : '#666',
        fontWeight: active ? 600 : 400,
        background: active ? '#e6f7ff' : (hovered ? '#f5f5f5' : 'transparent'),
        borderRight: active ? '3px solid #1890ff' : '3px solid transparent',
        transition: 'all 0.2s'
      }}
    >
      <span style={{ fontSize: 16 }}>{icon}</span>
      <span>{label}</span>
    </div>
  );
}

// 🔹 Вспомогательный компонент переключателя
function ToggleGroup({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', border: '1px solid #d9d9d9', borderRadius: 4, overflow: 'hidden', width: 'fit-content' }}>
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          style={{
            padding: '6px 16px', border: 'none', background: 'transparent',
            color: value === opt.value ? '#1890ff' : '#666',
            fontWeight: value === opt.value ? 600 : 400,
            background: value === opt.value ? '#e6f7ff' : 'transparent',
            cursor: 'pointer', fontSize: 13, transition: 'all 0.2s'
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// 🔹 Основная страница настроек
export default function Settings() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // Получаем состояние и методы из настроек
  const { theme, language, autoSave, setTheme, setLanguage, toggleAutoSave, resetSettings } = useSettingsStore();

  // Применяем тему к body при загрузке и изменении
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.style.background = '#141414';
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.body.style.background = '#f5f7fa';
    }
  }, [theme]);

  // Обработчик сброса настроек
  const handleReset = () => {
    if (window.confirm(t('resetHint') + ' ' + t('confirm') + '?')) {
      resetSettings();
      alert(t('success') + '!');
    }
  };

  // Стили, зависящие от темы
  const isDark = theme === 'dark';
  const bg = isDark ? '#141414' : '#f5f7fa';
  const sidebarBg = isDark ? '#1f1f1f' : '#fff';
  const borderColor = isDark ? '#333' : '#e8e8e8';
  const textColor = isDark ? '#fff' : '#333';
  const secondaryText = isDark ? '#999' : '#999';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: bg, color: textColor }}>
      
      {/* 1. Шапка */}
      <div style={{ 
        height: 60, background: sidebarBg, borderBottom: `1px solid ${borderColor}`, 
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
        padding: '0 24px', flexShrink: 0 
      }}>
        <button 
          onClick={() => navigate('/')} 
          style={{ 
            background: 'none', border: 'none', cursor: 'pointer', 
            fontSize: 14, color: textColor, display: 'flex', alignItems: 'center', gap: 8 
          }}
        >
          <LeftOutlined /> {t('back')}
        </button>
        <h1 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>{t('settings')}</h1>
        <div style={{ width: 80 }}></div>
      </div>

      {/* 2. Тело страницы */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* Левая панель (Сайдбар) */}
        <div style={{ 
          width: 260, background: sidebarBg, borderRight: `1px solid ${borderColor}`, 
          display: 'flex', flexDirection: 'column', padding: '20px 0' 
        }}>
          {/* Профиль */}
          <div style={{ 
            padding: '0 20px 20px 20px', borderBottom: `1px solid ${borderColor}`, marginBottom: 10 
          }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{t('username')}</div>
            <div style={{ fontSize: 12, color: secondaryText }}>example@mail.ru</div>
          </div>

          <SidebarItem icon={<FolderOutlined />} label={t('projects')} onClick={() => navigate('/')} />
          <SidebarItem icon={<StarOutlined />} label={t('components')} onClick={() => navigate('/editor/proj-1')} />
          <SidebarItem icon={<QuestionCircleOutlined />} label={t('help')} onClick={() => navigate('/help')} />
          <SidebarItem icon={<SettingOutlined />} label={t('settings')} active />
          
          <div style={{ flex: 1 }} />
          
          <SidebarItem icon={<LogoutOutlined />} label={t('logout')} onClick={() => {
            if (window.confirm(t('confirm') + '?')) navigate('/');
          }} />
        </div>

        {/* Правая часть (Контент) */}
        <div style={{ flex: 1, padding: '40px 60px', overflowY: 'auto' }}>
          
          {/* Секция: Тема */}
          <div style={{ marginBottom: 32 }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: 16, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#faad14', fontSize: 10 }}>●</span> {t('interfaceTheme')}
            </h3>
            <ToggleGroup 
              value={theme} 
              onChange={setTheme}
              options={[
                { label: t('light'), value: 'light' },
                { label: t('dark'), value: 'dark' }
              ]}
            />
            <p style={{ fontSize: 12, color: secondaryText, marginTop: 8 }}>
              {t('currentTheme')}: <strong>{theme === 'dark' ? t('dark') : t('light')}</strong>
            </p>
          </div>

          {/* Секция: Язык */}
          <div style={{ marginBottom: 32 }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: 16, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#1890ff', fontSize: 10 }}>●</span> {t('interfaceLanguage')}
            </h3>
            <ToggleGroup 
              value={language} 
              onChange={setLanguage}
              options={[
                { label: t('russian'), value: 'ru' },
                { label: t('english'), value: 'en' }
              ]}
            />
            <p style={{ fontSize: 12, color: secondaryText, marginTop: 8 }}>
              {t('selectedLanguage')}: <strong>{language === 'ru' ? t('russian') : t('english')}</strong>
            </p>
          </div>

          {/* Секция: Сохранение */}
          <div style={{ marginBottom: 32 }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: 16, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#52c41a', fontSize: 10 }}>●</span> {t('saving')}
            </h3>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14 }}>
              <input 
                type="checkbox" 
                checked={autoSave} 
                onChange={toggleAutoSave}
                style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#1890ff' }}
              />
              {t('autoSave')} <span style={{ color: secondaryText }}>({autoSave ? t('autoSaveEnabled') : t('autoSaveDisabled')})</span>
            </label>
            <p style={{ fontSize: 12, color: secondaryText, marginTop: 8 }}>
              {autoSave ? t('autoSaveHint') : t('autoSaveHintDisabled')}
            </p>
          </div>

          {/* Секция: Система */}
          <div style={{ marginBottom: 32 }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: 16, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#722ed1', fontSize: 10 }}>●</span> {t('system')}
            </h3>
            <button 
              onClick={handleReset}
              style={{
                padding: '8px 16px', background: sidebarBg, border: `1px solid ${borderColor}`,
                borderRadius: 4, cursor: 'pointer', fontSize: 13, color: textColor,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#ff4d4f'; e.currentTarget.style.color = '#ff4d4f'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = borderColor; e.currentTarget.style.color = textColor; }}
            >
              {t('resetSettings')}
            </button>
            <p style={{ fontSize: 12, color: secondaryText, marginTop: 8 }}>
              {t('resetHint')}
            </p>
          </div>

          {/* Инфо-блок */}
          <div style={{ 
            marginTop: 40, padding: 16, 
            background: isDark ? '#1f1f1f' : '#e6f7ff',
            borderRadius: 4, borderLeft: '4px solid #1890ff'
          }}>
            <p style={{ margin: 0, fontSize: 12, color: secondaryText }}>
              ✅ {t('settingsSaved')}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}