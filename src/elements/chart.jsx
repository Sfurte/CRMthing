import { useState, useRef, useEffect } from 'react';
import { BarChartOutlined, PlusOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import { Column, Line, Pie, Area, Bar } from '@ant-design/charts';
import useStore from '../store';
import { useLang } from '../hooks/useLang';

export const definition = {
  type: 'Chart',
  label: 'chart',
  icon: BarChartOutlined,
  defaultProps: {
    chartType: 'column',
    title: 'statistics',
    color: '#1677ff',
    data: [
      { category: 'Янв', value: 120 },
      { category: 'Фев', value: 180 },
      { category: 'Мар', value: 150 },
    ],
  },
  properties: [
    { name: 'chartType', label: 'chartType', type: 'select', options: ['column', 'line', 'area', 'pie', 'bar'] },
    { name: 'color', label: 'color', type: 'color' },
  ],
};

// 🔹 Редактируемый заголовок
function EditableTitle({ value, onSave }) {
  const { t } = useLang();
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

  const displayValue = t(value) !== value ? t(value) : value;

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
        {displayValue}
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
        }}
        style={{
          width: '70%', fontSize: 16, fontWeight: 500, textAlign: 'center',
          border: '1px solid #1890ff', outline: 'none', padding: '4px 8px',
          background: '#fff', color: '#000', borderRadius: 4, cursor: 'text'
        }}
      />
      <Button size="small" type="primary" icon={<CheckOutlined />} onClick={handleSave} />
      <Button size="small" onClick={() => { setIsEditing(false); setEditValue(value); }}>
        {t('cancel')}
      </Button>
    </div>
  );
}

// 🔹 Оверлей редактора данных с историей отмены
function DataEditorOverlay({ data, onSave, onClose }) {
  const { t } = useLang();
  
  // Исходные данные (snapshot при открытии)
  const initialData = useRef(data.map(item => ({ ...item })));
  
  const [localData, setLocalData] = useState(() => {
    return data.map(item => ({ ...item }));
  });
  
  // История изменений для undo
  const [history, setHistory] = useState([]);

  const handleChange = (index, field, value) => {
    // Сохраняем в историю перед изменением
    setHistory(prev => [...prev, localData.map(item => ({ ...item }))]);
    const newData = [...localData];
    newData[index] = { ...newData[index], [field]: value };
    setLocalData(newData);
  };

  const addRow = () => {
    // Сохраняем в историю перед добавлением
    setHistory(prev => [...prev, localData.map(item => ({ ...item }))]);
    setLocalData([...localData, { category: t('newValue'), value: 100 }]);
  };

  const removeRow = (index) => {
    // Сохраняем в историю перед удалением
    setHistory(prev => [...prev, localData.map(item => ({ ...item }))]);
    const newData = localData.filter((_, i) => i !== index);
    setLocalData(newData);
  };

  const handleSave = () => {
    const cleaned = localData.filter(d => d.category?.trim() || d.value);
    onSave(cleaned);
    onClose();
  };

  // Отмена последнего действия (не закрывает редактор)
  const handleUndo = () => {
    if (history.length === 0) {
      // Если истории нет — возвращаем к исходным данным
      setLocalData(initialData.current.map(item => ({ ...item })));
      return;
    }
    // Откатываем на последнее состояние
    const previousState = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    setLocalData(previousState);
  };

  // Проверяем, есть ли что отменять
  const hasChanges = history.length > 0 || JSON.stringify(localData) !== JSON.stringify(initialData.current);

  const stopDrag = (e) => {
    e.stopPropagation();
  };

  const preventDrag = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <div
      data-no-dnd="true"
      style={{
        position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.98)',
        borderRadius: 8, padding: 16, zIndex: 1000, display: 'flex', flexDirection: 'column',
        boxShadow: '0 8px 24px rgba(0,0,0,0.15)', pointerEvents: 'auto',
      }}
      onPointerDown={stopDrag}
      onMouseDown={stopDrag}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #f0f0f0' }}>
        <span style={{ fontWeight: 600, fontSize: 14, color: '#202020' }}> {t('chartData')}</span>
        <Space>
          <Button 
            size="small" 
            onClick={addRow} 
            onPointerDown={preventDrag}
            onMouseDown={preventDrag}
            type="primary" 
            ghost 
            icon={<PlusOutlined />}
          >
            {t('add')}
          </Button>
          <Button 
            size="small" 
            onClick={handleUndo}
            onPointerDown={preventDrag}
            onMouseDown={preventDrag}
            disabled={!hasChanges}
          >
            {t('cancel')}
          </Button>
          <Button 
            size="small" 
            type="primary" 
            icon={<CheckOutlined />} 
            onClick={handleSave}
            onPointerDown={preventDrag}
            onMouseDown={preventDrag}
          >
            {t('save')}
          </Button>
        </Space>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingRight: 4 }}>
        {localData.map((item, index) => (
          <div key={index} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
            <input
              type="text"
              value={item.category}
              onChange={(e) => handleChange(index, 'category', e.target.value)}
              onPointerDown={stopDrag}
              style={{ flex: 1, border: '1px solid #d9d9d9', borderRadius: 4, padding: '6px 10px', fontSize: 13, outline: 'none', color: '#000', cursor: 'text' }}
              placeholder={t('category')}
            />
            <input
              type="number"
              value={item.value}
              onChange={(e) => handleChange(index, 'value', Number(e.target.value))}
              onPointerDown={stopDrag}
              style={{ width: 90, border: '1px solid #d9d9d9', borderRadius: 4, padding: '6px 10px', fontSize: 13, outline: 'none', color: '#000', textAlign: 'right', cursor: 'text' }}
              placeholder="0"
            />
            <Button 
              size="small" 
              danger 
              icon={<DeleteOutlined />} 
              onClick={() => removeRow(index)}
              onPointerDown={preventDrag}
              onMouseDown={preventDrag}
              ghost 
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ChartElement({ element, isSelected }) {
  const { t } = useLang();
  const updateElementProps = useStore((s) => s.updateElementProps);
  
  const {
    chartType = 'column',
    title = 'statistics',
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
      data-no-dnd={!isEditingData}
      style={{ 
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column', 
        position: 'relative', background: '#fff', borderRadius: 8, overflow: 'hidden'
      }}
      onDoubleClick={(e) => {
        if (!e.target.closest('[data-title-edit]') && !isEditingData) {
          e.stopPropagation();
          setIsEditingData(true);
        }
      }}
    >
      <div data-title-edit style={{ flexShrink: 0, zIndex: 10, background: '#fff' }}>
        <EditableTitle value={title} onSave={handleTitleSave} />
      </div>
      
      <div style={{ flex: 1, minHeight: 0, width: '100%', position: 'relative' }}>
        <ChartComponent {...config} autoFit />
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