import { Dropdown, Button } from 'antd';
import { PlusOutlined, DownOutlined } from '@ant-design/icons';
import { ELEMENT_DEFINITIONS } from '../elements';
import useStore from '../store';
import { useLang } from '../hooks/useLang';
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

// Компонент для перевода внутри map
function TranslatedLabel({ text }) {
  const { t } = useLang();
  return <>{t(text)}</>;
}

export default function Toolbar() {
  const { t } = useLang();
  const addElement = useStore((s) => s.addElement);

  const defByType = {};
  ELEMENT_DEFINITIONS.forEach((d) => { defByType[d.type] = d; });

  const categories = [
    { key: 'data', label: 'data' },
    { key: 'form', label: 'form' },
    { key: 'structure', label: 'structure' },
    { key: 'design', label: 'design' },
  ];

  const menuItems = categories.map((cat) => ({
    key: cat.key,
    label: <TranslatedLabel text={cat.label} />,
    children: ELEMENT_DEFINITIONS
      .filter((d) => typeToCategory[d.type] === cat.key)
      .map((def) => ({
        key: def.type,
        label: <TranslatedLabel text={def.label} />,
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
          {t('addComponent')}
          <DownOutlined />
        </Button>
      </Dropdown>

      <div className="toolbar__divider" />
      <ZoomControl />
    </div>
  );
}