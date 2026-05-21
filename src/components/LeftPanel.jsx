import { useState, useEffect } from 'react';
import useStore, { selectActivePageElements } from '../store';
import { elementDefinitions } from '../elements/registry';

// Build label lookup: type → label
const labelByType = {};
elementDefinitions.forEach((d) => { labelByType[d.type] = d.label; });

const styles = {
  panel: {
    width: 359,
    background: '#FFFFFF',
    borderRight: '1px solid #E0E0E0',
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

  // Local state for input fields so the user can freely edit them
  const [xStr, setXStr] = useState('');
  const [yStr, setYStr] = useState('');

  // Sync local state from store whenever the element or position changes
  useEffect(() => {
    if (selectedElement) {
      setXStr(String(Math.round(selectedElement.x)));
      setYStr(String(Math.round(selectedElement.y)));
    }
  }, [selectedElement?.id, selectedElement?.x, selectedElement?.y]);

  const handleXChange = (e) => {
    const raw = e.target.value;
    setXStr(raw);
    const val = parseFloat(raw);
    if (!isNaN(val) && selectedElement) {
      setElementPosition(selectedElement.id, val, selectedElement.y);
    }
  };

  const handleYChange = (e) => {
    const raw = e.target.value;
    setYStr(raw);
    const val = parseFloat(raw);
    if (!isNaN(val) && selectedElement) {
      setElementPosition(selectedElement.id, selectedElement.x, val);
    }
  };

  const commitX = () => {
    const val = parseFloat(xStr);
    if (isNaN(val) && selectedElement) {
      // Rollback to stored value
      setXStr(String(Math.round(selectedElement.x)));
    }
  };

  const commitY = () => {
    const val = parseFloat(yStr);
    if (isNaN(val) && selectedElement) {
      setYStr(String(Math.round(selectedElement.y)));
    }
  };

  return (
    <div style={styles.panel}>
      <div style={styles.title}>Свойства</div>

      {selectedElement ? (
        <div>
          <div style={styles.sectionLabel}>{labelByType[selectedElement.type] || selectedElement.type}</div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>PosX</label>
            <input
              type="number"
              value={xStr}
              onChange={handleXChange}
              onBlur={commitX}
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>PosY</label>
            <input
              type="number"
              value={yStr}
              onChange={handleYChange}
              onBlur={commitY}
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
