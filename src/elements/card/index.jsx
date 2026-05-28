import { Card } from 'antd';

export const definition = {
  type: 'Card',
  label: 'Карточка',
};

export default function CardElement() {
  return (
    <div style={{ width: 300, padding: 4 }}>
      <Card
        size="small"
        title="Заголовок карточки"
        style={{ width: '100%' }}
      >
        <p>Содержимое карточки</p>
      </Card>
    </div>
  );
}
