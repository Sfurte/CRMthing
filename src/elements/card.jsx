import { Card } from 'antd';
import { CreditCardOutlined } from '@ant-design/icons';

export const definition = {
  type: 'Card',
  label: 'Карточка',
  icon: CreditCardOutlined,
  defaultProps: {
    title: 'Заголовок карточки',
    content: 'Содержимое карточки',
    width: 300,
    bordered: true,
    backgroundColor: '#ffffff',
  },
  properties: [
    { name: 'title', label: 'Заголовок', type: 'text' },
    { name: 'content', label: 'Содержимое', type: 'textarea' },
    { name: 'width', label: 'Ширина (px)', type: 'number' },
    { name: 'bordered', label: 'Рамка', type: 'checkbox' },
    { name: 'backgroundColor', label: 'Фон', type: 'color' },
  ],
};

export default function CardElement({ element, isSelected }) {
  const { title, content, width = 300, bordered = true, backgroundColor = '#ffffff' } = element.props || {};

  return (
    <Card 
      title={title} 
      bordered={bordered}
      style={{ 
        width,
        backgroundColor,
        pointerEvents: isSelected ? 'none' : 'auto'
      }}
      size="small"
    >
      <p style={{ margin: 0 }}>{content}</p>
    </Card>
  );
}