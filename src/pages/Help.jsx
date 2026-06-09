import { PlusOutlined, SettingTwoTone, DragOutlined, DatabaseOutlined } from '@ant-design/icons';
import { useTranslation } from '../i18n';
import './Help.css';

function HelpCard({ icon, title, children }) {
  return (
    <div className="help-card">
      <h3 className="help-card__title">
        {icon} {title}
      </h3>
      <div className="help-card__body">
        {children}
      </div>
    </div>
  );
}

export default function Help() {
  const { t } = useTranslation();

  return (
    <div className="help">
      <div className="help__welcome">
        <h2 className="help__welcome-title">Добро пожаловать в конструктор!</h2>
        <p className="help__welcome-text">
          Конструктор позволяет создавать аналитические страницы из готовых
          компонентов и настраивать их свойства.
        </p>
      </div>

      <HelpCard
        icon={<PlusOutlined style={{ color: '#52c41a' }} />}
        title="Добавление компонентов"
      >
        <p>
          Используйте кнопку добавления в верхней панели конструктора для выбора
          нужного компонента. После выбора элемент автоматически появляется на
          рабочей области страницы.
        </p>
        <ul>
          <li>Таблицы — для отображения данных</li>
          <li>Графики — для визуализации статистики</li>
          <li>Текст — для описаний и заголовков</li>
          <li>Карточки — для группировки информации</li>
          <li>И другие компоненты</li>
        </ul>
      </HelpCard>

      <HelpCard
        icon={<SettingTwoTone />}
        title="Настройка свойств"
      >
        <p>
          После выбора компонента слева отображается панель его свойств,
          в ней можно изменить размеры, цвета и источники данных элемента.
        </p>
        <ul>
          <li>Размеры — ширина и высота</li>
          <li>Цвета — фон, текст, границы</li>
          <li>Данные — подписи, источник информации</li>
        </ul>
      </HelpCard>

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
