import { Input } from 'antd';
import { FormOutlined } from '@ant-design/icons';
import { textBlock, textStyles } from './blocks/textStyle';

export const definition = {
  type: 'Input',
  label: 'Текстовое поле',
  icon: FormOutlined,
  defaultProps: {
    label: 'Текст',
    placeholder: 'Введите текст...',
    size: 'middle',
    showLabel: true,
    ...textBlock.defaultProps,
  },
  properties: [
    { name: 'label', label: 'Подпись', type: 'text' },
    { name: 'placeholder', label: 'Плейсхолдер', type: 'text' },
    { name: 'size', label: 'Размер', type: 'select', options: ['large', 'middle', 'small'] },
    { name: 'showLabel', label: 'Показывать подпись', type: 'checkbox' },
    ...textBlock.properties,
  ],
};

export default function InputElement({ element, isSelected }) {
  const props = element.props || {};
  const { label = 'Текст', placeholder, size = 'middle', showLabel = true } = props;
  const ts = textStyles(props);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 4,
      width: '100%', height: '100%',
      pointerEvents: isSelected ? 'none' : 'auto',
    }}>
      {showLabel && (
        <label style={{ ...ts, fontWeight: 500, userSelect: 'none', marginBottom: 2 }}>
          {label}
        </label>
      )}
      <Input
        placeholder={placeholder}
        size={size}
        onMouseDown={(e) => e.stopPropagation()}
        onFocus={(e) => e.stopPropagation()}
        style={{ width: '100%' }}
      />
    </div>
  );
}
