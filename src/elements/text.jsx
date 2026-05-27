import { Typography } from 'antd';
import { FontSizeOutlined } from '@ant-design/icons';

const { Text: AntText } = Typography;

export const definition = {
  type: 'Text',
  label: 'Текст',
  icon: FontSizeOutlined,
  defaultProps: {
    content: 'Текстовый элемент',
    fontSize: 14,
    color: '#202020',
    bold: false,
  },
  properties: [
    { name: 'content', label: 'Текст', type: 'textarea' },
    { name: 'fontSize', label: 'Размер шрифта', type: 'number', min: 8, max: 72 },
    { name: 'color', label: 'Цвет', type: 'color' },
    { name: 'bold', label: 'Жирный', type: 'checkbox' },
  ],
};

export default function TextElement({ element, isSelected }) {
  const { content = 'Текст', fontSize = 14, color = '#202020', bold = false } = element.props || {};

  return (
    <div style={{ padding: '4px 8px', pointerEvents: isSelected ? 'none' : 'auto' }}>
      <AntText
        style={{
          fontSize,
          color,
          fontWeight: bold ? 600 : 400,
          cursor: 'text',
          userSelect: 'none',
          padding: '2px 4px',
          display: 'inline-block',
        }}
      >
        {content}
      </AntText>
    </div>
  );
}