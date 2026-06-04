import { useNavigate } from 'react-router-dom';
import { PlusOutlined, SettingTwoTone, DragOutlined, DatabaseOutlined } from '@ant-design/icons';
import { useTranslation } from '../i18n';

function HelpCard({ icon, title, children }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e8e8e8',
      borderRadius: 8,
      padding: 20,
      marginBottom: 20,
    }}>
      <h3 style={{
        margin: '0 0 12px 0',
        fontSize: 16,
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        color: '#333',
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
  const { t } = useTranslation();

  return (
    <div style={{ padding: '40px 60px' }}>
      {/* Welcome */}
      <div style={{
        background: '#fff',
        borderRadius: 8,
        padding: 24,
        marginBottom: 24,
        borderLeft: '4px solid #1890ff',
      }}>
        <h2 style={{ margin: '0 0 12px 0', fontSize: 20, fontWeight: 600 }}>
          Добро пожаловать в конструктор!
        </h2>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: '#666' }}>
          Конструктор позволяет создавать аналитические страницы из готовых
          компонентов и настраивать их свойства.
        </p>
      </div>

      {/* Section 1 */}
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

      {/* Section 2 */}
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
          <li>Данные — подписи, источник информации</li>
        </ul>
      </HelpCard>

      {/* Section 3 */}
      <HelpCard
        icon={<DragOutlined style={{ color: '#1890ff' }} />}
        title="Управление слоями"
      >
        <p>
          Используйте стрелки вверх и вниз в контекстном меню для изменения
          порядка слоёв элементов. Это позволяет располагать одни элементы
          поверх других.
        </p>
      </HelpCard>

      {/* Section 4 */}
      <HelpCard
        icon={<DatabaseOutlined style={{ color: '#722ed1' }} />}
        title="Работа с данными"
      >
        <p>
          Таблицы могут использовать различные наборы данных, которые
          выбираются в панели свойств. Выберите нужный макет данных из
          выпадающего списка.
        </p>
      </HelpCard>
    </div>
  );
}
