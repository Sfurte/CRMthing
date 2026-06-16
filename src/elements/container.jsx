import { useState, useRef, useEffect } from 'react';
import { BorderOutlined } from '@ant-design/icons';
import useStore from '../store';
import { useLang } from '../hooks/useLang';
import { textBlock, textStyles } from './blocks/textStyle';
import './container.css';

export const definition = {
  type: 'Container',
  label: 'container',
  icon: BorderOutlined,
  defaultProps: {
    text: 'container',
    bgColor: '#f5f5f5',
    padding: 16,
    ...textBlock.defaultProps,
  },
  properties: [
    { name: 'text', label: 'content', type: 'text' },
    { name: 'bgColor', label: 'bgColor', type: 'color' },
    { name: 'padding', label: 'padding', type: 'number', min: 0, max: 50 },
    ...textBlock.properties,
  ],
};

const EditableText = ({ value, onSave, style, elementProps }) => {
  const { t } = useLang();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef(null);
  const ts = textStyles(elementProps);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [isEditing]);

  useEffect(() => { setEditValue(value); }, [value]);

  const handleSave = () => { onSave(editValue); setIsEditing(false); };
  const stop = (e) => { e.stopPropagation(); e.nativeEvent?.stopImmediatePropagation?.(); };

  const displayValue = t(value) !== value ? t(value) : value;

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={(e) => {
          if (e.key === 'Enter') { e.preventDefault(); handleSave(); }
          if (e.key === 'Escape') { setEditValue(value); setIsEditing(false); }
          stop(e);
        }}
        onPointerDown={stop}
        onClick={stop}
        style={{
          width: '100%', border: '1px solid #1890ff', background: '#fff',
          padding: '2px 4px', ...ts, outline: 'none', borderRadius: 2,
          boxSizing: 'border-box', cursor: 'text', ...style,
        }}
      />
    );
  }

  return (
    <div onDoubleClick={(e) => { stop(e); setIsEditing(true); }}
      style={{ cursor: 'text', padding: '2px 4px', minHeight: 20, ...ts, ...style }}
    >
      {displayValue ?? '—'}
    </div>
  );
};

export default function ContainerElement({ element, isSelected }) {
  const updateElementProps = useStore((s) => s.updateElementProps);
  const props = element?.props || definition.defaultProps;
  const { text, bgColor, padding = 16 } = props;

  return (
    <div
      className="element-container"
      style={{ background: bgColor || '#f5f5f5' }}
    >
      {text && (
        <div
          style={{
            padding: `${padding}px ${padding}px 0 ${padding}px`,
            userSelect: 'none',
          }}
        >
          <EditableText
            value={text}
            elementProps={props}
            onSave={(val) => updateElementProps(element.id, { text: val })}
          />
        </div>
      )}
    </div>
  );
}