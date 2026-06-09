import { useState, useRef, useEffect } from 'react';
import { AppstoreOutlined } from '@ant-design/icons';
import useStore from '../store';
import { textBlock, textStyles } from './blocks/textStyle';
import './grid.css';

export const definition = {
  type: 'Grid',
  label: 'Сетка',
  icon: AppstoreOutlined,
  defaultProps: {
    rows: 3,
    cols: 3,
    gap: 12,
    bgColor: '#f0f5ff',
    cellBgColor: '#ffffff',
    cellData: [
      'Ячейка 1.1', 'Ячейка 1.2', 'Ячейка 1.3',
      'Ячейка 2.1', 'Ячейка 2.2', 'Ячейка 2.3',
      'Ячейка 3.1', 'Ячейка 3.2', 'Ячейка 3.3',
    ],
    ...textBlock.defaultProps,
  },
  properties: [
    { name: 'rows', label: 'Строки', type: 'number', min: 1, max: 20 },
    { name: 'cols', label: 'Столбцы', type: 'number', min: 1, max: 10 },
    { name: 'gap', label: 'Отступ (px)', type: 'number', min: 0, max: 50 },
    { name: 'bgColor', label: 'Фон сетки', type: 'color' },
    { name: 'cellBgColor', label: 'Фон ячеек', type: 'color' },
    ...textBlock.properties,
  ],
};

const EditableCell = ({ value, onSave, style, textColor, cellBgColor, isEditing, onFocus }) => {
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => { setEditValue(value); }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
      onFocus();
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
        background: cellBgColor || '#fff',
        borderRadius: 4,
        border: isEditing ? `2px solid ${textColor || '#1890ff'}` : '1px solid #d9d9d9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        transition: 'all 0.2s',
        ...style,
      }}
      onDoubleClick={(e) => {
        if (!isEditing) {
          stopEvents(e);
          onFocus();
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
            if (e.key === 'Escape') { setEditValue(value); onFocus(); }
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
            padding: 4,
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
          width: '100%',
          ...style,
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
  const ts = textStyles(props);

  const rows = Math.max(1, Math.min(20, Number(props.rows) || 3));
  const cols = Math.max(1, Math.min(10, Number(props.cols) || 3));
  const gap = Number(props.gap) || 12;
  const totalCells = rows * cols;

  const cellData = Array.isArray(props.cellData) ? props.cellData : [];
  const normalizedData = Array.from({ length: totalCells }, (_, i) =>
    cellData[i] ?? `Ячейка ${Math.floor(i / cols) + 1}.${(i % cols) + 1}`
  );

  const [editingIndex, setEditingIndex] = useState(null);

  const handleCellSave = (index, newValue) => {
    const newData = [...normalizedData];
    newData[index] = newValue;
    updateElementProps(element.id, { cellData: newData });
    setEditingIndex(null);
  };

  return (
    <div
      className="element-grid"
      style={{ background: props.bgColor || '#f0f5ff', pointerEvents: 'auto' }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="element-grid__inner"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          gap: `${gap}px`,
        }}
      >
        {normalizedData.map((text, index) => (
          <EditableCell
            key={index}
            value={text}
            textColor={ts.color}
            cellBgColor={props.cellBgColor}
            style={{
              fontWeight: ts.fontWeight,
              fontStyle: ts.fontStyle,
              fontSize: ts.fontSize,
            }}
            isEditing={editingIndex === index}
            onFocus={() => setEditingIndex(index)}
            onSave={(val) => handleCellSave(index, val)}
          />
        ))}
      </div>
    </div>
  );
}
