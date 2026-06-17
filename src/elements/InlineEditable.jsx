import { useState, useRef, useEffect } from 'react';

const stopAll = (e) => {
  e.stopPropagation();
  e.nativeEvent?.stopImmediatePropagation?.();
};

/**
 * Inline-editable text.
 * Display mode: NO event stopping → drag works normally.
 * Edit mode:   stopAll on everything → @dnd-kit can't steal input clicks.
 */
export default function InlineEditable({ value, onSave, multiline = false, style = {} }) {
  const [editing, setEditing] = useState(false);
  const ref = useRef(null);
  const valRef = useRef(value);

  useEffect(() => { valRef.current = value; }, [value]);

  useEffect(() => {
    if (!editing || !ref.current) return;
    setTimeout(() => { ref.current.focus(); ref.current.select(); }, 10);
  }, [editing]);

  const save = () => {
    const v = valRef.current.trim();
    if (v) onSave(v);
    setEditing(false);
  };

  if (editing) {
    const Tag = multiline ? 'textarea' : 'input';
    return (
      <Tag
        ref={ref}
        defaultValue={value}
        onChange={(e) => { valRef.current = e.target.value; }}
        onBlur={save}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); save(); }
          if (e.key === 'Escape') { valRef.current = value; setEditing(false); }
          stopAll(e);
        }}
        onPointerDown={stopAll}
        onPointerDownCapture={stopAll}
        onMouseDown={stopAll}
        onMouseDownCapture={stopAll}
        onClick={stopAll}
        style={{
          width: '100%', border: '1px solid #1890ff', background: '#fff',
          padding: '4px 8px', outline: 'none', borderRadius: 4,
          boxSizing: 'border-box', cursor: 'text',
          pointerEvents: 'auto',
          resize: multiline ? 'vertical' : 'none',
          minHeight: multiline ? 60 : 'auto',
          fontFamily: 'inherit', fontSize: 'inherit', lineHeight: 'inherit',
          ...style,
        }}
        rows={multiline ? 3 : undefined}
      />
    );
  }

  return (
    <div
      onDoubleClick={(e) => { e.stopPropagation(); setEditing(true); }}
      style={{
        cursor: 'text',
        pointerEvents: 'auto',
        minHeight: multiline ? 40 : 20,
        whiteSpace: multiline ? 'pre-wrap' : undefined,
        wordBreak: 'break-word',
        padding: '4px 8px',
        ...style,
      }}
    >
      {value || '\u2014'}
    </div>
  );
}
