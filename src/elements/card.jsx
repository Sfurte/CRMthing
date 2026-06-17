import { Card } from 'antd';
import { CreditCardOutlined } from '@ant-design/icons';
import useStore from '../store';
import { textBlock, textStyles } from './blocks/textStyle';
import InlineEditable from './InlineEditable';
import './card.css';

export const definition = {
  type: 'Card',
  label: 'card',
  icon: CreditCardOutlined,
  defaultProps: {
    title: 'title',
    content: 'cardText',
    bgColor: '#ffffff',
    ...textBlock.defaultProps,
  },
  properties: [
    { name: 'bgColor', label: 'bgColor', type: 'color' },
    ...textBlock.properties,
  ],
};

export default function CardElement({ element }) {
  const updateElementProps = useStore((s) => s.updateElementProps);
  const props = element?.props || definition.defaultProps;
  const { title, content, bgColor } = props;
  const ts = textStyles(props);

  return (
    <Card
      title={
        <InlineEditable
          value={title}
          onSave={(val) => updateElementProps(element.id, { title: val })}
          style={{ fontWeight: 600, padding: 0, ...ts }}
        />
      }
      className="element-card"
      style={{ backgroundColor: bgColor || '#fff', height: '100%', width: '100%' }}
      styles={{ body: { flex: 1, overflow: 'auto', padding: '12px 16px' } }}
    >
      <InlineEditable
        value={content}
        onSave={(val) => updateElementProps(element.id, { content: val })}
        multiline
        style={ts}
      />
    </Card>
  );
}
