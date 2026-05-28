/**
 * Toolbar – the horizontal bar between Header and Canvas.
 */
import { Dropdown, Button } from 'antd';
import { PlusOutlined, DownOutlined } from '@ant-design/icons';
import { ELEMENT_DEFINITIONS } from '../elements';
import useStore from '../store';
import ZoomControl from './ZoomControl';

const dividerStyle = {
  width: 0,
  height: 18,
  borderLeft: '1px solid #ACACAC',
};

/** Map element types to category keys */
const typeToCategory = {
  Table: 'data',
  Chart: 'data',
  Button: 'form',
  Input: 'form',
  Grid: 'structure',
  Card: 'structure',
  Text: 'design',
  Image: 'design',
};

const categories = [
  { key: 'data', label: 'Данные' },
  { key: 'form', label: 'Форма' },
  { key: 'structure', label: 'Структура' },
  { key: 'design', label: 'Дизайн' },
];

export default function Toolbar() {
  const addElement = useStore((s) => s.addElement);

  /** Build a lookup: type → definition */
  const defByType = {};
  ELEMENT_DEFINITIONS.forEach((d) => { defByType[d.type] = d; });

  const menuItems = categories.map((cat) => ({
    key: cat.key,
    label: cat.label,
    children: ELEMENT_DEFINITIONS
      .filter((d) => typeToCategory[d.type] === cat.key)
      .map((def) => ({
        key: def.type,
        label: def.label,
      })),
  }));

  const handleMenuClick = ({ key: type }) => {
    if (!defByType[type]) return;
    const x = 100 + Math.random() * 200;
    const y = 100 + Math.random() * 100;
    addElement(type, x, y);
  };

  return (
    <div
      style={{
        height: 44,
        background: '#FFFFFF',
        borderBottom: '1px solid #E0E0E0',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: '4px 20px',
        gap: 8,
      }}
    >
      <Dropdown
        menu={{
          items: menuItems,
          onClick: handleMenuClick,
          style: { minWidth: 200 },
        }}
        trigger={['click']}
      >
        <Button icon={<PlusOutlined />}>
          Добавить компонент
          <DownOutlined />
        </Button>
      </Dropdown>

      <div style={dividerStyle} />
      <ZoomControl />
    </div>
  );
}
