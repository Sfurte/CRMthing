import { useState, useRef, useEffect } from 'react';
import { Card } from 'antd';
import { CreditCardOutlined } from '@ant-design/icons';
import useStore from '../store';
import { textBlock, textStyles } from './blocks/textStyle';

export const definition = {
  type: 'Card',
  label: 'Карточка',
  icon: CreditCardOutlined,
  defaultProps: {
    title: 'Заголовок',
    content: 'Текст карточки',
    bgColor: '#ffffff',
    ...textBlock.defaultProps,
  },
  properties: [
    { name: 'title', label: 'Заголовок', type: 'text' },
    { name: 'content', label: 'Текст', type: 'textarea' },
    { name: 'bgColor', label: 'Фон карточки', type: 'color' },
    ...textBlock.properties,
  ],
};

const EditableText = ({ value, onSave, isMultiline, style, elementProps }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef(null);
  const ts = textStyles(elementProps);

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

  const handleSave = () => { onSave(editValue); setIsEditing(false); };

  const stop = (e) => { e.stopPropagation(); e.nativeEvent?.stopImmediatePropagation?.(); };

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
          stop(e);
        }}
        onPointerDown={stop}
        onClick={stop}
        style={{
          width: '100%', border: '1px solid #1890ff', background: '#fff',
          padding: '4px 8px', ...ts, outline: 'none', borderRadius: 4,
          boxSizing: 'border-box', cursor: 'text',
          resize: isMultiline ? 'vertical' : 'none',
          minHeight: isMultiline ? 60 : 'auto', ...style,
        }}
        rows={isMultiline ? 3 : undefined}
      />
    );
  }

  return (
    <div onDoubleClick={(e) => { stop(e); setIsEditing(true); }}
      style={{ cursor: 'text', padding: '4px 8px', minHeight: 20, ...ts, ...style }}
    >
      {value ?? '—'}
    </div>
  );
};

export default function CardElement({ element }) {
  const updateElementProps = useStore((s) => s.updateElementProps);
  const props = element?.props || definition.defaultProps;
  const { title, content, bgColor } = props;

  return (
    <Card
      title={<EditableText value={title} elementProps={props} onSave={(val) => updateElementProps(element.id, { title: val })} style={{ fontWeight: 600, padding: 0 }} />}
      style={{
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
        backgroundColor: bgColor || '#fff', border: '1px solid #d9d9d9',
        boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)',
      }}
      styles={{ body: { flex: 1, overflow: 'auto', padding: '12px 16px' } }}
    >
      <EditableText value={content} elementProps={props} onSave={(val) => updateElementProps(element.id, { content: val })} isMultiline style={{ width: '100%', minHeight: '100%', background: 'transparent' }} />
    </Card>
  );
}
