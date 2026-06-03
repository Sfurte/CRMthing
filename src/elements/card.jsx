import { useState, useRef, useEffect } from 'react';
import { Card } from 'antd';
import { CreditCardOutlined } from '@ant-design/icons';
import useStore from '../store';

export const definition = {
  type: 'Card',
  label: 'Карточка',
  icon: CreditCardOutlined,
  defaultProps: {
    title: 'Заголовок',
    content: 'Текст карточки',
    bgColor: '#ffffff',   // Белый фон по умолчанию
    textColor: '#000000', // Черный текст по умолчанию
  },
  properties: [
    { name: 'title', label: 'Заголовок', type: 'text' },
    { name: 'content', label: 'Текст', type: 'textarea' },
    { name: 'bgColor', label: 'Фон карточки', type: 'color' },
    { name: 'textColor', label: 'Цвет текста', type: 'color' },
  ],
};

// 🔹 Компонент редактируемого текста (адаптивный к цвету фона)
const EditableText = ({ value, onSave, isMultiline = false, style, textColor }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        if (isMultiline) inputRef.current?.select();
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [isEditing, isMultiline]);

  useEffect(() => { setEditValue(value); }, [value]);

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
          border: `1px solid ${textColor || '#1890ff'}`, // Рамка в цвет текста
          background: '#fff', // Всегда белый фон ввода для удобства
          padding: '4px 8px',
          fontSize: isMultiline ? 14 : 16,
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
        ...style 
      }}
    >
      {value ?? '—'}
    </div>
  );
};

export default function CardElement({ element, isSelected }) {
  const updateElementProps = useStore((s) => s.updateElementProps);
  
  const props = element?.props || definition.defaultProps;
  const { title, content, bgColor, textColor } = props;

  return (
    <Card
      title={
        <EditableText
          value={title}
          textColor={textColor}
          onSave={(val) => updateElementProps(element.id, { title: val })}
          style={{ fontWeight: 600, padding: 0 }}
        />
      }
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: bgColor || '#fff',
        color: textColor || '#000',
        border: '1px solid #d9d9d9',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
      }}
      bodyStyle={{
        flex: 1,
        overflow: 'auto',
        padding: '12px 16px',
        color: textColor || '#000',
      }}
    >
      <EditableText
        value={content}
        textColor={textColor}
        onSave={(val) => updateElementProps(element.id, { content: val })}
        isMultiline={true}
        style={{ width: '100%', minHeight: '100%', background: 'transparent' }}
      />
    </Card>
  );
}