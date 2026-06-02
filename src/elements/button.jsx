import { useState, useEffect, useRef } from 'react';
import { Button } from 'antd';
import { InteractionOutlined } from '@ant-design/icons';
import useStore from '../store';

export const definition = {
  type: 'Button',
  label: 'Кнопка',
  icon: InteractionOutlined,
  defaultProps: {
    text: 'Нажми меня',
    type: 'primary',
    size: 'large',
  },
  properties: [
    { name: 'text', label: 'Текст', type: 'text' },
    { name: 'type', label: 'Тип', type: 'select', options: ['primary', 'default', 'dashed', 'text', 'link'] },
  ],
};

export default function ButtonElement({ element, isSelected }) {
  const { text = 'Нажми меня', type = 'primary' } = element.props || {};
  const updateElementProps = useStore((s) => s.updateElementProps);

  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);
  const editValueRef = useRef(text);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [isEditing]);

  useEffect(() => {
    editValueRef.current = text;
    if (inputRef.current && !isEditing) {
      inputRef.current.value = text;
    }
  }, [text, isEditing]);

  const saveText = () => {
    const val = editValueRef.current.trim();
    if (val) updateElementProps(element.id, { text: val });
    setIsEditing(false);
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsEditing(true);
  };

  // 🔹 РЕЖИМ РЕДАКТИРОВАНИЯ
  if (isEditing) {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <input
          ref={inputRef}
          type="text"
          defaultValue={text}
          onChange={(e) => {
            editValueRef.current = e.target.value;
          }}
          onBlur={saveText}
          onKeyDown={(e) => {
            if (e.key === 'Enter') { e.preventDefault(); saveText(); }
            e.stopPropagation();
          }}
          onPointerDownCapture={(e) => e.stopPropagation()}
          onMouseDownCapture={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            background: 'rgba(255, 255, 255, 0.9)', // Полупрозрачный белый фон для читаемости
            textAlign: 'center',
            fontSize: 16,
            fontWeight: 500,
            outline: 'none',
            color: '#000', // Чёрный текст всегда виден
            cursor: 'text',
            fontFamily: 'inherit',
            pointerEvents: 'auto',
            borderRadius: 4,
            padding: '4px 8px',
            // Убираем синее выделение
            WebkitUserSelect: 'text',
            MozUserSelect: 'text',
            userSelect: 'text',
          }}
        />
      </div>
    );
  }

  // 🔹 ОБЫЧНЫЙ РЕЖИМ
  return (
    <div 
      style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onDoubleClick={handleDoubleClick}
    >
      <Button
        type={type}
        block
        style={{
          width: '100%',
          height: '100%',
          fontSize: 16,
          fontWeight: 500,
          pointerEvents: 'auto',
        }}
      >
        {text}
      </Button>
    </div>
  );
}