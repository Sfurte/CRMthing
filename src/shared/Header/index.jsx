import styles from './Header.module.css';

export default function Header({ title = 'Dashboard', onBack }) {
  const headerStyle = {
    justifyContent: onBack ? 'space-between' : 'center',
  };

  return (
    <div className={styles.header} style={headerStyle}>
      {onBack && (
        <div className={styles.leftGroup}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className={styles.backArrow}
            onClick={onBack}
          >
            <path
              d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z"
              fill="#202020"
            />
          </svg>
          <span className={styles.backText} onClick={onBack}>
            Назад
          </span>
        </div>
      )}
      <span className={styles.title}>{title}</span>
      {onBack && <div className={styles.spacer} />}
    </div>
  );
}
