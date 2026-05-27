import { useState, useRef, useEffect } from 'react';
import { BarChartOutlined, CloseOutlined, PlusOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import { Column, Line, Pie, Area, Bar } from '@ant-design/charts';
import useStore from '../store';

export const definition = {
  type: 'Chart',
  label: 'График',
  icon: BarChartOutlined,
  defaultProps: {
    chartType: 'column',
    title: 'Статистика',
    color: '#1677ff',
    data: [
      { category: 'Янв', value: 120 },
      { category: 'Фев', value: 180 },
      { category: 'Мар', value: 150 },
    ],
  },
  properties: [
    { name: 'chartType', label: 'Тип', type: 'select', options: ['column', 'line', 'area', 'pie', 'bar'] },
    { name: 'color', label: 'Цвет', type: 'color' },
  ],
};

// 🔹 Редактируемый заголовок
function EditableTitle({ value, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => { setEditValue(value); }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      const timer = setTimeout(() => inputRef.current?.focus(), 10);
      return () => clearTimeout(timer);
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editValue.trim()) {
      onSave(editValue.trim());
    }
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div
        onDoubleClick={(e) => {
          e.stopPropagation();
          e.nativeEvent?.stopImmediatePropagation?.();
          setIsEditing(true);
        }}
        style={{
          fontSize: 16, fontWeight: 500, textAlign: 'center', cursor: 'text',
          padding: '8px 4px', marginBottom: 4, color: '#333', userSelect: 'none'
        }}
      >
        {value}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '4px' }}>
      <input
        ref={inputRef}
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') { e.preventDefault(); handleSave(); }
          if (e.key === 'Escape') { e.preventDefault(); setIsEditing(false); setEditValue(value); }
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
        }}
        onPointerDown={(e) => { e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); }}
        onClick={(e) => { e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); }}
        style={{
          width: '70%', fontSize: 16, fontWeight: 500, textAlign: 'center',
          border: '1px solid #1890ff', outline: 'none', padding: '4px 8px',
          background: '#fff', color: '#000', borderRadius: 4
        }}
      />
      <Button size="small" type="primary" icon={<CheckOutlined />} onClick={(e) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        handleSave();
      }} />
      <Button size="small" onClick={(e) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        setIsEditing(false);
        setEditValue(value);
      }}>Отмена</Button>
    </div>
  );
}

// 🔹 Оверлей редактора данных (КОНТРОЛИРУЕМЫЕ ИНПУТЫ)
function DataEditorOverlay({ data, onSave, onClose }) {
  // Локальный стейт для данных редактора
  const [localData, setLocalData] = useState(() => {
    return data.map(item => ({ ...item }));
  });

  const handleChange = (index, field, value) => {
    const newData = [...localData];
    newData[index] = { ...newData[index], [field]: value };
    setLocalData(newData);
  };

  const addRow = () => {
    setLocalData([...localData, { category: 'Новый', value: 100 }]);
  };

  const removeRow = (index) => {
    const newData = localData.filter((_, i) => i !== index);
    setLocalData(newData);
  };

  const handleSave = () => {
    // Очищаем пустые строки
    const cleaned = localData.filter(d => d.category?.trim() || d.value);
    onSave(cleaned);
    onClose();
  };

  // Жёсткая блокировка событий
  const stopAll = (e) => {
    e.stopPropagation();
    e.nativeEvent?.stopImmediatePropagation?.();
  };

  return (
    <div
      style={{
        position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.98)',
        borderRadius: 8, padding: 16, zIndex: 100, display: 'flex', flexDirection: 'column',
        boxShadow: '0 8px 24px rgba(0,0,0,0.15)', pointerEvents: 'auto',
      }}
      onPointerDown={stopAll}
      onClick={stopAll}
      onKeyDown={stopAll}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #f0f0f0' }}>
        <span style={{ fontWeight: 600, fontSize: 14, color: '#202020' }}>📊 Данные графика</span>
        <Space>
          <Button size="small" onClick={(e) => { stopAll(e); addRow(); }} type="primary" ghost icon={<PlusOutlined />}>Добавить</Button>
          <Button size="small" onClick={(e) => { stopAll(e); onClose(); }}>Отмена</Button>
          <Button size="small" type="primary" icon={<CheckOutlined />} onClick={(e) => { stopAll(e); handleSave(); }}>Сохранить</Button>
        </Space>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingRight: 4 }}>
        {localData.map((item, index) => (
          <div key={index} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
            <input
              type="text"
              value={item.category}
              onChange={(e) => handleChange(index, 'category', e.target.value)}
              onPointerDown={stopAll}
              onClick={stopAll}
              style={{ flex: 1, border: '1px solid #d9d9d9', borderRadius: 4, padding: '6px 10px', fontSize: 13, outline: 'none', color: '#000' }}
              placeholder="Категория"
            />
            <input
              type="number"
              value={item.value}
              onChange={(e) => handleChange(index, 'value', Number(e.target.value))}
              onPointerDown={stopAll}
              onClick={stopAll}
              style={{ width: 90, border: '1px solid #d9d9d9', borderRadius: 4, padding: '6px 10px', fontSize: 13, outline: 'none', color: '#000', textAlign: 'right' }}
              placeholder="0"
            />
            <Button size="small" danger icon={<DeleteOutlined />} onClick={(e) => { stopAll(e); removeRow(index); }} ghost />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ChartElement({ element, isSelected }) {
  const updateElementProps = useStore((s) => s.updateElementProps);
  
  const {
    chartType = 'column',
    title = 'Статистика',
    color = '#1677ff',
    data = [],
  } = element.props || {};

  const [isEditingData, setIsEditingData] = useState(false);

  const handleTitleSave = (newTitle) => updateElementProps(element.id, { title: newTitle });
  const handleDataSave = (newData) => {
    updateElementProps(element.id, { data: newData });
    setIsEditingData(false);
  };

  const ChartComponent = 
    chartType === 'line' ? Line :
    chartType === 'area' ? Area :
    chartType === 'pie' ? Pie :
    chartType === 'bar' ? Bar :
    Column;

  const isPie = chartType === 'pie';
  const config = isPie 
    ? { data, angleField: 'value', colorField: 'category', radius: 0.9, color } 
    : { data, xField: 'category', yField: 'value', color };

  return (
    <div 
      style={{ 
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column', 
        position: 'relative', pointerEvents: 'auto', background: '#fff', borderRadius: 8, overflow: 'hidden'
      }}
      onDoubleClick={(e) => {
        if (!e.target.closest('[data-title-edit]') && !isEditingData) {
          e.stopPropagation();
          e.nativeEvent?.stopImmediatePropagation?.();
          setIsEditingData(true);
        }
      }}
    >
      <div data-title-edit style={{ flexShrink: 0, zIndex: 10, background: '#fff' }}>
        <EditableTitle value={title} onSave={handleTitleSave} />
      </div>
      
      <div style={{ flex: 1, minHeight: 0, width: '100%', position: 'relative' }}>
        <ChartComponent {...config} autoFit style={{ pointerEvents: 'auto' }} />
      </div>

      {isEditingData && (
        <DataEditorOverlay 
          data={data} 
          onSave={handleDataSave} 
          onClose={() => setIsEditingData(false)} 
        />
      )}
    </div>
  );
}