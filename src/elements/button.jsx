import { Button } from 'antd';
import { InteractionOutlined } from '@ant-design/icons';
import useStore from '../store';
import { useLang } from '../hooks/useLang';
import { textBlock, textStyles } from './blocks/textStyle';
import InlineEditable from './InlineEditable';
import './button.css';

export const definition = {
  type: 'Button',
  label: 'button',
  icon: InteractionOutlined,
  defaultProps: {
    text: 'clickMe',
    type: 'primary',
    ...textBlock.defaultProps,
  },
  properties: [
    { name: 'type', label: 'type', type: 'select', options: ['primary', 'default', 'dashed', 'text', 'link'] },
    ...textBlock.properties,
  ],
};

export default function ButtonElement({ element }) {
  const { t } = useLang();
  const { text = 'clickMe', type = 'primary' } = element.props || {};
  const props = element?.props || {};
  const ts = textStyles(props);
  const updateElementProps = useStore((s) => s.updateElementProps);

  const displayText = t(text) !== text ? t(text) : text;

  return (
    <div className="element-button">
      <Button type={type} block style={{ width: '100%', height: '100%', ...ts, pointerEvents: 'auto' }}>
        <InlineEditable
          value={text}
          onSave={(val) => updateElementProps(element.id, { text: val })}
          style={{ background: 'transparent', border: 'none', padding: 0, minHeight: 'auto', color: 'inherit', fontWeight: 'inherit', fontSize: 'inherit', lineHeight: 'inherit', textAlign: 'center' }}
        />
      </Button>
    </div>
  );
}
