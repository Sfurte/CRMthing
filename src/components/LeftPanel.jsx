import useStore, { selectActivePageElements } from '../store';

const styles = {
  panel: {
    width: 359,
    background: '#FFFFFF',
    borderRight: '1px solid #F8FBFF',
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 23,
    overflowY: 'auto',
    flexShrink: 0,
  },
  title: {
    fontFamily: 'Inter',
    fontWeight: 500,
    fontSize: 20,
    lineHeight: '24px',
    color: '#202020',
  },
  sectionLabel: {
    fontFamily: 'Inter',
    fontWeight: 500,
    fontSize: 16,
    lineHeight: '20px',
    color: '#202020',
    marginBottom: 6,
  },
  selectedInfo: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: 400,
    color: '#525252',
    lineHeight: '20px',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Inter',
    fontWeight: 500,
    fontSize: 16,
    lineHeight: '20px',
    color: '#202020',
    display: 'block',
    marginBottom: 6,
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    background: '#FFFFFF',
    border: '1px solid #D4D4D4',
    borderRadius: 8,
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: 400,
    color: '#202020',
    boxSizing: 'border-box',
  },
};

export default function LeftPanel() {
  const selectedId = useStore((s) => s.selectedId);
  const elements = useStore(selectActivePageElements);
  const setElementPosition = useStore((s) => s.setElementPosition);

  const selectedElement = elements.find((el) => el.id === selectedId);

  const handleXChange = (e) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val) && selectedElement) {
      setElementPosition(selectedElement.id, val, selectedElement.y);
    }
  };

  const handleYChange = (e) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val) && selectedElement) {
      setElementPosition(selectedElement.id, selectedElement.x, val);
    }
  };

  return (
    <div style={styles.panel}>
      <div style={styles.title}>Свойства</div>

      {selectedElement ? (
        <div>
          <div style={styles.sectionLabel}>{selectedElement.type}</div>
          <div style={styles.selectedInfo}>
            id: {selectedElement.id}
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>PosX</label>
            <input
              type="number"
              value={Math.round(selectedElement.x)}
              onChange={handleXChange}
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>PosY</label>
            <input
              type="number"
              value={Math.round(selectedElement.y)}
              onChange={handleYChange}
              style={styles.input}
            />
          </div>
        </div>
      ) : (
        <div style={{
          fontFamily: 'Inter',
          fontSize: 14,
          fontWeight: 400,
          color: '#999',
        }}>
          Выберите элемент на холсте
        </div>
      )}
    </div>
  );
}
