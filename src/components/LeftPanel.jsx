import { useCallback, useEffect, useMemo, useState } from 'react';
import { Collapse } from 'antd';
import useStore, { selectActivePageElements } from '../store';
import { ELEMENT_DEFINITIONS } from '../elements';
import './LeftPanel.css';

const elementMeta = {};
ELEMENT_DEFINITIONS.forEach((d) => {
  elementMeta[d.type] = { label: d.label, properties: d.properties || [] };
});

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
        return <input key={prop.name} type="text" className="left-panel__input" value={value || ''} onChange={(e) => handlePropChange(prop.name, e.target.value)} />;
      case 'number':
        return <input key={prop.name} type="number" className="left-panel__input" value={value ?? ''} onChange={(e) => handlePropChange(prop.name, parseFloat(e.target.value))} min={prop.min} max={prop.max} step={prop.step || 1} />;
      case 'select':
        return (
          <select key={prop.name} className="left-panel__select" value={value || ''} onChange={(e) => handlePropChange(prop.name, e.target.value)}>
            {prop.options?.map(opt => {
              const optValue = typeof opt === 'object' ? opt.value : opt;
              const optLabel = typeof opt === 'object' ? opt.label : opt;
              return <option key={optValue} value={optValue}>{optLabel}</option>;
            })}
          </select>
        );
      case 'checkbox':
        return (
          <label key={prop.name} className="left-panel__checkbox">
            <input type="checkbox" checked={!!value} onChange={(e) => handlePropChange(prop.name, e.target.checked)} />
          </label>
        );
      case 'color':
        return <input key={prop.name} type="color" className="left-panel__color-input" value={value || '#000000'} onChange={(e) => handlePropChange(prop.name, e.target.value)} />;
      default:
        return null;
    }
  };

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
        <div key={prop.name} className="left-panel__input-group">
          <label className="left-panel__label">{prop.label}</label>
          {renderPropertyEditor(prop)}
        </div>
      )),
    })),
    [grouped, propValues]
  );

  return (
    <div className="left-panel">
      <div className="left-panel__title">Свойства</div>
      {selectedElement ? (
        <>
          <div className="left-panel__section-label">{meta?.label || selectedElement.type}</div>

          <div className="left-panel__input-group">
            <label className="left-panel__label">PosX</label>
            <input type="number" className="left-panel__input" value={xStr} onChange={handleXChange} />
          </div>
          <div className="left-panel__input-group">
            <label className="left-panel__label">PosY</label>
            <input type="number" className="left-panel__input" value={yStr} onChange={handleYChange} />
          </div>

          {ungrouped.map((prop) => (
            <div key={prop.name} className="left-panel__input-group">
              <label className="left-panel__label">{prop.label}</label>
              {renderPropertyEditor(prop)}
            </div>
          ))}

          {collapseItems.length > 0 && (
            <Collapse
              ghost
              items={collapseItems}
              defaultActiveKey={collapseItems.map((c) => c.key)}
            />
          )}
        </>
      ) : (
        <div className="left-panel__empty">Выберите элемент на холсте</div>
      )}
    </div>
  );
}
