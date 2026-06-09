import { useMemo } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Typography } from 'antd';
import { FolderOutlined, SettingOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useTranslation } from '../i18n';
import './AppLayout.css';

const { Sider, Content } = Layout;
const { Text } = Typography;

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

  return (
    <Layout className="app-layout">
      <Sider
        width={280}
        className="app-layout__sider"
      >
        <div className="app-layout__profile">
          <div className="app-layout__avatar">JD</div>
          <Text strong className="app-layout__name">John Doe</Text>
          <Text type="secondary" className="app-layout__email">john@example.com</Text>
        </div>

        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={handleMenuClick}
          className="app-layout__menu"
        />
      </Sider>

      <Layout>
        <Content className="app-layout__content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
