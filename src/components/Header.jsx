const styles = {
  header: {
    height: 60,
    background: '#FFFFFF',
    borderBottom: '1px solid #F8FBFF',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 20px',
  },
  leftGroup: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backText: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: 400,
    color: '#202020',
    cursor: 'pointer',
  },
  title: {
    fontFamily: 'Inter',
    fontSize: 20,
    fontWeight: 500,
    color: '#202020',
  },
  spacer: {
    // empty spacer to balance flexbox layout
    width: 277,
  },
};

export default function Header() {
  return (
    <div style={styles.header}>
      <div style={styles.leftGroup}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ cursor: 'pointer' }}>
          <path d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z" fill="#202020" />
        </svg>
        <span style={styles.backText}>Назад</span>
      </div>
      <span style={styles.title}>Dashboard</span>
      <div style={styles.spacer} />
    </div>
  );
}