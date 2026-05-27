import { Card } from 'antd';
import { CreditCardOutlined } from '@ant-design/icons';

export const definition = {
  type: 'Card',
  label: 'Карточка',
  icon: CreditCardOutlined,
  defaultProps: {
    title: 'Заголовок',
    content: 'Текст карточки',
  },
  properties: [
    { name: 'title', label: 'Заголовок', type: 'text' },
    { name: 'content', label: 'Текст', type: 'textarea' },
  ],
};

export default function CardElement({ element, isSelected }) {
  const { title, content } = element.props || {};

  return (
    <Card 
      title={title} 
      style={{ 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column' 
      }}
      bodyStyle={{ flex: 1, overflow: 'auto' }}
    >
      {content}
    </Card>
  );
}