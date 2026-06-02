import { useState, useRef, useEffect } from 'react';
import { FontSizeOutlined } from '@ant-design/icons';
import useStore from '../store';

export const definition = {
  type: 'Text',
  label: 'Текст',
  icon: FontSizeOutlined,
  defaultProps: {
    content: 'Введите текст',
    fontSize: 16,
    textColor: '#000000',
    bgColor: 'transparent',
    fontWeight: 400,
    textAlign: 'left', // 🆕 Выравнивание по умолчанию
  },
  properties: [
    { name: 'content', label: 'Текст', type: 'textarea' },
    { name: 'fontSize', label: 'Размер шрифта', type: 'number', min: 8, max: 100 },
    { name: 'fontWeight', label: 'Жирность', type: 'select', options: [300, 400, 500, 700] },
    { name: 'textAlign', label: 'Выравнивание', type: 'select', options: ['left', 'center', 'right', 'justify'] }, // 🆕
    { name: 'textColor', label: 'Цвет текста', type: 'color' },
    { name: 'bgColor', label: 'Фон', type: 'color' },
  ],
};

export default function TextElement({ element, isSelected }) {
  const updateElementProps = useStore((s) => s.updateElementProps);
  const props = element?.props || definition.defaultProps;

  const { content, fontSize, textColor, bgColor, fontWeight, textAlign } = props;

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(content);
  const textareaRef = useRef(null);

  useEffect(() => { setEditValue(content); }, [content]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    updateElementProps(element.id, { content: editValue });
    setIsEditing(false);
  };

  const stopEvents = (e) => {
    e.stopPropagation();
    e.nativeEvent?.stopImmediatePropagation?.();
  };

  // Базовые стили текста (применяются и к просмотру, и к редактированию)
  const textStyle = {
    color: textColor || '#000',
    fontSize: Number(fontSize) || 16,
    fontWeight: Number(fontWeight) || 400,
    textAlign: textAlign || 'left', // 🆕 Применяем выравнивание
    lineHeight: 1.4,
    width: '100%',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: bgColor || 'transparent',
        padding: 4,
        boxSizing: 'border-box',
        borderRadius: 4,
        overflow: 'hidden',
      }}
      onDoubleClick={(e) => { stopEvents(e); setIsEditing(true); }}
      onClick={(e) => e.stopPropagation()}
    >
      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSave(); }
            if (e.key === 'Escape') { setEditValue(content); setIsEditing(false); }
            stopEvents(e);
          }}
          onPointerDown={stopEvents}
          onClick={stopEvents}
          style={{
            ...textStyle,
            background: 'transparent',
            border: '1px dashed rgba(0,0,0,0.2)', // Пунктирная рамка в режиме редактирования
            outline: 'none',
            resize: 'none',
            cursor: 'text',
            padding: 0,
            margin: 0,
          }}
        />
      ) : (
        <div style={{ ...textStyle, cursor: 'text' }}>
          {content}
        </div>
      )}
    </div>
  );
}