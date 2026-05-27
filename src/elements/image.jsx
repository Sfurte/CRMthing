import { Image } from 'antd';
import { PictureOutlined } from '@ant-design/icons';

export const definition = {
  type: 'Image',
  label: 'Изображение',
  icon: PictureOutlined,
  defaultProps: {
    src: 'https://via.placeholder.com/400x300?text=Image',
    objectFit: 'cover',
  },
  properties: [
    { name: 'src', label: 'URL', type: 'text' },
    { name: 'objectFit', label: 'Масштаб', type: 'select', options: ['cover', 'contain', 'fill', 'none'] },
  ],
};

export default function ImageElement({ element, isSelected }) {
  const { src, objectFit = 'cover' } = element.props || {};

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <Image
        src={src}
        preview={false}
        style={{
          width: '100%',
          height: '100%',
          objectFit: objectFit,
          display: 'block',
        }}
      />
    </div>
  );
}