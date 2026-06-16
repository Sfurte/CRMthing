import { useState, useRef, useEffect } from 'react';
import { Card } from 'antd';
import { CreditCardOutlined } from '@ant-design/icons';
import useStore from '../store';
import { useLang } from '../hooks/useLang';
import { textBlock, textStyles } from './blocks/textStyle';
import './card.css';

export const definition = {
  type: 'Card',
  label: 'card',
  icon: CreditCardOutlined,
  defaultProps: {
    title: 'title',
    content: 'cardText',
    bgColor: '#ffffff',
    ...textBlock.defaultProps,
  },
  properties: [
    { name: 'title', label: 'title', type: 'text' },
    { name: 'content', label: 'content', type: 'textarea' },
    { name: 'bgColor', label: 'bgColor', type: 'color' },
    ...textBlock.properties,
  ],
};

const EditableText = ({ value, onSave, isMultiline, style, elementProps }) => {
  const { t } = useLang();
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

  // Переводим значение, если это ключ
  const displayValue = t(value) !== value ? t(value) : value;

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
      {displayValue ?? '—'}
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
      className="element-card"
      style={{ backgroundColor: bgColor || '#fff' }}
      styles={{ body: { flex: 1, overflow: 'auto', padding: '12px 16px' } }}
    >
      <EditableText value={content} elementProps={props} onSave={(val) => updateElementProps(element.id, { content: val })} isMultiline />
    </Card>
  );
}