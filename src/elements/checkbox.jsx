import { useState, useRef, useEffect } from 'react';
import { Checkbox } from 'antd';
import { CheckSquareOutlined, PlusOutlined } from '@ant-design/icons';
import useStore from '../store';
import { textBlock, textStyles } from './blocks/textStyle';
import './checkbox.css';

export const definition = {
  type: 'Checkbox',
  label: 'Флажок',
  icon: CheckSquareOutlined,
  defaultProps: {
    options: [
      { label: 'Опция 1', value: 'opt1', checked: true },
      { label: 'Опция 2', value: 'opt2', checked: false },
      { label: 'Опция 3', value: 'opt3', checked: false },
    ],
    direction: 'vertical',
    bgColor: 'transparent',
    ...textBlock.defaultProps,
  },
  properties: [
    { name: 'direction', label: 'Расположение', type: 'select', options: ['horizontal', 'vertical'] },
    { name: 'bgColor', label: 'Фон', type: 'color' },
    ...textBlock.properties,
  ],
};

const EditableLabel = ({ value, onSave, style: tsStyle }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef(null);

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

  const handleSave = () => {
    if (editValue.trim()) onSave(editValue.trim());
    setIsEditing(false);
  };

  const stopEvents = (e) => {
    e.stopPropagation();
    e.nativeEvent?.stopImmediatePropagation?.();
  };

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
          stopEvents(e);
        }}
        onPointerDown={stopEvents}
        onClick={stopEvents}
        className="element-checkbox__label-input"
        style={tsStyle}
      />
    );
  }

  return (
    <span
      onDoubleClick={(e) => { stopEvents(e); setIsEditing(true); }}
      className="element-checkbox__label"
      style={tsStyle}
    >
      {value}
    </span>
  );
};

export default function CheckboxElement({ element, isSelected }) {
  const updateElementProps = useStore((s) => s.updateElementProps);
  const props = element?.props || definition.defaultProps;
  const ts = textStyles(props);

  const {
    options = definition.defaultProps.options,
    direction = 'vertical',
    bgColor = 'transparent',
  } = props;

  const handleChange = (index) => (e) => {
    const newOptions = options.map((opt, i) =>
      i === index ? { ...opt, checked: e.target.checked } : opt
    );
    updateElementProps(element.id, { options: newOptions });
  };

  const addOption = () => {
    const newOptions = [...options, {
      label: `Опция ${options.length + 1}`,
      value: `opt${Date.now()}`,
      checked: false,
    }];
    updateElementProps(element.id, { options: newOptions });
  };

  const removeOption = (index) => {
    if (options.length <= 1) return;
    const newOptions = options.filter((_, i) => i !== index);
    updateElementProps(element.id, { options: newOptions });
  };

  const handleLabelSave = (index, newLabel) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], label: newLabel };
    updateElementProps(element.id, { options: newOptions });
  };

  return (
    <div className="element-checkbox" style={{ backgroundColor: bgColor || 'transparent', pointerEvents: 'auto' }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className={'element-checkbox__group element-checkbox__group--' + direction}>
        {options.map((option, index) => (
          <div key={option.value} className="element-checkbox__item">
            <Checkbox
              checked={option.checked}
              onChange={handleChange(index)}
            />
            <EditableLabel
              value={option.label}
              onSave={(val) => handleLabelSave(index, val)}
              style={ts}
            />
            {isSelected && options.length > 1 && (
              <button
                className="element-checkbox__remove-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  removeOption(index);
                }}
                title="Удалить опцию"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      {isSelected && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            addOption();
          }}
          style={{
            marginTop: 8, padding: '4px 12px', border: '1px dashed var(--accent)',
            borderRadius: 4, background: 'transparent', color: 'var(--accent)',
            cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4,
          }}
        >
          <PlusOutlined /> Добавить опцию
        </button>
      )}
    </div>
  );
}
