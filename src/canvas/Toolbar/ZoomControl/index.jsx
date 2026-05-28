import { useState, useRef } from 'react';
import useStore, { selectViewTransform } from '../../../store';
import useClickOutside from '../../../hooks/useClickOutside';
import styles from './ZoomControl.module.css';

export default function ZoomControl() {
  const viewTransform = useStore(selectViewTransform);
  const setViewTransform = useStore((s) => s.setViewTransform);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useClickOutside(ref, () => setOpen(false));

  const handleInput = (e) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val) && val > 0) {
      const clamped = Math.min(500, Math.max(20, val));
      setViewTransform((prev) => ({ ...prev, zoom: clamped / 100 }));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') setOpen(false);
  };

  return (
    <div ref={ref} className={styles.wrapper}>
      <button className={styles.btn} onClick={() => setOpen(!open)}>
        {Math.round(viewTransform.zoom * 100)}%
      </button>
      {open && (
        <div className={styles.popup}>
          <label className={styles.label}>Масштаб (%)</label>
          <input
            type="number"
            defaultValue={Math.round(viewTransform.zoom * 100)}
            min={20}
            max={500}
            autoFocus
            onBlur={() => setOpen(false)}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            className={styles.input}
          />
        </div>
      )}
    </div>
  );
}
