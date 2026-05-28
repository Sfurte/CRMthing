/**
 * Toolbar – the horizontal bar between Header and Canvas.
 * Contains the Add Component dropdown, filter buttons, and zoom control.
 */
import AddComponentDropdown from './AddComponentDropdown';
import ZoomControl from './ZoomControl';
import styles from './Toolbar.module.css';

const ITEMS = [
  { text: 'Layout' },
  { text: 'Данные' },
  { text: 'Desktop' },
];

export default function Toolbar() {
  return (
    <div className={styles.toolbar}>
      <AddComponentDropdown />
      <div className={styles.divider} />
      {ITEMS.map((item, i) => (
        <div key={i} className={styles.btnGroup}>
          <button className={styles.btn}>
            {item.text}
            <svg className={styles.chevron} viewBox="0 0 24 24" fill="none">
              <path d="M6 9L12 15L18 9" stroke="#202020" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {i < ITEMS.length - 1 && <div className={styles.divider} />}
        </div>
      ))}
      <div className={styles.divider} />
      <ZoomControl />
    </div>
  );
}
