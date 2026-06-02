import { useState, useRef, useEffect } from 'react';
import { Table } from 'antd';
import useStore from '../store';

// 🔹 Определение элемента с новыми свойствами
export const definition = {
  type: 'Table',
  label: 'Таблица',
  defaultProps: {
    rowCount: 3,
    columnCount: 3,
    headers: ['Колонка 1', 'Колонка 2', 'Колонка 3'],
    data: [
      ['Ячейка 1.1', 'Ячейка 1.2', 'Ячейка 1.3'],
      ['Ячейка 2.1', 'Ячейка 2.2', 'Ячейка 2.3'],
      ['Ячейка 3.1', 'Ячейка 3.2', 'Ячейка 3.3'],
    ],
  },
  defaultWidth: 500,
  defaultHeight: 250,
  properties: [
    { name: 'rowCount', label: 'Количество строк', type: 'number', min: 1, max: 20 },
    { name: 'columnCount', label: 'Количество столбцов', type: 'number', min: 1, max: 10 },
  ],
};

// 🔹 Компонент редактируемого заголовка
const EditableHeader = ({ value, onSave, style }) => {
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
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
        }}
        onPointerDown={(e) => { e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); }}
        onClick={(e) => { e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); }}
        style={{
          width: '100%', border: '1px solid #1890ff', background: '#fff',
          padding: '4px 8px', fontSize: 12, fontWeight: 500, outline: 'none',
          borderRadius: 2, boxSizing: 'border-box', color: '#000', cursor: 'text', textAlign: 'left', ...style
        }}
      />
    );
  }

  return (
    <div
      onDoubleClick={(e) => { e.stopPropagation(); e.nativeEvent?.stopImmediatePropagation?.(); setIsEditing(true); }}
      style={{ cursor: 'text', padding: '4px 8px', minHeight: 20, fontWeight: 500, ...style }}
    >
      {value ?? '—'}
    </div>
  );
};

// 🔹 Компонент редактируемой ячейки
const EditableCell = ({ value, onSave, style }) => {
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
    onSave(editValue);
    setIsEditing(false);
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
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
        }}
        onPointerDown={(e) => { e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); }}
        onClick={(e) => { e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); }}
        style={{
          width: '100%', border: '1px solid #1890ff', background: '#fff',
          padding: '4px 8px', fontSize: 12, outline: 'none', borderRadius: 2,
          boxSizing: 'border-box', color: '#000', cursor: 'text', ...style
        }}
      />
    );
  }

  return (
    <div
      onDoubleClick={(e) => { e.stopPropagation(); e.nativeEvent?.stopImmediatePropagation?.(); setIsEditing(true); }}
      style={{ cursor: 'text', padding: '4px 8px', minHeight: 20, ...style }}
    >
      {value ?? '—'}
    </div>
  );
};

export default function TableElement({ element, isSelected }) {
  const updateElementProps = useStore((s) => s.updateElementProps);
  
  // Безопасное получение пропсов с дефолтами
  const props = element?.props || definition.defaultProps;

  // Вычисляем размеры (защита от некорректных значений)
  const rowCount = Math.min(20, Math.max(1, Number(props.rowCount) || 3));
  const columnCount = Math.min(10, Math.max(1, Number(props.columnCount) || 3));
  
  // Генерируем заголовки (если их нет или меньше чем столбцов — дополняем)
  const headers = Array.from({ length: columnCount }, (_, i) => 
    (props.headers?.[i] ?? `Колонка ${i + 1}`)
  );
  
  // Генерируем данные (если их нет или меньше — дополняем пустыми)
  const data = Array.from({ length: rowCount }, (_, r) =>
    Array.from({ length: columnCount }, (_, c) =>
      props.data?.[r]?.[c] ?? `Ячейка ${r + 1}.${c + 1}`
    )
  );

  // Сохранение заголовка
  const handleHeaderSave = (colIndex, newValue) => {
    const newHeaders = [...headers];
    newHeaders[colIndex] = newValue;
    updateElementProps(element.id, { headers: newHeaders });
  };

  // Сохранение ячейки
  const handleCellSave = (rowIndex, colIndex, newValue) => {
    const newData = data.map((row, r) =>
      r === rowIndex ? row.map((cell, c) => (c === colIndex ? newValue : cell)) : row
    );
    updateElementProps(element.id, { data: newData });
  };

  // Формирование колонок для Ant Design Table
  const columns = headers.map((title, colIndex) => ({
    title: (
      <EditableHeader 
        value={title} 
        onSave={(val) => handleHeaderSave(colIndex, val)} 
      />
    ),
    dataIndex: `col_${colIndex}`,
    key: `col_${colIndex}`,
    width: 120,
    render: (text, record, rowIndex) => (
      <EditableCell 
        value={text} 
        onSave={(val) => handleCellSave(rowIndex, colIndex, val)} 
      />
    ),
  }));

  // Преобразование 2D массива в объект для AntD Table
  const dataSource = data.map((row, rowIndex) => ({
    key: `row_${rowIndex}`,
    ...row.reduce((acc, cell, colIndex) => ({ ...acc, [`col_${colIndex}`]: cell }), {}),
  }));

  return (
    <div style={{ width: '100%', height: '100%', padding: 4, pointerEvents: 'auto' }}>
      <Table
        columns={columns}
        dataSource={dataSource}
        size="small"
        pagination={false}
        bordered
        style={{ pointerEvents: 'auto' }}
        onRow={() => ({
          onPointerDown: (e) => e.stopPropagation(),
          onClick: (e) => e.stopPropagation(),
        })}
      />
    </div>
  );
}