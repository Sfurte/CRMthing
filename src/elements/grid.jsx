import { useState, useRef, useEffect } from 'react';
import { AppstoreOutlined } from '@ant-design/icons';
import useStore from '../store';
import './grid.css';

export const definition = {
  type: 'Grid',
  label: 'Сетка',
  icon: AppstoreOutlined,
  defaultProps: {
    rows: 3,
    cols: 3,
    gap: 12,
    textColor: '#000000',
    bgColor: '#f0f5ff',      // Фон сетки
    cellBgColor: '#ffffff',  // Фон ячеек
    // Массив данных ячеек (плоский список для простоты хранения)
    cellData: [
      'Ячейка 1.1', 'Ячейка 1.2', 'Ячейка 1.3',
      'Ячейка 2.1', 'Ячейка 2.2', 'Ячейка 2.3',
      'Ячейка 3.1', 'Ячейка 3.2', 'Ячейка 3.3',
    ],
  },
  properties: [
    { name: 'rows', label: 'Строки', type: 'number', min: 1, max: 20 },
    { name: 'cols', label: 'Столбцы', type: 'number', min: 1, max: 10 },
    { name: 'gap', label: 'Отступ (px)', type: 'number', min: 0, max: 50 },
    { name: 'textColor', label: 'Цвет текста', type: 'color' },
    { name: 'bgColor', label: 'Фон сетки', type: 'color' },
    { name: 'cellBgColor', label: 'Фон ячеек', type: 'color' },
  ],
};

// 🔹 Компонент редактируемой ячейки
const EditableCell = ({ value, onSave, style, textColor, bgColor, isEditing, onFocus }) => {
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef(null);

  // Синхронизация внешнего значения с локальным стейтом
  useEffect(() => {
    setEditValue(value);
  }, [value]);

  // Автофокус при включении режима редактирования
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
      onFocus(); // Сообщаем родителю, что фокус установлен
    }
  }, [isEditing, onFocus]);

  const handleSave = () => {
    onSave(editValue);
  };

  const stopEvents = (e) => {
    e.stopPropagation();
    e.nativeEvent?.stopImmediatePropagation?.();
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: bgColor || '#fff',
        borderRadius: 4,
        border: isEditing ? `2px solid ${textColor || '#1890ff'}` : '1px solid #d9d9d9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        transition: 'all 0.2s',
        ...style
      }}
      onDoubleClick={(e) => {
        // Если уже редактируем, ничего не делаем (фокус и так здесь)
        if (!isEditing) {
           stopEvents(e);
           onFocus(); // Активируем режим редактирования через родителя
        }
      }}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === 'Enter') { e.preventDefault(); handleSave(); }
            if (e.key === 'Escape') { setEditValue(value); onFocus(); } // Выход из режима
            stopEvents(e);
          }}
          onPointerDown={stopEvents}
          onClick={stopEvents}
          style={{
            width: '90%',
            border: 'none',
            background: 'transparent',
            textAlign: 'center',
            color: textColor || '#000',
            fontSize: 12,
            outline: 'none',
            padding: 4
          }}
        />
      ) : (
        <div style={{
          color: textColor || '#000',
          fontSize: 12,
          padding: 4,
          textAlign: 'center',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          width: '100%'
        }}>
          {value ?? ''}
        </div>
      )}
    </div>
  );
};

export default function GridElement({ element, isSelected }) {
  const updateElementProps = useStore((s) => s.updateElementProps);
  const props = element?.props || definition.defaultProps;

  const rows = Math.max(1, Math.min(20, Number(props.rows) || 3));
  const cols = Math.max(1, Math.min(10, Number(props.cols) || 3));
  const gap = Number(props.gap) || 12;
  const totalCells = rows * cols;

  // Гарантируем наличие данных для всех ячеек
  const cellData = Array.isArray(props.cellData) ? props.cellData : [];
  const normalizedData = Array.from({ length: totalCells }, (_, i) => 
    cellData[i] ?? `Ячейка ${Math.floor(i / cols) + 1}.${(i % cols) + 1}`
  );

  // Состояние: какая ячейка сейчас редактируется (индекс)
  const [editingIndex, setEditingIndex] = useState(null);

  const handleCellSave = (index, newValue) => {
    const newData = [...normalizedData];
    newData[index] = newValue;
    updateElementProps(element.id, { cellData: newData });
    setEditingIndex(null); // Завершаем редактирование
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        padding: 8,
        boxSizing: 'border-box',
        background: props.bgColor || '#f0f5ff',
        borderRadius: 8,
        pointerEvents: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}
      onClick={(e) => e.stopPropagation()} // Клик по пустому месту не мешает
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          gap: `${gap}px`,
          width: '100%',
          height: '100%',
        }}
      >
        {normalizedData.map((text, index) => (
          <EditableCell
            key={index}
            value={text}
            textColor={props.textColor}
            bgColor={props.cellBgColor}
            isEditing={editingIndex === index}
            onFocus={() => setEditingIndex(index)}
            onSave={(val) => handleCellSave(index, val)}
          />
        ))}
      </div>
    </div>
  );
}