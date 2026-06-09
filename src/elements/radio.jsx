import { useState, useRef, useEffect } from 'react';
import { Radio } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons'; // ✅ Исправлено
import useStore from '../store';
import './radio.css';

export const definition = {
  type: 'Radio',
  label: 'Переключатель',
  icon: CheckCircleOutlined, // ✅ И здесь тоже исправлено
  defaultProps: {
    options: [
      { label: 'Вариант 1', value: 'option1' },
      { label: 'Вариант 2', value: 'option2' },
      { label: 'Вариант 3', value: 'option3' },
    ],
    defaultValue: 'option1',
    direction: 'horizontal', // 'horizontal' | 'vertical'
    textColor: '#000000',
    bgColor: 'transparent',
  },
  properties: [
    { name: 'direction', label: 'Расположение', type: 'select', options: ['horizontal', 'vertical'] },
    { name: 'textColor', label: 'Цвет текста', type: 'color' },
    { name: 'bgColor', label: 'Фон', type: 'color' },
  ],
};

// 🔹 Компонент редактируемой метки опции
const EditableLabel = ({ value, onSave, style, textColor }) => {
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
        style={{
          width: '100%',
          border: `1px solid ${textColor || '#1890ff'}`,
          background: '#fff',
          padding: '2px 6px',
          fontSize: 13,
          outline: 'none',
          borderRadius: 3,
          boxSizing: 'border-box',
          color: '#000',
          cursor: 'text',
          ...style
        }}
      />
    );
  }

  return (
    <span
      onDoubleClick={(e) => { stopEvents(e); setIsEditing(true); }}
      style={{ cursor: 'text', padding: '2px 4px', color: textColor || '#000', ...style }}
    >
      {value}
    </span>
  );
};

export default function RadioElement({ element, isSelected }) {
  const updateElementProps = useStore((s) => s.updateElementProps);
  const props = element?.props || definition.defaultProps;

  const {
    options = definition.defaultProps.options,
    defaultValue = 'option1',
    direction = 'horizontal',
    textColor = '#000000',
    bgColor = 'transparent',
  } = props;

  const [selectedValue, setSelectedValue] = useState(defaultValue);

  // Обновляем selectedValue при изменении defaultValue извне
  useEffect(() => {
    setSelectedValue(defaultValue);
  }, [defaultValue]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setSelectedValue(newValue);
    updateElementProps(element.id, { defaultValue: newValue });
  };

  // Добавление новой опции
  const addOption = () => {
    const newOptions = [...options, { 
      label: `Вариант ${options.length + 1}`, 
      value: `option${Date.now()}` 
    }];
    updateElementProps(element.id, { options: newOptions });
  };

  // Удаление опции
  const removeOption = (index) => {
    if (options.length <= 1) return;
    const newOptions = options.filter((_, i) => i !== index);
    updateElementProps(element.id, { options: newOptions });
  };

  // Редактирование метки опции
  const handleLabelSave = (index, newLabel) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], label: newLabel };
    updateElementProps(element.id, { options: newOptions });
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        padding: 8,
        boxSizing: 'border-box',
        backgroundColor: bgColor || 'transparent',
        borderRadius: 4,
        pointerEvents: 'auto',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <Radio.Group
        onChange={handleChange}
        value={selectedValue}
        direction={direction}
        style={{ 
          display: 'flex', 
          flexDirection: direction === 'vertical' ? 'column' : 'row',
          gap: direction === 'vertical' ? 12 : 16,
          alignItems: 'flex-start'
        }}
      >
        {options.map((option, index) => (
          <div 
            key={option.value} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 6,
              position: 'relative'
            }}
          >
            <Radio value={option.value} />
            <EditableLabel
              value={option.label}
              onSave={(val) => handleLabelSave(index, val)}
              textColor={textColor}
              style={{ fontSize: 14 }}
            />
            
            {/* Кнопка удаления опции (показывается при выделении элемента) */}
            {isSelected && options.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeOption(index);
                }}
                style={{
                  position: 'absolute',
                  right: -18,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  border: '1px solid #ff4d4f',
                  background: '#fff',
                  color: '#ff4d4f',
                  fontSize: 12,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                  lineHeight: 1
                }}
                title="Удалить вариант"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </Radio.Group>

      {/* Кнопка добавления опции (показывается при выделении) */}
      {isSelected && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            addOption();
          }}
          style={{
            marginTop: 12,
            padding: '4px 12px',
            background: '#fff',
            border: '1px dashed #1890ff',
            borderRadius: 4,
            color: '#1890ff',
            fontSize: 12,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#e6f7ff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#fff';
          }}
        >
          + Добавить вариант
        </button>
      )}
    </div>
  );
}