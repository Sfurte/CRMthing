import { useState, useEffect } from 'react';
import useStore, { selectActivePageElements } from '../../store';
import { elementDefinitions } from '../../elements/registry';
import styles from './LeftPanel.module.css';

const labelByType = {};
elementDefinitions.forEach((d) => { labelByType[d.type] = d.label; });

export default function LeftPanel() {
  const selectedId = useStore((s) => s.selectedId);
  const elements = useStore(selectActivePageElements);
  const setElementPosition = useStore((s) => s.setElementPosition);

  const selectedElement = elements.find((el) => el.id === selectedId);

  const [xStr, setXStr] = useState('');
  const [yStr, setYStr] = useState('');

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
    <div className={styles.panel}>
      <div className={styles.title}>Свойства</div>

      {selectedElement ? (
        <div>
          <div className={styles.sectionLabel}>{labelByType[selectedElement.type] || selectedElement.type}</div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>PosX</label>
            <input
              type="number"
              value={xStr}
              onChange={handleXChange}
              onBlur={commitX}
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>PosY</label>
            <input
              type="number"
              value={yStr}
              onChange={handleYChange}
              onBlur={commitY}
              className={styles.input}
            />
          </div>
        </div>
      ) : (
        <div className={styles.empty}>
          Выберите элемент на холсте
        </div>
      )}
    </div>
  );
}
