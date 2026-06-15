import { UserOutlined } from '@ant-design/icons';

const styles = {
  sidebar: {
    width: 280,
    minWidth: 280,
    background: '#FFFFFF',
    borderRight: '1px solid #e8ecf0',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  profileSection: {
    marginBottom: 30,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    backgroundColor: '#3B82F6',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: 24,
    flexShrink: 0,
  },
  profileInfo: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  name: {
    fontWeight: 700,
    fontSize: 16,
    color: '#1a1f36',
    fontFamily: 'Inter, sans-serif',
  },
  email: {
    fontSize: 13,
    color: '#697386',
    fontFamily: 'Inter, sans-serif',
  },
  menuItem: {
    padding: '12px',
    borderRadius: 8,
    color: '#4a5568',
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
    fontSize: 15,
    transition: 'background-color 0.2s',
  },
  menuItemActive: {
    padding: '12px',
    borderRadius: 8,
    color: '#3B82F6',
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
    fontSize: 15,
    fontWeight: 600,
    backgroundColor: '#f0f2f5',
  },
  menuSection: {
    flex: 1,
    marginBottom: 20,
  },
};

export default function DashboardSidebar() {
  return (
    <div style={styles.sidebar}>
      <div style={styles.profileSection}>
        <div style={styles.avatar}>
          <UserOutlined />
        </div>
        <div style={styles.profileInfo}>
          <div style={styles.name}>John Doe</div>
          <div style={styles.email}>john@example.com</div>
        </div>
      </div>

      <div style={styles.menuSection}>
        <div style={styles.menuItemActive}>📁 Проекты</div>
        <div style={styles.menuItem}>🧩 Компоненты</div>
        <div style={styles.menuItem}>📄 Страницы</div>
        <div style={styles.menuItem}>⚙️ Настройки</div>
      </div>
    </div>
  );
}
