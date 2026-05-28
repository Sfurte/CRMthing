import { useState, useRef } from 'react';
import { elementDefinitions } from '../../../elements/registry';
import useStore from '../../../store';
import useClickOutside from '../../../hooks/useClickOutside';
import styles from './Dropdown.module.css';

export default function AddComponentDropdown() {
  const addElement = useStore((s) => s.addElement);
  const [open, setOpen] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const ref = useRef(null);

  useClickOutside(ref, () => setOpen(false));

  return (
    <div ref={ref} className={styles.wrapper}>
      <button className={styles.btn} onClick={() => setOpen(!open)}>
        Добавить компонент
        <svg className={styles.chevron} viewBox="0 0 24 24" fill="none">
          <path d="M6 9L12 15L18 9" stroke="#202020" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <div className={styles.dropdown}>
          {elementDefinitions.map((def, i) => (
            <button
              key={def.type}
              className={styles.dropdownItem}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              onClick={() => {
                addElement(def.type, 200, 200);
                setOpen(false);
              }}
            >
              {def.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
