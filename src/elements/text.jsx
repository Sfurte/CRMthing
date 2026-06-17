import { FontSizeOutlined } from '@ant-design/icons';
import useStore from '../store';
import { useLang } from '../hooks/useLang';
import { textBlock, textStyles } from './blocks/textStyle';
import InlineEditable from './InlineEditable';
import './text.css';

export const definition = {
  type: 'Text',
  label: 'text',
  icon: FontSizeOutlined,
  defaultProps: {
    content: 'enterText',
    textAlign: 'left',
    bgColor: 'transparent',
    ...textBlock.defaultProps,
  },
  properties: [
    { name: 'textAlign', label: 'textAlign', type: 'select', options: ['left', 'center', 'right', 'justify'] },
    { name: 'bgColor', label: 'bgColor', type: 'color' },
    ...textBlock.properties,
  ],
};

export default function TextElement({ element }) {
  const { t } = useLang();
  const updateElementProps = useStore((s) => s.updateElementProps);
  const props = element?.props || definition.defaultProps;
  const { content, textAlign, bgColor } = props;
  const ts = textStyles(props);

  const displayContent = t(content) !== content ? t(content) : content;

  return (
    <div
      className="element-text"
      style={{ backgroundColor: bgColor || 'transparent', textAlign: textAlign || 'left' }}
    >
      <InlineEditable
        value={content}
        onSave={(val) => updateElementProps(element.id, { content: val })}
        multiline
        style={{ ...ts, textAlign: textAlign || 'left' }}
      />
    </div>
  );
}
