import { useState, useRef, useEffect } from 'react';
import { FontSizeOutlined } from '@ant-design/icons';
import useStore from '../store';
import { textBlock, textStyles } from './blocks/textStyle';
import './text.css';

export const definition = {
  type: 'Text',
  label: 'Текст',
  icon: FontSizeOutlined,
  defaultProps: {
    content: 'Введите текст',
    textAlign: 'left',
    bgColor: 'transparent',
    ...textBlock.defaultProps,
  },
  properties: [
    { name: 'content', label: 'Текст', type: 'textarea' },
    { name: 'textAlign', label: 'Выравнивание', type: 'select', options: ['left', 'center', 'right', 'justify'] },
    { name: 'bgColor', label: 'Фон', type: 'color' },
    ...textBlock.properties,
  ],
};

export default function TextElement({ element }) {
  const updateElementProps = useStore((s) => s.updateElementProps);
  const props = element?.props || definition.defaultProps;

  const { content, textAlign, bgColor } = props;
  const ts = textStyles(props);

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(content);
  const textareaRef = useRef(null);

  useEffect(() => { setEditValue(content); }, [content]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      const timer = setTimeout(() => {
        textareaRef.current?.focus();
        textareaRef.current?.select();
      }, 10);
      return () => clearTimeout(timer);
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

  const textStyle = {
    ...ts,
    textAlign: textAlign || 'left',
    lineHeight: 1.4,
    width: '100%',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  };

  return (
    <div
      className="element-text"
      style={{ backgroundColor: bgColor || 'transparent' }}
      onDoubleClick={(e) => { stopEvents(e); setIsEditing(true); }}
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
          }}
          className="element-text__textarea"
        />
      ) : (
        <div className="element-text__content" style={{ ...textStyle, cursor: 'text' }}>
          {content}
        </div>
      )}
    </div>
  );
}
