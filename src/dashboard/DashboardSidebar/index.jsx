import styles from './Sidebar.module.css';

export default function DashboardSidebar() {
  return (
    <div className={styles.sidebar}>
      <div className={styles.profileSection}>
        <div className={styles.avatar}>JD</div>
        <div className={styles.name}>John Doe</div>
        <div className={styles.email}>john@example.com</div>
      </div>

      <div className={styles.menuSection}>
        <div className={styles.menuItemActive}>📁 Проекты</div>
        <div className={styles.menuItem}>🧩 Компоненты</div>
        <div className={styles.menuItem}>📄 Страницы</div>
        <div className={styles.menuItem}>⚙️ Настройки</div>
      </div>
    </div>
  );
}
