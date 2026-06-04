import { useState, useEffect } from 'react';
import { useTranslation } from '../i18n';
import useSettingsStore from '../store/settingsStore';

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

export default function Settings() {
  const { t } = useTranslation();
  const { theme, language, autoSave, setTheme, setLanguage, toggleAutoSave, resetSettings } = useSettingsStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.style.background = '#141414';
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.body.style.background = '#f5f7fa';
    }
  }, [theme]);

  const handleReset = () => {
    if (window.confirm(t('resetHint') + ' ' + t('confirm') + '?')) {
      resetSettings();
      alert(t('success') + '!');
    }
  };

  const isDark = theme === 'dark';
  const textColor = isDark ? '#fff' : '#333';
  const secondaryText = isDark ? '#999' : '#999';

  return (
    <div style={{ padding: '40px 60px', color: textColor }}>
      {/* Theme */}
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: 16, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: '#faad14', fontSize: 10 }}>●</span> {t('interfaceTheme')}
        </h3>
        <ToggleGroup
          value={theme}
          onChange={setTheme}
          options={[
            { label: t('light'), value: 'light' },
            { label: t('dark'), value: 'dark' },
          ]}
        />
        <p style={{ fontSize: 12, color: secondaryText, marginTop: 8 }}>
          {t('currentTheme')}: <strong>{theme === 'dark' ? t('dark') : t('light')}</strong>
        </p>
      </div>

      {/* Language */}
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: 16, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: '#1890ff', fontSize: 10 }}>●</span> {t('interfaceLanguage')}
        </h3>
        <ToggleGroup
          value={language}
          onChange={setLanguage}
          options={[
            { label: t('russian'), value: 'ru' },
            { label: t('english'), value: 'en' },
          ]}
        />
        <p style={{ fontSize: 12, color: secondaryText, marginTop: 8 }}>
          {t('selectedLanguage')}: <strong>{language === 'ru' ? t('russian') : t('english')}</strong>
        </p>
      </div>

      {/* Saving */}
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

      {/* Reset */}
      <div style={{ marginBottom: 32, paddingTop: 24, borderTop: '1px solid #e8e8e8' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: 16, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: '#ff4d4f', fontSize: 10 }}>●</span> {t('reset') || 'Сброс'}
        </h3>
        <button
          onClick={handleReset}
          style={{
            padding: '8px 20px', border: '1px solid #ff4d4f', borderRadius: 6,
            background: 'transparent', color: '#ff4d4f', cursor: 'pointer',
            fontSize: 14, transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#ff4d4f'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#ff4d4f'; }}
        >
          {t('reset') || 'Сбросить настройки'}
        </button>
      </div>
    </div>
  );
}
