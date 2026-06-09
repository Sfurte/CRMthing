import { useState, useRef, useEffect } from 'react';
import { BarChartOutlined, CloseOutlined, PlusOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import { Column, Line, Pie, Area, Bar } from '@ant-design/charts';
import useStore from '../store';
import { textBlock, textStyles } from './blocks/textStyle';
import './chart.css';

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
    ...textBlock.defaultProps,
  },
  properties: [
    { name: 'chartType', label: 'Тип', type: 'select', options: ['column', 'line', 'area', 'pie', 'bar'] },
    { name: 'color', label: 'Цвет', type: 'color' },
    ...textBlock.properties,
  ],
};

function EditableTitle({ value, onSave, style: tsStyle }) {
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
    if (editValue.trim()) onSave(editValue.trim());
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
        className="element-chart__title"
        style={tsStyle}
      >
        {value}
      </div>
    );
  }

  return (
    <div className="element-chart__title-actions">
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
        className="element-chart__title-input"
        style={{ ...tsStyle, textAlign: 'center' }}
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

function DataEditorOverlay({ data, onSave, onClose }) {
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
    const cleaned = localData.filter(d => d.category?.trim() || d.value);
    onSave(cleaned);
    onClose();
  };

  const stopAll = (e) => {
    e.stopPropagation();
    e.nativeEvent?.stopImmediatePropagation?.();
  };

  return (
    <div className="element-chart__editor" onPointerDown={stopAll} onClick={stopAll} onKeyDown={stopAll}>
      <div className="element-chart__editor-header">
        <span className="element-chart__editor-title">📊 Данные графика</span>
        <Space>
          <Button size="small" onClick={(e) => { stopAll(e); addRow(); }} type="primary" ghost icon={<PlusOutlined />}>Добавить</Button>
          <Button size="small" onClick={(e) => { stopAll(e); onClose(); }}>Отмена</Button>
          <Button size="small" type="primary" icon={<CheckOutlined />} onClick={(e) => { stopAll(e); handleSave(); }}>Сохранить</Button>
        </Space>
      </div>
      <div className="element-chart__editor-body">
        {localData.map((item, index) => (
          <div key={index} className="element-chart__editor-row">
            <input
              type="text"
              value={item.category}
              onChange={(e) => handleChange(index, 'category', e.target.value)}
              onPointerDown={stopAll}
              onClick={stopAll}
              className="element-chart__editor-input"
              placeholder="Категория"
            />
            <input
              type="number"
              value={item.value}
              onChange={(e) => handleChange(index, 'value', Number(e.target.value))}
              onPointerDown={stopAll}
              onClick={stopAll}
              className="element-chart__editor-input element-chart__editor-input--narrow"
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
  const props = element?.props || definition.defaultProps;
  const ts = textStyles(props);

  const {
    chartType = 'column',
    title = 'Статистика',
    color = '#1677ff',
    data = [],
  } = props;

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
    <div className="element-chart"
      onDoubleClick={(e) => {
        if (!e.target.closest('[data-title-edit]') && !isEditingData) {
          e.stopPropagation();
          e.nativeEvent?.stopImmediatePropagation?.();
          setIsEditingData(true);
        }
      }}
    >
      <div data-title-edit style={{ flexShrink: 0, zIndex: 10, background: '#fff' }}>
        <EditableTitle value={title} onSave={handleTitleSave} style={ts} />
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
