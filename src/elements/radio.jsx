import { useState, useRef, useEffect } from 'react';
import { Radio } from 'antd';
import { CheckCircleOutlined, PlusOutlined } from '@ant-design/icons';
import useStore from '../store';
import { textBlock, textStyles } from './blocks/textStyle';
import './radio.css';

export const definition = {
  type: 'Radio',
  label: 'Переключатель',
  icon: CheckCircleOutlined,
  defaultProps: {
    options: [
      { label: 'Вариант 1', value: 'option1' },
      { label: 'Вариант 2', value: 'option2' },
      { label: 'Вариант 3', value: 'option3' },
    ],
    defaultValue: 'option1',
    direction: 'horizontal',
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
        className="element-radio__label-input"
        style={tsStyle}
      />
    );
  }

  return (
    <span
      onDoubleClick={(e) => { stopEvents(e); setIsEditing(true); }}
      className="element-radio__label"
      style={tsStyle}
    >
      {value}
    </span>
  );
};

export default function RadioElement({ element, isSelected }) {
  const updateElementProps = useStore((s) => s.updateElementProps);
  const props = element?.props || definition.defaultProps;
  const ts = textStyles(props);

  const {
    options = definition.defaultProps.options,
    defaultValue = 'option1',
    direction = 'horizontal',
    bgColor = 'transparent',
  } = props;

  const [selectedValue, setSelectedValue] = useState(defaultValue);

  useEffect(() => {
    setSelectedValue(defaultValue);
  }, [defaultValue]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setSelectedValue(newValue);
    updateElementProps(element.id, { defaultValue: newValue });
  };

  const addOption = () => {
    const newOptions = [...options, { 
      label: `Вариант ${options.length + 1}`, 
      value: `option${Date.now()}` 
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
    <div className="element-radio" style={{ backgroundColor: bgColor || 'transparent', pointerEvents: 'auto' }}
      onClick={(e) => e.stopPropagation()}
    >
      <Radio.Group
        onChange={handleChange}
        value={selectedValue}
        direction={direction}
        className={'element-radio__group element-radio__group--' + direction}
      >
        {options.map((option, index) => (
          <div key={option.value} className="element-radio__item">
            <Radio value={option.value} />
            <EditableLabel
              value={option.label}
              onSave={(val) => handleLabelSave(index, val)}
              style={ts}
            />
            {isSelected && options.length > 1 && (
              <button
                className="element-radio__remove-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  removeOption(index);
                }}
                title="Удалить вариант"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </Radio.Group>

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
          <PlusOutlined /> Добавить вариант
        </button>
      )}
    </div>
  );
}
