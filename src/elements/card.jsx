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
    { name: 'title', label: 'title', type: 'text' },
    { name: 'content', label: 'content', type: 'textarea' },
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
    <div className="element-card" style={{ backgroundColor: bgColor || '#fff' }}>
      <div className="element-card__header">
        <InlineEditable
          value={title}
          onSave={(val) => updateElementProps(element.id, { title: val })}
          style={{ fontWeight: 600, ...ts }}
        />
      </div>
      <div className="element-card__body">
        <InlineEditable
          value={content}
          onSave={(val) => updateElementProps(element.id, { content: val })}
          multiline
          style={ts}
        />
      </div>
    </div>
  );
}
