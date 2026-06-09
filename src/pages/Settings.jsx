import { useEffect } from 'react';
import { useTranslation } from '../i18n';
import useSettingsStore from '../store/settingsStore';
import './Settings.css';

function ToggleGroup({ options, value, onChange }) {
  return (
    <div className="settings__toggle-group">
      {options.map(opt => (
        <button
          key={opt.value}
          className={'settings__toggle-btn' + (value === opt.value ? ' settings__toggle-btn--active' : '')}
          onClick={() => onChange(opt.value)}
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

  return (
    <div className="settings">
      {/* Theme */}
      <div className="settings__section">
        <h3 className="settings__heading">
          <span className="settings__dot" style={{ color: '#faad14' }}>●</span> {t('interfaceTheme')}
        </h3>
        <ToggleGroup
          value={theme}
          onChange={setTheme}
          options={[
            { label: t('light'), value: 'light' },
            { label: t('dark'), value: 'dark' },
          ]}
        />
        <p className="settings__hint">
          {t('currentTheme')}: <strong>{theme === 'dark' ? t('dark') : t('light')}</strong>
        </p>
      </div>

      {/* Language */}
      <div className="settings__section">
        <h3 className="settings__heading">
          <span className="settings__dot" style={{ color: '#1890ff' }}>●</span> {t('interfaceLanguage')}
        </h3>
        <ToggleGroup
          value={language}
          onChange={setLanguage}
          options={[
            { label: t('russian'), value: 'ru' },
            { label: t('english'), value: 'en' },
          ]}
        />
        <p className="settings__hint">
          {t('selectedLanguage')}: <strong>{language === 'ru' ? t('russian') : t('english')}</strong>
        </p>
      </div>

      {/* Saving */}
      <div className="settings__section">
        <h3 className="settings__heading">
          <span className="settings__dot" style={{ color: '#52c41a' }}>●</span> {t('saving')}
        </h3>
        <label className="settings__checkbox">
          <input
            type="checkbox"
            checked={autoSave}
            onChange={toggleAutoSave}
          />
          {t('autoSave')} <span style={{ color: 'var(--text-tertiary)' }}>({autoSave ? t('autoSaveEnabled') : t('autoSaveDisabled')})</span>
        </label>
        <p className="settings__hint">
          {autoSave ? t('autoSaveHint') : t('autoSaveHintDisabled')}
        </p>
      </div>

      {/* Reset */}
      <div className="settings__reset-section">
        <h3 className="settings__heading">
          <span className="settings__dot" style={{ color: '#ff4d4f' }}>●</span> {t('reset') || 'Сброс'}
        </h3>
        <button className="settings__reset-btn" onClick={handleReset}>
          {t('reset') || 'Сбросить настройки'}
        </button>
      </div>
    </div>
  );
}
