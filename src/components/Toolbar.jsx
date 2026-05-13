import { useState, useEffect, useRef } from 'react';
import useStore from '../store';
import { ELEMENT_TYPES, elementDefinitions } from '../elements/registry';

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

const dividerStyle = {
  width: 0,
  height: 18,
  border: '1px solid #ACACAC',
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

function AddComponentDropdown({ addElement }) {
  const [open, setOpen] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (type) => {
    addElement(type, 200, 200);
    setOpen(false);
  };

  // Read labels from element definitions
  const defByType = {};
  elementDefinitions.forEach((d) => { defByType[d.type] = d; });

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
          {ELEMENT_TYPES.map((type, i) => (
            <button
              key={type}
              style={{
                ...dropdownItemStyle,
                ...(hoveredIdx === i ? dropdownItemHoverStyle : {}),
              }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              onClick={() => handleSelect(type)}
            >
              {(defByType[type] && defByType[type].label) || type}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const ITEMS = [
  { text: 'Layout' },
  { text: 'Данные' },
  { text: 'Desktop' },
];

export default function Toolbar() {
  const addElement = useStore((s) => s.addElement);
  const zoom = useStore((s) => s.zoom);
  const setZoom = useStore((s) => s.setZoom);
  const [openZoom, setOpenZoom] = useState(false);
  const zoomRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (zoomRef.current && !zoomRef.current.contains(e.target)) {
        setOpenZoom(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleZoomInput = (e) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val) && val > 0) {
      const clamped = Math.min(500, Math.max(20, val));
      setZoom(clamped / 100);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setOpenZoom(false);
    }
  };

  return (
    <div
      style={{
        height: 44,
        background: '#FFFFFF',
        borderBottom: '1px solid #F8FBFF',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: '4px 20px',
        gap: 8,
      }}
    >
      <AddComponentDropdown addElement={addElement} />
      <div style={dividerStyle} />
      {ITEMS.map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button style={btnStyle}>
            {item.text}
            <svg style={chevronStyle} viewBox="0 0 24 24" fill="none">
              <path d="M6 9L12 15L18 9" stroke="#202020" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {i < ITEMS.length - 1 && <div style={dividerStyle} />}
        </div>
      ))}
      <div style={dividerStyle} />
      {/* Zoom display — shows current percentage, click to reveal custom input */}
      <div ref={zoomRef} style={{ position: 'relative' }}>
        <button style={btnStyle} onClick={() => setOpenZoom(!openZoom)}>
          {Math.round(zoom * 100)}%
        </button>
        {openZoom && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              background: '#FFFFFF',
              border: '1px solid #D4D4D4',
              borderRadius: 8,
              boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
              zIndex: 1000,
              padding: 12,
              minWidth: 120,
            }}
          >
            <label
              style={{
                fontFamily: 'Inter',
                fontSize: 12,
                color: '#525252',
                display: 'block',
                marginBottom: 4,
              }}
            >
              Масштаб (%)
            </label>
            <input
              type="number"
              defaultValue={Math.round(zoom * 100)}
              min={20}
              max={500}
              autoFocus
              onBlur={() => setOpenZoom(false)}
              onChange={handleZoomInput}
              onKeyDown={handleKeyDown}
              style={{
                width: '100%',
                padding: '6px 8px',
                border: '1px solid #D4D4D4',
                borderRadius: 6,
                fontFamily: 'Inter',
                fontSize: 14,
                boxSizing: 'border-box',
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}