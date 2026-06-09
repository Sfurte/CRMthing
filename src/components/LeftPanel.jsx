import { useCallback, useEffect, useMemo, useState } from 'react';
import { Collapse } from 'antd';
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
  inputGroup: { marginBottom: 12 },
  label: { fontFamily: 'Inter', fontWeight: 500, fontSize: 14, lineHeight: '20px', color: '#202020', display: 'block', marginBottom: 6 },
  input: { width: '100%', padding: '10px 14px', background: '#FFFFFF', border: '1px solid #D4D4D4', borderRadius: 8, boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)', fontFamily: 'Inter', fontSize: 14, color: '#202020', boxSizing: 'border-box' },
  select: { width: '100%', padding: '10px 14px', background: '#FFFFFF', border: '1px solid #D4D4D4', borderRadius: 8, boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)', fontFamily: 'Inter', fontSize: 14, color: '#202020', boxSizing: 'border-box', cursor: 'pointer' },
  colorInput: { width: '100%', height: 36, padding: 4, border: '1px solid #D4D4D4', borderRadius: 8, cursor: 'pointer' },
  checkbox: { display: 'flex', alignItems: 'center', cursor: 'pointer' },
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

  const renderPropertyEditor = (prop) => {
    const value = propValues[prop.name];

    switch (prop.type) {
      case 'text':
      case 'textarea':
        return <input key={prop.name} type="text" value={value || ''} onChange={(e) => handlePropChange(prop.name, e.target.value)} style={styles.input} />;
      case 'number':
        return <input key={prop.name} type="number" value={value ?? ''} onChange={(e) => handlePropChange(prop.name, parseFloat(e.target.value))} min={prop.min} max={prop.max} step={prop.step || 1} style={styles.input} />;
      case 'select':
        return (
          <select key={prop.name} value={value || ''} onChange={(e) => handlePropChange(prop.name, e.target.value)} style={styles.select}>
            {prop.options?.map(opt => {
              const optValue = typeof opt === 'object' ? opt.value : opt;
              const optLabel = typeof opt === 'object' ? opt.label : opt;
              return <option key={optValue} value={optValue}>{optLabel}</option>;
            })}
          </select>
        );
      case 'checkbox':
        return <label key={prop.name} style={styles.checkbox}><input type="checkbox" checked={!!value} onChange={(e) => handlePropChange(prop.name, e.target.checked)} /></label>;
      case 'color':
        return <input key={prop.name} type="color" value={value || '#000000'} onChange={(e) => handlePropChange(prop.name, e.target.value)} style={styles.colorInput} />;
      default:
        return null;
    }
  };

  // Group properties by their `group` field
  const { grouped, ungrouped } = useMemo(() => {
    const props = meta?.properties || [];
    const groups = {};
    const alone = [];
    props.forEach((p) => {
      if (p.group) {
        if (!groups[p.group]) groups[p.group] = [];
        groups[p.group].push(p);
      } else {
        alone.push(p);
      }
    });
    return { grouped: groups, ungrouped: alone };
  }, [meta]);

  const collapseItems = useMemo(() =>
    Object.entries(grouped).map(([groupName, groupProps]) => ({
      key: groupName,
      label: groupName,
      children: groupProps.map((prop) => (
        <div key={prop.name} style={styles.inputGroup}>
          <label style={styles.label}>{prop.label}</label>
          {renderPropertyEditor(prop)}
        </div>
      )),
    })),
    [grouped, propValues]
  );

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

          {ungrouped.map((prop) => (
            <div key={prop.name} style={styles.inputGroup}>
              <label style={styles.label}>{prop.label}</label>
              {renderPropertyEditor(prop)}
            </div>
          ))}

          {collapseItems.length > 0 && (
            <Collapse
              ghost
              items={collapseItems}
              defaultActiveKey={collapseItems.map((c) => c.key)}
              style={{ margin: 0 }}
              styles={{
                header: { padding: '12px 0', fontSize: 16, fontWeight: 500, color: '#202020', borderBottom: 'none' },
                body: { padding: 0, border: 'none' },
                content: { border: 'none' },
              }}
            />
          )}
        </>
      ) : (
        <div style={{ fontFamily: 'Inter', fontSize: 14, color: '#999' }}>Выберите элемент на холсте</div>
      )}
    </div>
  );
}
