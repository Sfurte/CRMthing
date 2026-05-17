/**
 * EditableText – a clickable, inline-editable text label.
 *
 * Usage as standalone element (auto-registered via registry):
 *   <TextElement />
 *
 * Usage inside other elements:
 *   import { EditableText } from '../elements/text';
 *   <EditableText initialValue="Label" />
 */
import { useState, useRef, useEffect } from 'react';

export const definition = {
  type: 'Text',
  label: 'Текст',
};

/**
 * Reusable editable text component.
 * @param {{ initialValue?: string, style?: object }} props
 */
export function EditableText({ initialValue = 'Текст', style }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const handleClick = (e) => {
    e.stopPropagation();
    setEditing(true);
  };

  const handleBlur = () => {
    setEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setEditing(false);
    }
    e.stopPropagation();
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        style={{
          border: '1px solid #3B82F6',
          borderRadius: 4,
          padding: '2px 4px',
          fontFamily: 'Inter',
          fontSize: 14,
          fontWeight: 400,
          color: '#202020',
          background: '#fff',
          outline: 'none',
          minWidth: 40,
          boxSizing: 'border-box',
          ...style,
        }}
      />
    );
  }

  return (
    <span
      onClick={handleClick}
      style={{
        fontFamily: 'Inter',
        fontSize: 14,
        fontWeight: 400,
        color: '#202020',
        cursor: 'text',
        userSelect: 'none',
        padding: '2px 4px',
        display: 'inline-block',
        minWidth: 20,
        minHeight: 20,
        ...style,
      }}
    >
      {value}
    </span>
  );
}

/** Default export for registry (standalone canvas element) */
export default function TextElement() {
  return (
    <div style={{
      display: 'inline-block',
      padding: '4px 8px',
    }}>
      <EditableText initialValue="Text" />
    </div>
  );
}
