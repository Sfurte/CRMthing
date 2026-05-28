import { Button } from 'antd';

export const definition = {
  type: 'Button',
  label: 'Кнопка',
};

export default function ButtonElement() {
  return (
    <div style={{ padding: 4 }}>
      <Button type="primary" size="middle">
        Кнопка
      </Button>
    </div>
  );
}
