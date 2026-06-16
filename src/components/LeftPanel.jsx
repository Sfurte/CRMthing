import { useCallback, useEffect, useMemo, useState } from 'react';
import { Collapse } from 'antd';
import useStore, { selectActivePageElements } from '../store';
import { ELEMENT_DEFINITIONS } from '../elements';
import { useLang } from '../hooks/useLang';
import './LeftPanel.css';

const elementMeta = {};
ELEMENT_DEFINITIONS.forEach((d) => {
  elementMeta[d.type] = { label: d.label, properties: d.properties || [] };
});

/** Find properties that exist in ALL selected elements' definitions */
function findCommonProperties(elements) {
  if (elements.length === 0) return [];
  const types = [...new Set(elements.map((el) => el.type))];
  if (types.length === 1) {
    return elementMeta[types[0]]?.properties || [];
  }
  const propSets = types.map((t) => new Set((elementMeta[t]?.properties || []).map((p) => p.name)));
  const common = [...propSets[0]].filter((name) => propSets.every((s) => s.has(name)));
  return (elementMeta[types[0]]?.properties || []).filter((p) => common.includes(p.name));
}

/** Check if all selected elements have the same value for a prop */
function allSameValue(elements, propName) {
  if (elements.length === 0) return true;
  const first = elements[0]?.props?.[propName];
  return elements.every((el) => el.props?.[propName] === first);
}

/** Компонент для перевода внутри map */
function TranslatedLabel({ text }) {
  const { t } = useLang();
  return <>{t(text)}</>;
}

export default function LeftPanel() {
  const { t } = useLang();
  const selectedIds = useStore((s) => s.selectedIds);
  const elements = useStore(selectActivePageElements);
  const setElementPosition = useStore((s) => s.setElementPosition);
  const updateElementProps = useStore((s) => s.updateElementProps);

  const selectedElements = useMemo(
    () => elements.filter((el) => selectedIds.includes(el.id)),
    [elements, selectedIds]
  );

  const [xStr, setXStr] = useState('');
  const [yStr, setYStr] = useState('');
  const [propValues, setPropValues] = useState({});

  const primary = selectedElements[0] || null;
  const meta = primary ? elementMeta[primary.type] : null;
  const commonProps = useMemo(() => findCommonProperties(selectedElements), [selectedElements]);

  useEffect(() => {
    if (primary) {
      setXStr(String(Math.round(primary.x)));
      setYStr(String(Math.round(primary.y)));
    }
  }, [primary?.id, primary?.x, primary?.y]);

  const handleXChange = (e) => {
    setXStr(e.target.value);
    const val = parseFloat(e.target.value);
    if (!isNaN(val) && primary) setElementPosition(primary.id, val, primary.y);
  };

  const handleYChange = (e) => {
    setYStr(e.target.value);
    const val = parseFloat(e.target.value);
    if (!isNaN(val) && primary) setElementPosition(primary.id, primary.x, val);
  };

  const handlePropChange = useCallback((propName, value) => {
    selectedElements.forEach((el) => updateElementProps(el.id, { [propName]: value }));
  }, [selectedElements, updateElementProps]);

  const renderPropertyEditor = (prop) => {
    const same = allSameValue(selectedElements, prop.name);
    const value = same ? selectedElements[0]?.props?.[prop.name] : undefined;

    switch (prop.type) {
      case 'text':
      case 'textarea':
        return <input key={prop.name} type="text" className="left-panel__input" value={value ?? ''} placeholder={same ? '' : '—'} onChange={(e) => handlePropChange(prop.name, e.target.value)} />;
      case 'number':
        return <input key={prop.name} type="number" className="left-panel__input" value={value ?? ''} placeholder={same ? '' : '—'} onChange={(e) => handlePropChange(prop.name, parseFloat(e.target.value))} min={prop.min} max={prop.max} step={prop.step || 1} />;
      case 'select':
        return (
          <select key={prop.name} className="left-panel__select" value={same ? (value ?? '') : ''} onChange={(e) => handlePropChange(prop.name, e.target.value)}>
            {!same && <option value="" disabled>—</option>}
            {prop.options?.map(opt => {
              const optValue = typeof opt === 'object' ? opt.value : opt;
              const optLabel = typeof opt === 'object' ? opt.label : opt;
              return <option key={optValue} value={optValue}><TranslatedLabel text={optLabel} /></option>;
            })}
          </select>
        );
      case 'checkbox':
        return (
          <label key={prop.name} className="left-panel__checkbox">
            <input type="checkbox" checked={same ? !!value : false} onChange={(e) => handlePropChange(prop.name, e.target.checked)} />
            {!same && <span style={{ color: 'var(--text-tertiary)' }}>—</span>}
          </label>
        );
      case 'color':
        return <input key={prop.name} type="color" className="left-panel__color-input" value={same ? (value || '#000000') : '#000000'} onChange={(e) => handlePropChange(prop.name, e.target.value)} />;
      default:
        return null;
    }
  };

  const { grouped, ungrouped } = useMemo(() => {
    const groups = {};
    const alone = [];
    commonProps.forEach((p) => {
      if (p.group) {
        if (!groups[p.group]) groups[p.group] = [];
        groups[p.group].push(p);
      } else {
        alone.push(p);
      }
    });
    return { grouped: groups, ungrouped: alone };
  }, [commonProps]);

  const collapseItems = useMemo(() =>
    Object.entries(grouped).map(([groupName, groupProps]) => ({
      key: groupName,
      label: <TranslatedLabel text={groupName} />,
      children: groupProps.map((prop) => (
        <div key={prop.name} className="left-panel__input-group">
          <label className="left-panel__label"><TranslatedLabel text={prop.label} /></label>
          {renderPropertyEditor(prop)}
        </div>
      )),
    })),
    [grouped, selectedElements, propValues]
  );

  if (selectedElements.length === 0) {
    return (
      <div className="left-panel">
        <div className="left-panel__title">{t('properties')}</div>
        <div className="left-panel__empty">{t('selectElement')}</div>
      </div>
    );
  }

  return (
    <div className="left-panel">
      <div className="left-panel__title">
        {selectedElements.length > 1
          ? `${t('selected')}: ${selectedElements.length} ${t('elements')}`
          : t('properties')}
      </div>

      {selectedElements.length > 1 && (
        <div className="left-panel__section-label">
          {selectedElements.map((el) => {
            const label = elementMeta[el.type]?.label || el.type;
            return <TranslatedLabel key={el.id} text={label} />;
          }).reduce((prev, curr, index) => [prev, index > 0 && ', ', curr], [])}
        </div>
      )}

      {selectedElements.length === 1 && (
        <div className="left-panel__section-label">
          <TranslatedLabel text={meta?.label || primary.type} />
        </div>
      )}

      {selectedElements.length === 1 && (
        <Collapse
          ghost
          items={[{
            key: 'position',
            label: t('position'),
            children: (
              <>
                <div className="left-panel__input-group">
                  <label className="left-panel__label">PosX</label>
                  <input type="number" className="left-panel__input" value={xStr} onChange={handleXChange} />
                </div>
                <div className="left-panel__input-group">
                  <label className="left-panel__label">PosY</label>
                  <input type="number" className="left-panel__input" value={yStr} onChange={handleYChange} />
                </div>
              </>
            ),
          }]}
          defaultActiveKey={['position']}
        />
      )}

      {ungrouped.map((prop) => (
        <div key={prop.name} className="left-panel__input-group">
          <label className="left-panel__label"><TranslatedLabel text={prop.label} /></label>
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
    </div>
  );
}