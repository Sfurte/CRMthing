import { useState, useRef, useEffect } from 'react';
import useStore from '../store';

export const definition = {
  type: 'Input',
  label: 'Текстовое поле',
  icon: null,
  defaultProps: {
    placeholder: 'Введите текст...',
    label: 'Подпись',
    value: '',
    bgColor: '#ffffff',
    textColor: '#000000',
    borderColor: '#d9d9d9',
    fontSize: 14,
  },
  properties: [
    { name: 'label', label: 'Подпись', type: 'text' },
    { name: 'placeholder', label: 'Плейсхолдер', type: 'text' },
    { name: 'bgColor', label: 'Фон', type: 'color' },
    { name: 'textColor', label: 'Цвет текста', type: 'color' },
    { name: 'borderColor', label: 'Цвет рамки', type: 'color' },
    { name: 'fontSize', label: 'Размер шрифта', type: 'number', min: 10, max: 24 },
  ],
};

// 🔹 Универсальный инлайн-редактор
const EditableInline = ({ value, onSave, isMultiline = false, style, textColor, bgColor, borderColor }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => { setEditValue(value); }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        if (!isMultiline) inputRef.current?.select();
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [isEditing, isMultiline]);

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const stopEvents = (e) => {
    e.stopPropagation();
    e.nativeEvent?.stopImmediatePropagation?.();
  };

  if (isEditing) {
    const Tag = isMultiline ? 'textarea' : 'input';
    return (
      <Tag
        ref={inputRef}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !isMultiline) { e.preventDefault(); handleSave(); }
          if (e.key === 'Escape') { setEditValue(value); setIsEditing(false); }
          stopEvents(e);
        }}
        onPointerDown={stopEvents}
        onClick={stopEvents}
        style={{
          width: '100%',
          background: '#fff',
          color: '#000',
          border: `1px solid ${borderColor || '#1890ff'}`,
          borderRadius: 4,
          padding: '6px 10px',
          fontSize: 'inherit',
          fontWeight: 'inherit',
          outline: 'none',
          resize: 'none',
          boxSizing: 'border-box',
          cursor: 'text',
          ...style
        }}
        rows={isMultiline ? 2 : undefined}
      />
    );
  }

  return (
    <div
      onDoubleClick={(e) => { stopEvents(e); setIsEditing(true); }}
      style={{
        cursor: 'text',
        padding: '6px 10px',
        borderRadius: 4,
        minHeight: 20,
        color: textColor || '#000',
        background: bgColor || 'transparent',
        ...style
      }}
    >
      {value ?? (isMultiline ? '' : '—')}
    </div>
  );
};

export default function InputElement({ element, isSelected }) {
  const updateElementProps = useStore((s) => s.updateElementProps);
  const props = element?.props || definition.defaultProps;
  
  const { label, placeholder, value, bgColor, textColor, borderColor, fontSize } = props;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        pointerEvents: 'auto',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Редактируемая подпись */}
      <EditableInline
        value={label}
        textColor={textColor}
        bgColor="transparent"
        borderColor={borderColor}
        onSave={(val) => updateElementProps(element.id, { label: val })}
        style={{ fontSize: Number(fontSize) || 14, fontWeight: 500, marginBottom: 4, padding: '2px 10px' }}
      />

      {/* Редактируемое поле ввода */}
      <EditableInline
        value={placeholder}
        isMultiline={false}
        textColor={textColor}
        bgColor={bgColor}
        borderColor={borderColor}
        onSave={(val) => updateElementProps(element.id, { placeholder: val })}
        style={{
          fontSize: Number(fontSize) || 14,
          border: `1px solid ${borderColor || '#d9d9d9'}`,
          background: bgColor || '#fff',
          color: textColor || '#000',
          opacity: value ? 1 : 0.6, // Плейсхолдер чуть прозрачнее
        }}
      />
    </div>
  );
}