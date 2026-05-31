import { ContainerOutlined } from '@ant-design/icons';

export const definition = {
  type: 'Container',
  label: 'Контейнер',
  icon: ContainerOutlined,
  defaultProps: {
    title: '',
    background: '#FAFBFC',
  },
  defaultWidth: 300,
  defaultHeight: 200,
  properties: [
    { name: 'title', label: 'Заголовок', type: 'text' },
    { name: 'background', label: 'Фон', type: 'color' },
  ],
};

export default function ContainerElement({ element }) {
  const { title = '', background = '#FAFBFC' } = element.props || {};

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background,
        border: '1px solid #E0E0E0',
        borderRadius: 8,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {title && (
        <div
          style={{
            padding: '8px 12px',
            fontSize: 13,
            fontWeight: 600,
            color: '#202020',
            borderBottom: '1px solid #E0E0E0',
            background: 'rgba(0,0,0,0.02)',
            userSelect: 'none',
          }}
        >
          {title}
        </div>
      )}
      <div style={{ flex: 1, minHeight: 0 }} />
    </div>
  );
}
