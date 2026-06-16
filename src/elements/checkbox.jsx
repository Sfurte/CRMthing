import { useState, useRef, useEffect } from 'react';
import { Checkbox } from 'antd';
import { CheckSquareOutlined, PlusOutlined } from '@ant-design/icons';
import useStore from '../store';
import { useLang } from '../hooks/useLang';
import { textBlock, textStyles } from './blocks/textStyle';
import './checkbox.css';

export const definition = {
  type: 'Checkbox',
  label: 'checkbox',
  icon: CheckSquareOutlined,
  defaultWidth: 140,
  defaultHeight: 100,
  defaultProps: {
    options: [
      { label: 'option 1', value: 'opt1', checked: true },
      { label: 'option 2', value: 'opt2', checked: false },
      { label: 'option 3', value: 'opt3', checked: false },
    ],
    direction: 'vertical',
    bgColor: 'transparent',
    ...textBlock.defaultProps,
  },
  properties: [
    { name: 'direction', label: 'direction', type: 'select', options: ['horizontal', 'vertical'] },
    { name: 'bgColor', label: 'bgColor', type: 'color' },
    ...textBlock.properties,
  ],
};

// ✅ Останавливаем события ТОЛЬКО на интерактивных элементах
const stopDrag = (e) => {
  e.stopPropagation();
};

const EditableLabel = ({ value, onSave, style: tsStyle }) => {
  const { t } = useLang();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      const timer = setTimeout(() => { inputRef.current?.focus(); inputRef.current?.select(); }, 10);
      return () => clearTimeout(timer);
    }
  }, [isEditing]);
  useEffect(() => { setEditValue(value); }, [value]);

  const handleSave = () => { if (editValue.trim()) onSave(editValue.trim()); setIsEditing(false); };
  const stopEvents = (e) => { e.stopPropagation(); e.nativeEvent?.stopImmediatePropagation?.(); };

  const displayValue = t(value) !== value ? t(value) : value;

  if (isEditing) {
    return (
      <input ref={inputRef} type="text" value={editValue} onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSave(); } if (e.key === 'Escape') { setEditValue(value); setIsEditing(false); } stopEvents(e); }}
        onPointerDown={stopEvents} onClick={stopEvents}
        className="element-checkbox__label-input" style={tsStyle} />
    );
  }
  return (
    <span onDoubleClick={(e) => { stopEvents(e); setIsEditing(true); }}
      className="element-checkbox__label" style={tsStyle}>
      {displayValue}
    </span>
  );
};

export default function CheckboxElement({ element, isSelected }) {
  const { t } = useLang();
  const updateElementProps = useStore((s) => s.updateElementProps);
  const props = element?.props || definition.defaultProps;
  const ts = textStyles(props);

  const { options = definition.defaultProps.options, direction = 'vertical', bgColor = 'transparent' } = props;

  const handleChange = (index) => (e) => {
    updateElementProps(element.id, {
      options: options.map((opt, i) => i === index ? { ...opt, checked: e.target.checked } : opt)
    });
  };

  const addOption = () => {
    updateElementProps(element.id, {
      options: [...options, { label: `${t('option')} ${options.length + 1}`, value: `opt${Date.now()}`, checked: false }]
    });
  };
  const removeOption = (index) => {
    if (options.length <= 1) return;
    updateElementProps(element.id, { options: options.filter((_, i) => i !== index) });
  };
  const handleLabelSave = (index, newLabel) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], label: newLabel };
    updateElementProps(element.id, { options: newOptions });
  };

  return (
    <div className="element-checkbox" style={{ backgroundColor: bgColor || 'transparent' }}>
      <div className={'element-checkbox__group element-checkbox__group--' + direction}>
        {options.map((option, index) => (
          <div key={option.value} className="element-checkbox__item">
            {/* ✅ stopDrag только на Checkbox */}
            <Checkbox 
              checked={option.checked} 
              onChange={handleChange(index)}
              onPointerDown={stopDrag}
              onMouseDown={stopDrag}
            />
            <EditableLabel value={option.label} onSave={(val) => handleLabelSave(index, val)} style={ts} />
            {isSelected && options.length > 1 && (
              <button className="element-checkbox__remove-btn"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => { e.stopPropagation(); removeOption(index); }} title={t('deleteOption')}>×</button>
            )}
          </div>
        ))}
      </div>

      {isSelected && (
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); addOption(); }}
          style={{
            marginTop: 8, padding: '4px 12px', border: '1px dashed var(--accent)',
            borderRadius: 4, background: 'transparent', color: 'var(--accent)',
            cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4,
          }}
        >
          <PlusOutlined /> {t('addOption')}
        </button>
      )}
    </div>
  );
}