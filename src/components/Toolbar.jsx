/**
 * Toolbar – the horizontal bar between Header and Canvas.
 */
import { Dropdown, Button } from 'antd';
import { PlusOutlined, DownOutlined } from '@ant-design/icons';
import { ELEMENT_DEFINITIONS } from '../elements';
import useStore from '../store';
import ZoomControl from './ZoomControl';
import './Toolbar.css';

const typeToCategory = {
  Table: 'data',
  Chart: 'data',
  Button: 'form',
  Input: 'form',
  Radio: 'form',
  Checkbox: 'form',
  Grid: 'structure',
  Card: 'structure',
  Container: 'structure',
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
    <div className="toolbar">
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

      <div className="toolbar__divider" />
      <ZoomControl />
    </div>
  );
}
