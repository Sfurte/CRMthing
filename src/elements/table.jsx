import { useState, useRef, useEffect } from 'react';
import { Table } from 'antd';
import { TableOutlined } from '@ant-design/icons';
import useStore from '../store';

export const definition = {
  type: 'Table',
  label: 'Таблица',
  icon: TableOutlined,
  defaultProps: {
    size: 'middle',
    bordered: true,
    columnCount: 3,
    rowCount: 3,
    // Храним конфигурацию колонок (включая заголовки)
    columnsConfig: [], 
    dataSource: [],
  },
  properties: [
    { name: 'size', label: 'Размер', type: 'select', options: ['large', 'middle', 'small'] },
    { name: 'bordered', label: 'Рамка', type: 'checkbox' },
    { name: 'columnCount', label: 'Столбцов', type: 'number', min: 1, max: 10 },
    { name: 'rowCount', label: 'Строк', type: 'number', min: 1, max: 50 },
  ],
};

// 🟢 Компонент редактируемого заголовка колонки
function EditableHeader({ initialValue, onSave }) {
  const inputRef = useRef(null);
  
  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <input
      ref={inputRef}
      type="text"
      defaultValue={initialValue}
      // Сохраняем при потере фокуса или Enter
      onBlur={(e) => onSave(e.target.value)}
      onKeyDownCapture={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          // Сохраняем значение из текущего состояния инпута
          onSave(inputRef.current.value); 
        }
        e.stopPropagation(); // Блокируем dnd-kit
      }}
      onClickCapture={(e) => e.stopPropagation()}
      onPointerDownCapture={(e) => e.stopPropagation()}
      style={{
        width: '100%',
        border: '1px solid #1890ff',
        background: '#fff',
        padding: '2px 4px',
        fontSize: 12,
        fontWeight: 'bold',
        outline: 'none',
        boxSizing: 'border-box',
        color: '#000',
        cursor: 'text',
      }}
    />
  );
}

//  Компонент редактируемой ячейки данных
function EditableCellInput({ initialValue, onSave }) {
  const inputRef = useRef(null);
  
  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <input
      ref={inputRef}
      type="text"
      defaultValue={initialValue}
      onBlur={(e) => onSave(e.target.value)}
      onKeyDownCapture={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          onSave(e.target.value);
        }
        e.stopPropagation();
      }}
      onClickCapture={(e) => e.stopPropagation()}
      onPointerDownCapture={(e) => e.stopPropagation()}
      style={{
        width: '100%',
        border: '1px solid #1890ff',
        background: '#fff',
        padding: '2px 4px',
        fontSize: 12,
        outline: 'none',
        boxSizing: 'border-box',
        color: '#000',
      }}
    />
  );
}

export default function TableElement({ element, isSelected }) {
  const updateElementProps = useStore((s) => s.updateElementProps);
  const {
    size = 'middle',
    bordered = true,
    columnCount = 3,
    rowCount = 3,
    columnsConfig = [],
    dataSource = [],
  } = element.props || {};

  // Состояние: какая ячейка данных редактируется?
  const [editingCell, setEditingCell] = useState(null); 

  // 1. Инициализация/Генерация колонок, если их нет в props
  const getColumnsConfig = () => {
    if (columnsConfig.length > 0) return columnsConfig;
    // Генерируем по умолчанию
    return Array.from({ length: columnCount }, (_, i) => ({
      title: `Колонка ${i + 1}`,
      dataIndex: `col${i + 1}`,
      key: `col${i + 1}`,
    }));
  };

  const currentColumnsConfig = getColumnsConfig();

  // 2. Инициализация/Генерация данных строк
  const getDataSource = () => {
    if (dataSource.length > 0) return dataSource;
    return Array.from({ length: rowCount }, (_, rowIndex) => {
      const row = { key: `row-${rowIndex + 1}` };
      currentColumnsConfig.forEach(col => {
        row[col.dataIndex] = '';
      });
      return row;
    });
  };

  const data = getDataSource();

  // 3. Сохранение заголовка колонки
  const handleHeaderSave = (colIndex, newTitle) => {
    const newConfig = [...currentColumnsConfig];
    if (newConfig[colIndex]) {
      newConfig[colIndex] = { ...newConfig[colIndex], title: newTitle };
    }
    updateElementProps(element.id, { columnsConfig: newConfig });
  };

  // 4. Сохранение ячейки данных
  const handleCellSave = (rowKey, dataIndex, value) => {
    const newData = data.map(row => 
      row.key === rowKey ? { ...row, [dataIndex]: value } : row
    );
    updateElementProps(element.id, { dataSource: newData });
    setEditingCell(null);
  };

  // 5. Формирование колонок для Ant Design Table
  const columns = currentColumnsConfig.map((col, index) => ({
    ...col,
    // 🟢 Используем компонент для заголовка
    title: (
      <EditableHeader 
        initialValue={col.title} 
        onSave={(val) => handleHeaderSave(index, val)} 
      />
    ),
    // Рендер содержимого ячейки
    render: (text, record) => {
      const isEditing = editingCell?.key === record.key && editingCell?.dataIndex === col.dataIndex;

      if (isEditing) {
        return <EditableCellInput initialValue={text} onSave={(val) => handleCellSave(record.key, col.dataIndex, val)} />;
      }

      return (
        <div
          onDoubleClick={(e) => {
            e.stopPropagation();
            setEditingCell({ key: record.key, dataIndex: col.dataIndex });
          }}
          style={{
            cursor: 'text',
            minHeight: 24,
            padding: '4px',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {text || <span style={{ color: '#ccc' }}>—</span>}
        </div>
      );
    },
  }));

  return (
    <div 
      style={{ 
        width: '100%', 
        height: '100%', 
        background: '#fff', 
        overflow: 'auto',
        pointerEvents: 'auto',
      }}
    >
      <Table
        columns={columns}
        dataSource={data}
        size={size}
        bordered={bordered}
        pagination={false}
        style={{ width: '100%', height: '100%' }}
        onRow={() => ({
          onPointerDown: (e) => e.stopPropagation(),
          onClick: (e) => e.stopPropagation(),
        })}
        // Отключаем сортировку, чтобы не мешала кликам
        sortDirections={[]}
      />
    </div>
  );
}