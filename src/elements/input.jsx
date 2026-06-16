import { Input } from 'antd';
import { FormOutlined } from '@ant-design/icons';
import { useLang } from '../hooks/useLang';
import { textBlock, textStyles } from './blocks/textStyle';
import './input.css';

export const definition = {
  type: 'Input',
  label: 'input',
  icon: FormOutlined,
  defaultWidth: 200,
  defaultHeight: 60,
  defaultProps: {
    label: 'label',
    placeholder: 'enterTextPlaceholder',
    size: 'middle',
    showLabel: true,
    ...textBlock.defaultProps,
  },
  properties: [
    { name: 'label', label: 'label', type: 'text' },
    { name: 'placeholder', label: 'placeholder', type: 'text' },
    { name: 'size', label: 'size', type: 'select', options: ['large', 'middle', 'small'] },
    { name: 'showLabel', label: 'showLabel', type: 'checkbox' },
    ...textBlock.properties,
  ],
};

// ✅ Функция для остановки drag при клике на инпут
const stopDrag = (e) => {
  e.stopPropagation();
};

export default function InputElement({ element, isSelected }) {
  const { t } = useLang();
  const props = element.props || {};
  const { label = 'label', placeholder = 'enterTextPlaceholder', size = 'middle', showLabel = true } = props;
  const ts = textStyles(props);

  const displayLabel = t(label) !== label ? t(label) : label;
  const displayPlaceholder = t(placeholder) !== placeholder ? t(placeholder) : placeholder;

  return (
    <div className="element-input" style={{ pointerEvents: 'auto' }}>
      {showLabel && (
        <label style={{ ...ts, fontWeight: 500, userSelect: 'none', marginBottom: 2 }}>
          {displayLabel}
        </label>
      )}
      <Input
        placeholder={displayPlaceholder}
        size={size}
        onPointerDown={stopDrag}
        onMouseDown={stopDrag}
        style={{ width: '100%' }}
      />
    </div>
  );
}