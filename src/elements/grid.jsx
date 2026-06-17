import { useState } from 'react';
import { AppstoreOutlined } from '@ant-design/icons';
import useStore from '../store';
import { useLang } from '../hooks/useLang';
import { textBlock, textStyles } from './blocks/textStyle';
import InlineEditable from './InlineEditable';
import './grid.css';

export const definition = {
  type: 'Grid',
  label: 'grid',
  icon: AppstoreOutlined,
  defaultProps: {
    rows: 3,
    cols: 3,
    gap: 12,
    bgColor: '#f0f5ff',
    cellBgColor: '#ffffff',
    cellData: [],
    ...textBlock.defaultProps,
  },
  properties: [
    { name: 'rows', label: 'rowCount', type: 'number', min: 1, max: 20 },
    { name: 'cols', label: 'columnCount', type: 'number', min: 1, max: 10 },
    { name: 'gap', label: 'gap', type: 'number', min: 0, max: 50 },
    { name: 'bgColor', label: 'bgColor', type: 'color' },
    { name: 'cellBgColor', label: 'cellBgColor', type: 'color' },
    ...textBlock.properties,
  ],
};

export default function GridElement({ element, isSelected }) {
  const { t } = useLang();
  const updateElementProps = useStore((s) => s.updateElementProps);
  const props = element?.props || definition.defaultProps;
  const ts = textStyles(props);

  const rows = Math.max(1, Math.min(20, Number(props.rows) || 3));
  const cols = Math.max(1, Math.min(10, Number(props.cols) || 3));
  const gap = Number(props.gap) || 12;
  const totalCells = rows * cols;

  const cellData = Array.isArray(props.cellData) ? props.cellData : [];
  const normalizedData = Array.from({ length: totalCells }, (_, i) =>
    cellData[i] ?? `${t('cell')} ${Math.floor(i / cols) + 1}.${(i % cols) + 1}`
  );

  const handleCellSave = (index, newValue) => {
    const newData = [...normalizedData];
    newData[index] = newValue;
    updateElementProps(element.id, { cellData: newData });
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
          <div key={index} className="element-grid__cell"
            style={{
              background: props.cellBgColor || '#fff',
              border: '1px solid #d9d9d9',
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              padding: 4,
            }}
          >
            <InlineEditable
              value={text}
              onSave={(val) => handleCellSave(index, val)}
              style={{
                fontSize: 12, textAlign: 'center', padding: 0, width: '100%',
                fontWeight: ts.fontWeight, fontStyle: ts.fontStyle, fontSize: ts.fontSize,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
