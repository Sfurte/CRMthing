import { useState } from 'react';

export const definition = {
  type: 'Input',
  label: 'Input',
};

export default function InputElement() {
  const [value, setValue] = useState('');

  return (
    <div style={{
      width: 200,
      minHeight: 70,
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      padding: '8px 10px',
      borderRadius: 6,
      background: '#fff',
      border: '1px solid #d1d5db',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      fontFamily: 'Inter',
      fontSize: 13,
      userSelect: 'none',
    }}>
      <label style={{
        fontWeight: 500,
        color: '#374151',
        fontSize: 12,
      }}>
        Label
      </label>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter text..."
        style={{
          width: '100%',
          border: '1px solid #d1d5db',
          borderRadius: 4,
          padding: '6px 8px',
          fontSize: 13,
          fontFamily: 'Inter',
          outline: 'none',
          boxSizing: 'border-box',
        }}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}