import { Dropdown, Button, Space, Typography } from 'antd';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { ELEMENT_DEFINITIONS } from '../elements';
import useStore from '../store';

const { Text } = Typography;

const styles = {
  topBar: {
    height: 56,
    background: '#FFFFFF',
    borderBottom: '1px solid #E0E0E0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 20px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    zIndex: 100,
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  title: {
    fontFamily: 'Inter',
    fontWeight: 600,
    fontSize: 18,
    color: '#202020',
  },
  dropdownTrigger: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
};

export default function TopBar({ onElementSelect, projectName }) {
  const addElement = useStore((s) => s.addElement);

  // Формируем меню для Dropdown
  const elementMenuItems = ELEMENT_DEFINITIONS.map((def) => ({
    key: def.type,
    label: (
      <Space>
        {def.icon && <def.icon />}
        <span>{def.label}</span>
      </Space>
    ),
    icon: def.icon ? <def.icon /> : null,
  }));

  // Обработчик выбора элемента из меню
  const handleMenuClick = ({ key: type }) => {
    // Добавляем элемент в центр видимой области (примерные координаты)
    // Точные координаты можно вычислять через canvasRectRef, если передать его сюда
    const x = 100 + Math.random() * 200; // Небольшой разброс, чтобы элементы не накладывались
    const y = 100 + Math.random() * 100;
    
    addElement(type, x, y);
    
    // Опционально: коллбэк для дополнительной логики
    onElementSelect?.(type);
  };

  return (
    <div style={styles.topBar}>
      <div style={styles.leftSection}>
        <Text style={styles.title}>{projectName || 'Проект'}</Text>
        
        <Dropdown
          menu={{
            items: elementMenuItems,
            onClick: handleMenuClick,
            style: { minWidth: 200 },
          }}
          trigger={['click']}
        >
          <Button style={styles.dropdownTrigger} icon={<PlusOutlined />}>
            Добавить элемент
            <DownOutlined />
          </Button>
        </Dropdown>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Text type="secondary" style={{ fontSize: 13 }}>
          💡 Выберите элемент из меню для добавления на доску
        </Text>
      </div>
    </div>
  );
}