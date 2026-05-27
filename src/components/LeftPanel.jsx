import { useState, useEffect, useCallback } from 'react';
import useStore, { selectActivePageElements } from '../store';
import { ELEMENT_DEFINITIONS } from '../elements';

const elementMeta = {};
ELEMENT_DEFINITIONS.forEach((d) => {
  elementMeta[d.type] = { label: d.label, properties: d.properties || [] };
});

const styles = {
  panel: {
    width: 359,
    background: '#FFFFFF',
    borderRight: '1px solid #E0E0E0',
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 23,
    overflowY: 'auto',
    flexShrink: 0,
  },
  title: { fontFamily: 'Inter', fontWeight: 500, fontSize: 20, lineHeight: '24px', color: '#202020' },
  sectionLabel: { fontFamily: 'Inter', fontWeight: 500, fontSize: 16, lineHeight: '20px', color: '#202020', marginBottom: 6 },
  inputGroup: { marginBottom: 16 },
  label: { fontFamily: 'Inter', fontWeight: 500, fontSize: 14, lineHeight: '20px', color: '#202020', display: 'block', marginBottom: 6 },
  input: { width: '100%', padding: '10px 14px', background: '#FFFFFF', border: '1px solid #D4D4D4', borderRadius: 8, boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)', fontFamily: 'Inter', fontSize: 14, color: '#202020', boxSizing: 'border-box' },
  select: { width: '100%', padding: '10px 14px', background: '#FFFFFF', border: '1px solid #D4D4D4', borderRadius: 8, boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)', fontFamily: 'Inter', fontSize: 14, color: '#202020', boxSizing: 'border-box', cursor: 'pointer' },
  colorInput: { width: '100%', height: 36, padding: 4, border: '1px solid #D4D4D4', borderRadius: 8, cursor: 'pointer' },
  checkbox: { display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' },
  columnEditor: { padding: 12, border: '1px solid #e8e8e8', borderRadius: 8, marginBottom: 12, background: '#fafafa' },
  breakpointRow: { marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 },
  breakpointLabel: { fontSize: 11, width: 80, color: '#666' },
  breakpointInput: { flex: 1, padding: '4px 8px', borderRadius: 4, border: '1px solid #d9d9d9', fontSize: 12 },
  applyButton: { marginTop: 8, width: '100%', padding: '8px', background: '#1677ff', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 },
  infoText: { fontSize: 11, color: '#888', marginTop: 4 },
};

export default function LeftPanel() {
  const selectedId = useStore((s) => s.selectedId);
  const elements = useStore(selectActivePageElements);
  const setElementPosition = useStore((s) => s.setElementPosition);
  const updateElementProps = useStore((s) => s.updateElementProps);

  const selectedElement = elements.find((el) => el.id === selectedId);
  const meta = selectedElement ? elementMeta[selectedElement.type] : null;

  const [xStr, setXStr] = useState('');
  const [yStr, setYStr] = useState('');
  const [propValues, setPropValues] = useState({});

  useEffect(() => {
    if (selectedElement) {
      setXStr(String(Math.round(selectedElement.x)));
      setYStr(String(Math.round(selectedElement.y)));
      setPropValues(selectedElement.props || {});
    }
  }, [selectedElement?.id, selectedElement?.x, selectedElement?.y, selectedElement?.props]);

  const handleXChange = (e) => {
    setXStr(e.target.value);
    const val = parseFloat(e.target.value);
    if (!isNaN(val) && selectedElement) setElementPosition(selectedElement.id, val, selectedElement.y);
  };

  const handleYChange = (e) => {
    setYStr(e.target.value);
    const val = parseFloat(e.target.value);
    if (!isNaN(val) && selectedElement) setElementPosition(selectedElement.id, selectedElement.x, val);
  };

  const handlePropChange = useCallback((propName, value) => {
    if (selectedElement) updateElementProps(selectedElement.id, { [propName]: value });
  }, [selectedElement, updateElementProps]);

  const handleColumnCountChange = (value) => {
    if (!selectedElement || selectedElement.type !== 'Grid') return;
    
    const currentColumns = selectedElement.props?.columns || [];
    const newCount = parseInt(value) || 2;
    
    let newColumns = [...currentColumns];
    if (newCount > currentColumns.length) {
      for (let i = currentColumns.length; i < newCount; i++) {
        newColumns.push({
          id: `col-${Date.now()}-${i}`,
          span: 12,
          content: `Колонка ${i + 1}`,
          xs: 24, sm: 12, md: 8, lg: 6, xl: 4,
          offset: 0, order: 0, push: 0, pull: 0,
        });
      }
    } else if (newCount < currentColumns.length) {
      newColumns = newColumns.slice(0, newCount);
    }
    
    updateElementProps(selectedElement.id, { columnCount: newCount, columns: newColumns });
  };

  const handleColumnUpdate = (index, updatedCol) => {
    if (!selectedElement) return;
    const columns = [...(selectedElement.props?.columns || [])];
    columns[index] = updatedCol;
    updateElementProps(selectedElement.id, { columns });
  };

  const handleColumnRemove = (index) => {
    if (!selectedElement) return;
    const columns = [...(selectedElement.props?.columns || [])];
    columns.splice(index, 1);
    updateElementProps(selectedElement.id, { 
      columns, 
      columnCount: columns.length 
    });
  };

  const renderPropertyEditor = (prop) => {
    const value = propValues[prop.name];

    if (prop.name === 'columnCount' && selectedElement?.type === 'Grid') {
      return (
        <div>
          <input
            type="number"
            min="1"
            max="24"
            value={value || 2}
            onChange={(e) => handlePropChange(prop.name, parseInt(e.target.value))}
            style={styles.input}
          />
          <button
            onClick={() => handleColumnCountChange(value)}
            style={styles.applyButton}
          >
            Применить колонки
          </button>
          <div style={styles.infoText}>
            Измените число и нажмите «Применить» для обновления сетки
          </div>
        </div>
      );
    }

    if (prop.name === 'columns' && selectedElement?.type === 'Grid') {
      const columns = propValues.columns || [];
      return (
        <div>
          <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
            Настройка колонок:
          </div>
          {columns.map((col, index) => (
            <div key={col.id || index} style={styles.columnEditor}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontWeight: 500, fontSize: 13 }}>Колонка #{index + 1}</span>
                {columns.length > 1 && (
                  <button 
                    onClick={() => handleColumnRemove(index)}
                    style={{ background: '#ff4d4f', color: 'white', border: 'none', borderRadius: 4, padding: '2px 8px', cursor: 'pointer', fontSize: 11 }}
                  >
                    ✕
                  </button>
                )}
              </div>
              
              <div style={{ marginBottom: 8 }}>
                <label style={{ fontSize: 11, color: '#666', display: 'block', marginBottom: 4 }}>Содержимое</label>
                <input
                  type="text"
                  value={col.content || ''}
                  onChange={(e) => handleColumnUpdate(index, { ...col, content: e.target.value })}
                  style={{ ...styles.input, padding: '4px 8px', fontSize: 13 }}
                />
              </div>

              <div style={{ marginBottom: 8 }}>
                <label style={{ fontSize: 11, color: '#666', display: 'block', marginBottom: 4 }}>Базовый span (1-24)</label>
                <input
                  type="number"
                  min="1"
                  max="24"
                  value={col.span || 12}
                  onChange={(e) => handleColumnUpdate(index, { ...col, span: parseInt(e.target.value) || 12 })}
                  style={{ ...styles.input, padding: '4px 8px', fontSize: 13 }}
                />
              </div>

              <div style={{ fontSize: 10, color: '#888', marginBottom: 6, fontWeight: 500 }}>
                Адаптивные брейкпоинты:
              </div>

              {[
                { key: 'xs', label: 'XS <576px' },
                { key: 'sm', label: 'SM ≥576px' },
                { key: 'md', label: 'MD ≥768px' },
                { key: 'lg', label: 'LG ≥992px' },
                { key: 'xl', label: 'XL ≥1200px' },
              ].map((bp) => (
                <div key={bp.key} style={styles.breakpointRow}>
                  <span style={styles.breakpointLabel}>{bp.label}</span>
                  <input
                    type="number"
                    min="0"
                    max="24"
                    placeholder="—"
                    value={col[bp.key] ?? ''}
                    onChange={(e) => {
                      const val = e.target.value === '' ? undefined : parseInt(e.target.value);
                      handleColumnUpdate(index, { ...col, [bp.key]: val });
                    }}
                    style={styles.breakpointInput}
                  />
                </div>
              ))}

              <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px dashed #e8e8e8' }}>
                <div style={{ marginBottom: 6 }}>
                  <label style={{ fontSize: 11, color: '#666', display: 'block', marginBottom: 4 }}>Offset</label>
                  <input
                    type="number"
                    min="0"
                    max="24"
                    value={col.offset || 0}
                    onChange={(e) => handleColumnUpdate(index, { ...col, offset: parseInt(e.target.value) || 0 })}
                    style={{ ...styles.input, padding: '4px 8px', fontSize: 12 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: '#666', display: 'block', marginBottom: 4 }}>Order</label>
                  <input
                    type="number"
                    min="-24"
                    max="24"
                    value={col.order || 0}
                    onChange={(e) => handleColumnUpdate(index, { ...col, order: parseInt(e.target.value) || 0 })}
                    style={{ ...styles.input, padding: '4px 8px', fontSize: 12 }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    switch (prop.type) {
      case 'text':
      case 'textarea':
        return <input key={prop.name} type="text" value={value || ''} onChange={(e) => handlePropChange(prop.name, e.target.value)} style={styles.input} />;
      case 'number':
        return <input key={prop.name} type="number" value={value ?? ''} onChange={(e) => handlePropChange(prop.name, parseFloat(e.target.value))} min={prop.min} max={prop.max} step={prop.step || 1} style={styles.input} />;
      case 'select':
        return (
          <select key={prop.name} value={value || ''} onChange={(e) => handlePropChange(prop.name, e.target.value)} style={styles.select}>
            {prop.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        );
      case 'checkbox':
        return <label key={prop.name} style={styles.checkbox}><input type="checkbox" checked={!!value} onChange={(e) => handlePropChange(prop.name, e.target.checked)} /><span>{prop.label}</span></label>;
      case 'color':
        return <input key={prop.name} type="color" value={value || '#000000'} onChange={(e) => handlePropChange(prop.name, e.target.value)} style={styles.colorInput} />;
      default:
        return null;
    }
  };

  return (
    <div style={styles.panel}>
      <div style={styles.title}>Свойства</div>
      {selectedElement ? (
        <>
          <div style={styles.sectionLabel}>{meta?.label || selectedElement.type}</div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>PosX</label>
            <input type="number" value={xStr} onChange={handleXChange} style={styles.input} />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>PosY</label>
            <input type="number" value={yStr} onChange={handleYChange} style={styles.input} />
          </div>

          {meta?.properties?.map(prop => (
            <div key={prop.name} style={styles.inputGroup}>
              <label style={styles.label}>{prop.label}</label>
              {renderPropertyEditor(prop)}
            </div>
          ))}
        </>
      ) : (
        <div style={{ fontFamily: 'Inter', fontSize: 14, color: '#999' }}>Выберите элемент на холсте</div>
      )}
    </div>
  );
}