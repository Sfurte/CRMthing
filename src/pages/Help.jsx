import { useState } from 'react'; // 🟢 ИСПРАВЛЕНО: добавлен импорт
import { useNavigate } from 'react-router-dom';
import { 
  UserOutlined, FolderOutlined, StarOutlined, 
  QuestionCircleOutlined, SettingOutlined, LogoutOutlined,
  LeftOutlined, PlusOutlined, SettingTwoTone, 
  DragOutlined, DatabaseOutlined
} from '@ant-design/icons';
import { useTranslation } from '../i18n';

// 🔹 Компонент пункта меню
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

// 🔹 Компонент карточки с инструкцией
function HelpCard({ icon, title, children }) {
  return (
    <div style={{ 
      background: '#fff', 
      border: '1px solid #e8e8e8', 
      borderRadius: 8, 
      padding: 20, 
      marginBottom: 20 
    }}>
      <h3 style={{ 
        margin: '0 0 12px 0', 
        fontSize: 16, 
        fontWeight: 600, 
        display: 'flex', 
        alignItems: 'center', 
        gap: 8,
        color: '#333'
      }}>
        {icon} {title}
      </h3>
      <div style={{ fontSize: 14, lineHeight: 1.6, color: '#666' }}>
        {children}
      </div>
    </div>
  );
}

export default function Help() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f5f7fa' }}>
      
      {/* 1. Шапка */}
      <div style={{ 
        height: 60, background: '#fff', borderBottom: '1px solid #e8e8e8', 
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
        padding: '0 24px', flexShrink: 0 
      }}>
        <button 
          onClick={() => navigate('/')} 
          style={{ 
            background: 'none', border: 'none', cursor: 'pointer', 
            fontSize: 14, color: '#555', display: 'flex', alignItems: 'center', gap: 8 
          }}
        >
          <LeftOutlined /> {t('back')}
        </button>
        <h1 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Помощь</h1>
        <div style={{ width: 80 }}></div>
      </div>

      {/* 2. Тело страницы */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* Сайдбар */}
        <div style={{ 
          width: 260, background: '#fff', borderRight: '1px solid #e8e8e8', 
          display: 'flex', flexDirection: 'column', padding: '20px 0' 
        }}>
          {/* Профиль */}
          <div style={{ 
            padding: '0 20px 20px 20px', 
            borderBottom: '1px solid #f0f0f0', 
            marginBottom: 10 
          }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#333', marginBottom: 4 }}>
              {t('username')}
            </div>
            <div style={{ fontSize: 12, color: '#999' }}>example@mail.ru</div>
          </div>

          <SidebarItem 
            icon={<FolderOutlined />} 
            label={t('projects')} 
            onClick={() => navigate('/')} 
          />
          <SidebarItem 
            icon={<StarOutlined />} 
            label={t('components')} 
            onClick={() => navigate('/editor/proj-1')} 
          />
          <SidebarItem 
            icon={<QuestionCircleOutlined />} 
            label={t('help')} 
            active 
          />
          <SidebarItem 
            icon={<SettingOutlined />} 
            label={t('settings')} 
            onClick={() => navigate('/settings')} 
          />
          
          <div style={{ flex: 1 }} />
          
          <SidebarItem 
            icon={<LogoutOutlined />} 
            label={t('logout')} 
            onClick={() => {
              if (window.confirm(t('confirm') + '?')) {
                navigate('/');
              }
            }} 
          />
        </div>

        {/* Контент */}
        <div style={{ 
          flex: 1, 
          padding: '40px 60px', 
          overflowY: 'auto',
          background: '#f5f7fa'
        }}>
          
          {/* Введение */}
          <div style={{ 
            background: '#fff', 
            borderRadius: 8, 
            padding: 24, 
            marginBottom: 24,
            borderLeft: '4px solid #1890ff'
          }}>
            <h2 style={{ margin: '0 0 12px 0', fontSize: 20, fontWeight: 600 }}>
              Добро пожаловать в конструктор!
            </h2>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: '#666' }}>
              Конструктор позволяет создавать аналитические страницы из готовых 
              компонентов и настраивать их свойства.
            </p>
          </div>

          {/* Раздел 1: Добавление компонентов */}
          <HelpCard 
            icon={<PlusOutlined style={{ color: '#52c41a' }} />}
            title="Добавление компонентов"
          >
            <p>
              Используйте кнопку добавления в верхней панели конструктора для выбора 
              нужного компонента. После выбора элемент автоматически появляется на 
              рабочей области страницы.
            </p>
            <ul style={{ marginTop: 12, paddingLeft: 20 }}>
              <li>Таблицы — для отображения данных</li>
              <li>Графики — для визуализации статистики</li>
              <li>Текст — для описаний и заголовков</li>
              <li>Карточки — для группировки информации</li>
              <li>И другие компоненты</li>
            </ul>
          </HelpCard>

          {/* Раздел 2: Настройка свойств */}
          <HelpCard 
            icon={<SettingTwoTone style={{ color: '#faad14' }} />}
            title="Настройка свойств"
          >
            <p>
              После выбора компонента слева отображается панель его свойств, 
              в ней можно изменить размеры, цвета и источники данных элемента.
            </p>
            <ul style={{ marginTop: 12, paddingLeft: 20 }}>
              <li>Размеры — ширина и высота</li>
              <li>Цвета — фон, текст, границы</li>
              <li>Шрифты — размер, жирность, выравнивание</li>
              <li>Данные — подключение к источникам</li>
            </ul>
          </HelpCard>

          {/* Раздел 3: Работа с элементами */}
          <HelpCard 
            icon={<DragOutlined style={{ color: '#1890ff' }} />}
            title="Работа с элементами"
          >
            <p>
              Компоненты можно перемещать по рабочей области, изменять их размеры 
              и удалять через контекстное меню.
            </p>
            <ul style={{ marginTop: 12, paddingLeft: 20 }}>
              <li><strong>Перемещение:</strong> перетащите элемент мышью</li>
              <li><strong>Изменение размера:</strong> используйте маркеры по краям</li>
              <li><strong>Редактирование:</strong> двойной клик по тексту</li>
              <li><strong>Удаление:</strong> правый клик → Удалить</li>
              <li><strong>Копирование:</strong> Ctrl+C / Ctrl+V</li>
            </ul>
          </HelpCard>

          {/* Раздел 4: Работа с данными */}
          <HelpCard 
            icon={<DatabaseOutlined style={{ color: '#722ed1' }} />}
            title="Работа с данными"
          >
            <p>
              Компоненты с поддержкой данных позволяют подключать mock data 
              и JSON-источники через панель свойств.
            </p>
            <ul style={{ marginTop: 12, paddingLeft: 20 }}>
              <li>Mock данные — предустановленные наборы</li>
              <li>JSON API — подключение внешних источников</li>
              <li>Ручной ввод — редактирование напрямую</li>
              <li>Автосохранение — изменения сохраняются автоматически</li>
            </ul>
          </HelpCard>

          {/* Подсказка */}
          <div style={{ 
            marginTop: 24, 
            padding: 16, 
            background: '#e6f7ff',
            borderRadius: 4,
            borderLeft: '4px solid #1890ff'
          }}>
            <p style={{ margin: 0, fontSize: 13, color: '#666' }}>
              <strong>💡 Совет:</strong> Для быстрого доступа к справке нажмите F1 или 
              обратитесь к разделу "Помощь" в любой момент работы.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}