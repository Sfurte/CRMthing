import { useMemo } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Typography } from 'antd';
import {
  FolderOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { useTranslation } from '../i18n';

const { Sider, Content } = Layout;
const { Text } = Typography;

const pageTitles = {
  '/': 'projects',
  '/settings': 'settings',
  '/help': 'help',
};

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const selectedKey = location.pathname === '/' ? 'projects' : location.pathname.slice(1);

  const menuItems = useMemo(() => [
    { key: 'projects', icon: <FolderOutlined />, label: t('projects') },
    { key: 'settings', icon: <SettingOutlined />, label: t('settings') },
    { key: 'help', icon: <QuestionCircleOutlined />, label: t('help') },
  ], [t]);

  const handleMenuClick = ({ key }) => {
    const path = key === 'projects' ? '/' : `/${key}`;
    navigate(path);
  };

  const titleKey = pageTitles[location.pathname] || 'projects';
  const pageTitle = t(titleKey);

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider
        width={280}
        style={{
          background: '#fff',
          borderRight: '1px solid #e8ecf0',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
        }}
      >
        {/* Profile */}
        <div style={{ padding: '24px 20px 20px' }}>
          <div
            style={{
              width: 48, height: 48,
              backgroundColor: '#3B82F6',
              borderRadius: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 20, fontWeight: 700,
              marginBottom: 12,
            }}
          >
            JD
          </div>
          <Text strong style={{ fontSize: 16, display: 'block', marginBottom: 2 }}>
            John Doe
          </Text>
          <Text type="secondary" style={{ fontSize: 13 }}>
            john@example.com
          </Text>
        </div>

        {/* Navigation */}
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ borderRight: 'none', fontSize: 15 }}
        />
      </Sider>

      <Layout>
        {/* Shared header */}
        <div
          style={{
            height: 60,
            background: '#fff',
            borderBottom: '1px solid #E0E0E0',
            display: 'flex',
            alignItems: 'center',
            padding: '0 24px',
            flexShrink: 0,
          }}
        >
          <Text strong style={{ fontSize: 20, color: '#202020' }}>
            {pageTitle}
          </Text>
        </div>

        {/* Page content */}
        <Content style={{ background: '#F0F7FF', overflow: 'auto' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
