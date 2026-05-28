import { Typography } from 'antd';

const { Text } = Typography;

export const definition = {
  type: 'Text',
  label: 'Текст',
};

export default function TextElement() {
  return (
    <div style={{ padding: 4 }}>
      <Text
        editable={{
          autoSize: true,
          triggerType: ['text', 'icon'],
        }}
        style={{ fontSize: 14 }}
      >
        Текст
      </Text>
    </div>
  );
}
