import { useState, useRef, useEffect } from 'react';
import { BorderOutlined } from '@ant-design/icons';
import useStore from '../store';

export const definition = {
  type: 'Container',
  label: 'Контейнер',
  icon: BorderOutlined,
  defaultProps: {
    text: 'Контейнер',
    bgColor: '#f5f5f5',    // Светло-серый фон по умолчанию
    textColor: '#000000',  // Черный текст
    padding: 16,
  },
  properties: [
    { name: 'text', label: 'Текст', type: 'text' },
    { name: 'bgColor', label: 'Фон', type: 'color' },
    { name: 'textColor', label: 'Цвет текста', type: 'color' },
    { name: 'padding', label: 'Отступ', type: 'number', min: 0, max: 50 },
  ],
};

// 🔹 Компонент редактируемого текста (универсальный)
const EditableText = ({ value, onSave, isMultiline = false, style, textColor, isEditing: forcedEditing }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef(null);

  const activeEditing = forcedEditing || isEditing;

  useEffect(() => {
    if (activeEditing && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [activeEditing]);

  useEffect(() => { setEditValue(value); }, [value]);

  const handleSave = () => {
    onSave(editValue);
    if (!forcedEditing) setIsEditing(false);
  };

  const stopEvents = (e) => {
    e.stopPropagation();
    e.nativeEvent?.stopImmediatePropagation?.();
  };

  if (activeEditing) {
    const Tag = isMultiline ? 'textarea' : 'input';
    return (
      <Tag
        ref={inputRef}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !isMultiline) { e.preventDefault(); handleSave(); }
          if (e.key === 'Escape') { setEditValue(value); if (!forcedEditing) setIsEditing(false); }
          stopEvents(e);
        }}
        onPointerDown={stopEvents}
        onClick={stopEvents}
        style={{
          width: '100%',
          border: `1px solid ${textColor || '#1890ff'}`,
          background: '#fff',
          padding: '4px 8px',
          fontSize: isMultiline ? 14 : 14,
          fontWeight: 'inherit',
          outline: 'none',
          borderRadius: 4,
          boxSizing: 'border-box',
          color: textColor || '#000',
          cursor: 'text',
          resize: isMultiline ? 'vertical' : 'none',
          minHeight: isMultiline ? 60 : 'auto',
          ...style
        }}
        rows={isMultiline ? 3 : undefined}
      />
    );
  }

  return (
    <div
      onDoubleClick={(e) => { stopEvents(e); setIsEditing(true); }}
      style={{
        cursor: 'text',
        padding: '4px 8px',
        minHeight: 20,
        color: textColor || '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style
      }}
    >
      {value ?? '—'}
    </div>
  );
};

export default function ContainerElement({ element, isSelected, children }) {
  const updateElementProps = useStore((s) => s.updateElementProps);
  
  const props = element?.props || definition.defaultProps;
  const { text, bgColor, textColor, padding } = props;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: bgColor || '#f5f5f5',
        color: textColor || '#000',
        padding: Number(padding) || 16,
        boxSizing: 'border-box',
        borderRadius: 8,
        border: isSelected ? '2px dashed #1890ff' : '1px dashed #d9d9d9',
        overflow: 'hidden',
        position: 'relative'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Текстовая область (редактируемая) */}
      <EditableText
        value={text}
        textColor={textColor}
        onSave={(val) => updateElementProps(element.id, { text: val })}
        style={{ width: '100%', marginBottom: children ? 8 : 0 }}
      />
      
      {/* Место для вложенных элементов (если контейнер пуст, можно показать подсказку) */}
      <div style={{ flex: 1, pointerEvents: 'auto' }}>
        {children}
      </div>
    </div>
  );
}