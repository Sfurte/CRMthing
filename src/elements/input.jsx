import { Input } from 'antd';
import { FormOutlined } from '@ant-design/icons';

export const definition = {
  type: 'Input',
  label: 'Поле ввода',
  icon: FormOutlined,
  defaultProps: {
    label: 'Текст',
    placeholder: 'Введите текст...',
    size: 'middle',
    showLabel: true,
  },
  properties: [
    { name: 'label', label: 'Подпись', type: 'text' },
    { name: 'placeholder', label: 'Плейсхолдер', type: 'text' },
    { name: 'size', label: 'Размер', type: 'select', options: ['large', 'middle', 'small'] },
    { name: 'showLabel', label: 'Показывать подпись', type: 'checkbox' },
  ],
};

export default function InputElement({ element, isSelected }) {
  const { label = 'Текст', placeholder, size = 'middle', showLabel = true } = element.props || {};

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      width: '100%',
      pointerEvents: isSelected ? 'none' : 'auto',
    }}>
      {showLabel && (
        <label style={{
          fontWeight: 500,
          color: '#374151',
          fontSize: 12,
          userSelect: 'none',
        }}>
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