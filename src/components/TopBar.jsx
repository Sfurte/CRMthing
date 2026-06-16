import { Dropdown, Button, Space, Typography } from 'antd';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { ELEMENT_DEFINITIONS } from '../elements';
import useStore from '../store';
import { useLang } from '../hooks/useLang';

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

// Компонент для перевода внутри map
function TranslatedLabel({ text }) {
  const { t } = useLang();
  return <>{t(text)}</>;
}

export default function TopBar({ onElementSelect, projectName }) {
  const { t } = useLang();
  const addElement = useStore((s) => s.addElement);

  const elementMenuItems = ELEMENT_DEFINITIONS.map((def) => ({
    key: def.type,
    label: (
      <Space>
        {def.icon && <def.icon />}
        <span><TranslatedLabel text={def.label} /></span>
      </Space>
    ),
    icon: def.icon ? <def.icon /> : null,
  }));

  const handleMenuClick = ({ key: type }) => {
    const x = 100 + Math.random() * 200;
    const y = 100 + Math.random() * 100;
    
    addElement(type, x, y);
    onElementSelect?.(type);
  };

  return (
    <div style={styles.topBar}>
      <div style={styles.leftSection}>
        <Text style={styles.title}>{projectName || t('project')}</Text>
        
        <Dropdown
          menu={{
            items: elementMenuItems,
            onClick: handleMenuClick,
            style: { minWidth: 200 },
          }}
          trigger={['click']}
        >
          <Button style={styles.dropdownTrigger} icon={<PlusOutlined />}>
            {t('addComponent')}
            <DownOutlined />
          </Button>
        </Dropdown>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Text type="secondary" style={{ fontSize: 13 }}>
          💡 {t('addElementHint')}
        </Text>
      </div>
    </div>
  );
}