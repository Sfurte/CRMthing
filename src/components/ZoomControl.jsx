/**
 * Zoom control – shows the current zoom percentage and allows
 * the user to type a custom value.
 */
import { useState, useRef } from 'react';
import useStore, { selectViewTransform } from '../store';
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
    if (e.key === 'Enter') {
      setOpen(false);
    }
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button style={btnStyle} onClick={() => setOpen(!open)}>
        {Math.round(viewTransform.zoom * 100)}%
      </button>
      {open && (
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
            defaultValue={Math.round(viewTransform.zoom * 100)}
            min={20}
            max={500}
            autoFocus
            onBlur={() => setOpen(false)}
            onChange={handleInput}
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
  );
}
