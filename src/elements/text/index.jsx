/**
 * EditableText — a clickable, inline-editable text label.
 *
 * Usage as standalone element (auto-registered via registry):
 *   <TextElement />
 *
 * Usage inside other elements:
 *   import { EditableText } from '../elements/text';
 *   <EditableText initialValue="Label" />
 */
import { useState, useRef, useEffect } from 'react';
import styles from './Text.module.css';

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
        className={styles.input}
        style={style}
      />
    );
  }

  return (
    <span
      onClick={handleClick}
      className={styles.text}
      style={style}
    >
      {value}
    </span>
  );
}

/** Default export for registry (standalone canvas element) */
export default function TextElement() {
  return (
    <div className={styles.wrapper}>
      <EditableText initialValue="Text" />
    </div>
  );
}
