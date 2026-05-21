/**
 * Dropdown to add a new component to the canvas.
 * Click an item to add it at a default position (200, 200).
 */
import { useState, useRef } from 'react';
import { elementDefinitions } from '../elements/registry';
import useStore from '../store';
import useClickOutside from '../hooks/useClickOutside';

const btnStyle = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '8px 14px',
  gap: 8,
  borderRadius: 8,
  border: 'none',
  cursor: 'pointer',
  fontFamily: 'Inter',
  fontSize: 14,
  fontWeight: 400,
  color: '#202020',
  background: 'transparent',
};

const chevronStyle = {
  width: 20,
  height: 20,
};

const dropdownItemStyle = {
  padding: '10px 14px',
  background: '#FFFFFF',
  border: 'none',
  cursor: 'pointer',
  fontFamily: 'Inter',
  fontSize: 16,
  fontWeight: 400,
  color: '#202020',
  width: '100%',
  textAlign: 'left',
};

const dropdownItemHoverStyle = {
  background: '#F0F7FF',
};

export default function AddComponentDropdown() {
  const addElement = useStore((s) => s.addElement);
  const [open, setOpen] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const ref = useRef(null);

  useClickOutside(ref, () => setOpen(false));

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button style={btnStyle} onClick={() => setOpen(!open)}>
        Добавить компонент
        <svg style={chevronStyle} viewBox="0 0 24 24" fill="none">
          <path d="M6 9L12 15L18 9" stroke="#202020" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            minWidth: 200,
            background: '#FFFFFF',
            border: '1px solid #D4D4D4',
            borderRadius: 8,
            boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
            zIndex: 1000,
            overflow: 'hidden',
          }}
        >
          {elementDefinitions.map((def, i) => (
            <button
              key={def.type}
              style={{
                ...dropdownItemStyle,
                ...(hoveredIdx === i ? dropdownItemHoverStyle : {}),
              }}
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
