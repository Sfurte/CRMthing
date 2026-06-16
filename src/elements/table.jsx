import { useState, useRef, useEffect } from 'react';
import { Table } from 'antd';
import useStore from '../store';
import { useLang } from '../hooks/useLang';
import { textBlock, textStyles } from './blocks/textStyle';
import './table.css';

export const definition = {
  type: 'Table',
  label: 'table',
  defaultProps: {
    rowCount: 3,
    columnCount: 3,
    headers: [],
    data: [],
    ...textBlock.defaultProps,
  },
  defaultWidth: 500,
  defaultHeight: 250,
  properties: [
    { name: 'rowCount', label: 'rowCount', type: 'number', min: 1, max: 20 },
    { name: 'columnCount', label: 'columnCount', type: 'number', min: 1, max: 10 },
    ...textBlock.properties,
  ],
};

const stopAll = (e) => {
  e.stopPropagation();
  e.nativeEvent?.stopImmediatePropagation?.();
};

const EditableHeader = ({ value, onSave, style }) => {
  const { t } = useLang();
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
          stopAll(e); 
        }}
        onPointerDown={stopAll}
        onPointerDownCapture={stopAll}
        onMouseDown={stopAll}
        onMouseDownCapture={stopAll}
        onClick={stopAll}
        data-editing="true"
        style={{ 
          width: '100%', 
          border: '1px solid #1890ff', 
          background: '#fff', 
          padding: '4px 8px', 
          fontSize: 12, 
          fontWeight: 500, 
          outline: 'none', 
          borderRadius: 2, 
          boxSizing: 'border-box', 
          color: '#000', 
          cursor: 'text', 
          textAlign: 'left',
          pointerEvents: 'auto',
          ...style 
        }}
      />
    );
  }
  
  return (
    <div 
      onDoubleClick={(e) => { 
        stopAll(e); 
        setIsEditing(true); 
      }}
      onPointerDown={stopAll}
      onPointerDownCapture={stopAll}
      data-editing="false"
      style={{ 
        cursor: 'text', 
        padding: '4px 8px', 
        minHeight: 20, 
        fontWeight: 500,
        pointerEvents: 'auto',
        ...style 
      }}
    >
      {displayValue ?? '—'}
    </div>
  );
};

const EditableCell = ({ value, onSave, style }) => {
  const { t } = useLang();
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
          stopAll(e); 
        }}
        onPointerDown={stopAll}
        onPointerDownCapture={stopAll}
        onMouseDown={stopAll}
        onMouseDownCapture={stopAll}
        onClick={stopAll}
        data-editing="true"
        style={{ 
          width: '100%', 
          border: '1px solid #1890ff', 
          background: '#fff', 
          padding: '4px 8px', 
          fontSize: 12, 
          outline: 'none', 
          borderRadius: 2, 
          boxSizing: 'border-box', 
          color: '#000', 
          cursor: 'text',
          pointerEvents: 'auto',
          ...style 
        }}
      />
    );
  }
  
  return (
    <div 
      onDoubleClick={(e) => { 
        stopAll(e); 
        setIsEditing(true); 
      }}
      onPointerDown={stopAll}
      onPointerDownCapture={stopAll}
      data-editing="false"
      style={{ 
        cursor: 'text', 
        padding: '4px 8px', 
        minHeight: 20,
        pointerEvents: 'auto',
        ...style 
      }}
    >
      {displayValue ?? '—'}
    </div>
  );
};

export default function TableElement({ element, isSelected }) {
  const { t } = useLang();
  const updateElementProps = useStore((s) => s.updateElementProps);
  const wrapperRef = useRef(null);
  const [rowHeight, setRowHeight] = useState(null);

  const props = element?.props || definition.defaultProps;
  const ts = textStyles(props);

  const rowCount = Math.min(20, Math.max(1, Number(props.rowCount) || 3));
  const columnCount = Math.min(10, Math.max(1, Number(props.columnCount) || 3));

  const headers = Array.from({ length: columnCount }, (_, i) => props.headers?.[i] ?? `${t('column')} ${i + 1}`);
  const data = Array.from({ length: rowCount }, (_, r) =>
    Array.from({ length: columnCount }, (_, c) => props.data?.[r]?.[c] ?? `${t('cell')} ${r + 1}.${c + 1}`)
  );

  useEffect(() => {
    const el = wrapperRef.current?.parentElement;
    if (!el) return;
    const measure = () => {
      const h = el.offsetHeight;
      const headerH = 40;
      const rowH = Math.max(20, Math.floor((h - headerH - 10) / rowCount));
      setRowHeight(rowH);
    };
    measure();
    const obs = new ResizeObserver(measure);
    obs.observe(el);
    return () => obs.disconnect();
  }, [rowCount]);

  const handleHeaderSave = (colIndex, newValue) => {
    const newHeaders = [...headers];
    newHeaders[colIndex] = newValue;
    updateElementProps(element.id, { headers: newHeaders });
  };

  const handleCellSave = (rowIndex, colIndex, newValue) => {
    const newData = data.map((row, r) =>
      r === rowIndex ? row.map((cell, c) => (c === colIndex ? newValue : cell)) : row
    );
    updateElementProps(element.id, { data: newData });
  };

  const columns = headers.map((title, colIndex) => ({
    title: <EditableHeader value={title} onSave={(val) => handleHeaderSave(colIndex, val)} style={ts} />,
    dataIndex: `col_${colIndex}`,
    key: `col_${colIndex}`,
    width: 120,
    render: (text, record, rowIndex) => (
      <EditableCell value={text} onSave={(val) => handleCellSave(rowIndex, colIndex, val)} style={ts} />
    ),
  }));

  const dataSource = data.map((row, rowIndex) => ({
    key: `row_${rowIndex}`,
    ...row.reduce((acc, cell, colIndex) => ({ ...acc, [`col_${colIndex}`]: cell }), {}),
  }));

  return (
    <div className="element-table__wrapper" ref={wrapperRef} style={{ pointerEvents: 'auto' }}>
      <Table
        columns={columns}
        dataSource={dataSource}
        size="small"
        pagination={false}
        bordered
        onRow={() => ({
          style: rowHeight ? { height: rowHeight } : undefined,
        })}
      />
    </div>
  );
}