import { useState, useEffect } from 'react';
import { Radio } from 'antd';
import { CheckCircleOutlined, PlusOutlined } from '@ant-design/icons';
import useStore from '../store';
import { useLang } from '../hooks/useLang';
import { textBlock, textStyles } from './blocks/textStyle';
import InlineEditable from './InlineEditable';
import './radio.css';

export const definition = {
  type: 'Radio',
  label: 'radio',
  icon: CheckCircleOutlined,
  defaultWidth: 140,
  defaultHeight: 100,
  defaultProps: {
    options: [
      { label: 'variant 1', value: 'option1' },
      { label: 'variant 2', value: 'option2' },
      { label: 'variant 3', value: 'option3' },
    ],
    defaultValue: 'option1',
    direction: 'vertical',
    bgColor: 'transparent',
    ...textBlock.defaultProps,
  },
  properties: [
    { name: 'direction', label: 'direction', type: 'select', options: ['horizontal', 'vertical'] },
    { name: 'bgColor', label: 'bgColor', type: 'color' },
    ...textBlock.properties,
  ],
};

const stopDrag = (e) => { e.stopPropagation(); };

export default function RadioElement({ element, isSelected }) {
  const { t } = useLang();
  const updateElementProps = useStore((s) => s.updateElementProps);
  const props = element?.props || definition.defaultProps;
  const ts = textStyles(props);

  const { options = definition.defaultProps.options, defaultValue = 'option1', direction = 'vertical', bgColor = 'transparent' } = props;
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  useEffect(() => { setSelectedValue(defaultValue); }, [defaultValue]);

  const handleChange = (e) => { 
    setSelectedValue(e.target.value); 
    updateElementProps(element.id, { defaultValue: e.target.value }); 
  };

  const addOption = () => {
    updateElementProps(element.id, {
      options: [...options, { label: `${t('variant')} ${options.length + 1}`, value: `option${Date.now()}` }]
    });
  };
  const removeOption = (index) => {
    if (options.length <= 1) return;
    updateElementProps(element.id, { options: options.filter((_, i) => i !== index) });
  };
  const handleLabelSave = (index, newLabel) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], label: newLabel };
    updateElementProps(element.id, { options: newOptions });
  };

  return (
    <div className="element-radio" style={{ backgroundColor: bgColor || 'transparent' }}>
      <Radio.Group onChange={handleChange} value={selectedValue} direction={direction}
        className={'element-radio__group element-radio__group--' + direction}>
        {options.map((option, index) => (
          <div key={option.value} className="element-radio__item">
            <Radio 
              value={option.value}
              onPointerDown={stopDrag}
              onMouseDown={stopDrag}
            />
            <InlineEditable value={option.label} onSave={(val) => handleLabelSave(index, val)} style={ts} />
            {isSelected && options.length > 1 && (
              <button className="element-radio__remove-btn"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => { e.stopPropagation(); removeOption(index); }} title={t('deleteVariant')}>×</button>
            )}
          </div>
        ))}
      </Radio.Group>

      {isSelected && (
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); addOption(); }}
          style={{
            marginTop: 8, padding: '4px 12px', border: '1px dashed var(--accent)',
            borderRadius: 4, background: 'transparent', color: 'var(--accent)',
            cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4,
          }}
        >
          <PlusOutlined /> {t('addVariant')}
        </button>
      )}
    </div>
  );
}
