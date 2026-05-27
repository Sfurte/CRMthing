import { Row, Col, Typography } from 'antd';
import { LayoutOutlined } from '@ant-design/icons';

const { Text } = Typography;

export const definition = {
  type: 'Grid',
  label: 'Сетка',
  icon: LayoutOutlined,
  defaultProps: {
    gutter: [16, 16],
    justify: 'start',
    align: 'top',
    wrap: true,
    
    columns: [
      { 
        id: 'col-1', 
        span: 12, 
        content: 'Колонка 1',
        xs: 24, sm: 12, md: 8, lg: 6, xl: 4,
        offset: 0, order: 0, push: 0, pull: 0,
      },
      { 
        id: 'col-2', 
        span: 12, 
        content: 'Колонка 2',
        xs: 24, sm: 12, md: 8, lg: 6, xl: 4,
        offset: 0, order: 0, push: 0, pull: 0,
      },
    ],
    
    columnHeight: 100,
    columnBg: '#f5f5f5',
    columnBorder: true,
    showContent: true,
  },
  properties: [
    { name: 'gutterHorizontal', label: 'Отступ по горизонтали (px)', type: 'number', min: 0, max: 100, default: 16 },
    { name: 'gutterVertical', label: 'Отступ по вертикали (px)', type: 'number', min: 0, max: 100, default: 16 },
    { name: 'justify', label: 'Гориз. выравнивание', type: 'select', options: ['start', 'end', 'center', 'space-around', 'space-between', 'space-evenly'] },
    { name: 'align', label: 'Верт. выравнивание', type: 'select', options: ['top', 'middle', 'bottom', 'stretch'] },
    { name: 'wrap', label: 'Перенос строк', type: 'checkbox' },
    
    { name: 'columnCount', label: 'Количество колонок', type: 'number', min: 1, max: 24, default: 2 },
    { name: 'columnHeight', label: 'Высота контента (px)', type: 'number', min: 50, max: 500, default: 100 },
    { name: 'columnBg', label: 'Фон колонки', type: 'color', default: '#f5f5f5' },
    { name: 'columnBorder', label: 'Рамка колонки', type: 'checkbox', default: true },
    { name: 'showContent', label: 'Показывать контент', type: 'checkbox', default: true },
  ],
};

export default function GridElement({ element, isSelected }) {
  const {
    gutter = [16, 16],
    justify = 'start',
    align = 'top',
    wrap = true,
    gutterHorizontal = 16,
    gutterVertical = 16,
    columns = [],
    columnHeight = 100,
    columnBg = '#f5f5f5',
    columnBorder = true,
    showContent = true,
  } = element.props || {};

  const rowGutter = [gutterHorizontal, gutterVertical];

  const colContentStyle = {
    height: columnHeight,
    background: columnBg,
    border: columnBorder ? '1px dashed #999' : 'none',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    textAlign: 'center',
    pointerEvents: isSelected ? 'none' : 'auto',
    transition: 'all 0.2s',
  };

  const getResponsiveProps = (col) => {
    const responsive = {};
    ['xs', 'sm', 'md', 'lg', 'xl'].forEach((bp) => {
      if (col[bp] !== undefined && col[bp] !== null && col[bp] !== '') {
        responsive[bp] = { span: col[bp] };
      }
    });
    return responsive;
  };

  return (
    <div style={{ 
      width: '100%', 
      maxWidth: 1400, 
      pointerEvents: isSelected ? 'none' : 'auto',
      padding: 8,
    }}>
      <Row 
        gutter={rowGutter} 
        justify={justify} 
        align={align} 
        wrap={wrap}
        style={{ minHeight: columnHeight }}
      >
        {columns.map((col, index) => {
          const colProps = {
            key: col.id || `col-${index}`,
            span: col.span || 24,
            offset: col.offset || 0,
            order: col.order || 0,
            push: col.push || 0,
            pull: col.pull || 0,
            ...getResponsiveProps(col),
          };

          return (
            <Col {...colProps} key={colProps.key}>
              {showContent ? (
                <div style={colContentStyle}>
                  <div>
                    <Text strong>{col.content || `Колонка ${index + 1}`}</Text>
                    <div style={{ marginTop: 4, fontSize: 11, color: '#888' }}>
                      span={col.span}
                      {col.xs && ` | xs:${col.xs}`}
                      {col.sm && ` | sm:${col.sm}`}
                      {col.md && ` | md:${col.md}`}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ 
                  height: columnHeight, 
                  border: columnBorder ? '1px dashed #ccc' : 'none',
                  borderRadius: 8,
                }} />
              )}
            </Col>
          );
        })}
      </Row>
    </div>
  );
}