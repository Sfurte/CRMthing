import { Image, Input, Switch, Slider, Space, Typography } from 'antd';
import { PictureOutlined, LinkOutlined } from '@ant-design/icons';

const { Text } = Typography;

export const definition = {
  type: 'Image',
  label: 'Изображение',
  icon: PictureOutlined,
  defaultProps: {
    src: 'https://via.placeholder.com/300x200?text=Image',
    alt: 'Описание изображения',
    width: 300,
    height: 200,
    preview: true,
    bordered: true,
    borderRadius: 8,
    objectFit: 'cover',
    fallback: 'https://via.placeholder.com/300x200?text=Error',
    lazy: true,
  },
  properties: [
    { name: 'src', label: 'URL изображения', type: 'text' },
    { name: 'alt', label: 'Alt-текст', type: 'text' },
    { name: 'width', label: 'Ширина (px)', type: 'number', min: 50, max: 2000 },
    { name: 'height', label: 'Высота (px)', type: 'number', min: 50, max: 2000 },
    { name: 'preview', label: 'Включить предпросмотр', type: 'checkbox' },
    { name: 'bordered', label: 'Рамка', type: 'checkbox' },
    { name: 'borderRadius', label: 'Скругление углов (px)', type: 'number', min: 0, max: 100 },
    { 
      name: 'objectFit', 
      label: 'Масштабирование', 
      type: 'select', 
      options: ['contain', 'cover', 'fill', 'none', 'scale-down'] 
    },
    { name: 'fallback', label: 'Fallback URL', type: 'text' },
    { name: 'lazy', label: 'Ленивая загрузка', type: 'checkbox' },
  ],
};

export default function ImageElement({ element, isSelected }) {
  const {
    src = 'https://via.placeholder.com/300x200?text=Image',
    alt = 'Описание изображения',
    width = 300,
    height = 200,
    preview = true,
    bordered = true,
    borderRadius = 8,
    objectFit = 'cover',
    fallback = 'https://via.placeholder.com/300x200?text=Error',
    lazy = true,
  } = element.props || {};

  const imageStyle = {
    width,
    height,
    objectFit,
    borderRadius,
    border: bordered ? '1px solid #d9d9d9' : 'none',
    pointerEvents: isSelected ? 'none' : 'auto',
    cursor: preview ? 'zoom-in' : 'default',
    display: 'block',
    transition: 'opacity 0.2s',
  };

  return (
    <div style={{ 
      display: 'inline-block', 
      pointerEvents: isSelected ? 'none' : 'auto',
      position: 'relative',
    }}>
      <Image
        src={src}
        alt={alt}
        style={imageStyle}
        preview={preview ? {
          mask: typeof preview === 'boolean' ? null : preview.mask,
        } : false}
        fallback={fallback}
        loading={lazy ? 'lazy' : 'eager'}
        onError={(e) => {
          // Можно добавить логику обработки ошибки
          console.warn('Image load error:', src);
        }}
      />
      
      {/* Индикатор состояния при загрузке */}
      {!src && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f5f5f5',
          color: '#999',
          fontSize: 12,
          borderRadius,
        }}>
          <Space direction="vertical" align="center">
            <PictureOutlined style={{ fontSize: 24 }} />
            <Text type="secondary">Нет изображения</Text>
          </Space>
        </div>
      )}
    </div>
  );
}