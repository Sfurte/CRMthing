import { useState, useRef } from 'react';
import { PictureOutlined, UploadOutlined } from '@ant-design/icons';
import useStore from '../store';

export const definition = {
  type: 'Image',
  label: 'Изображение',
  icon: PictureOutlined,
  defaultProps: {
    src: '', // Пусто по умолчанию
    alt: 'Изображение',
    objectFit: 'cover', // 'cover' | 'contain' | 'fill'
    borderRadius: 0,
  },
  properties: [
    { name: 'alt', label: 'Описание (alt)', type: 'text' },
    { name: 'objectFit', label: 'Масштабирование', type: 'select', options: ['cover', 'contain', 'fill'] },
    { name: 'borderRadius', label: 'Скругление (px)', type: 'number', min: 0, max: 100 },
  ],
};

export default function ImageElement({ element, isSelected }) {
  const updateElementProps = useStore((s) => s.updateElementProps);
  const fileInputRef = useRef(null);
  
  const props = element?.props || definition.defaultProps;
  const { src, alt, objectFit, borderRadius } = props;
  
  const [previewUrl, setPreviewUrl] = useState(src || '');

  // Обработка загрузки файла
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Проверяем тип файла
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение (PNG, JPG, GIF, SVG)');
      return;
    }

    // Проверяем размер (макс 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Файл слишком большой. Максимальный размер: 5MB');
      return;
    }

    // Читаем файл как base64
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result;
      if (base64) {
        setPreviewUrl(base64);
        updateElementProps(element.id, { src: base64 });
      }
    };
    reader.onerror = () => {
      alert('Ошибка при чтении файла');
    };
    reader.readAsDataURL(file);
  };

  // Клик по кнопке загрузки
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Удалить изображение
  const handleRemove = () => {
    setPreviewUrl('');
    updateElementProps(element.id, { src: '' });
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        background: '#f5f5f5',
        borderRadius: Number(borderRadius) || 0,
        overflow: 'hidden',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Скрытый input для загрузки файлов */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {previewUrl ? (
        <>
          {/* Отображение изображения */}
          <img
            src={previewUrl}
            alt={alt}
            style={{
              width: '100%',
              height: '100%',
              objectFit: objectFit || 'cover',
              display: 'block',
            }}
          />
          
          {/* Кнопки управления (показываются при выделении) */}
          {isSelected && (
            <div
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                display: 'flex',
                gap: 8,
              }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleUploadClick();
                }}
                style={{
                  padding: '6px 10px',
                  background: '#fff',
                  border: '1px solid #d9d9d9',
                  borderRadius: 4,
                  cursor: 'pointer',
                  fontSize: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
                title="Заменить изображение"
              >
                <UploadOutlined /> Заменить
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                style={{
                  padding: '6px 10px',
                  background: '#fff',
                  border: '1px solid #ff4d4f',
                  borderRadius: 4,
                  color: '#ff4d4f',
                  cursor: 'pointer',
                  fontSize: 12,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
                title="Удалить изображение"
              >
                Удалить
              </button>
            </div>
          )}
        </>
      ) : (
        /* Плейсхолдер (когда изображение не загружено) */
        <div
          onClick={(e) => {
            e.stopPropagation();
            if (isSelected) {
              handleUploadClick();
            }
          }}
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: isSelected ? 'pointer' : 'default',
            color: '#999',
            padding: 20,
          }}
        >
          <PictureOutlined style={{ fontSize: 48, marginBottom: 12, color: '#d9d9d9' }} />
          <p style={{ margin: 0, fontSize: 14, textAlign: 'center' }}>
            {isSelected ? 'Нажмите для загрузки' : 'Загрузите изображение'}
          </p>
          {isSelected && (
            <p style={{ margin: '8px 0 0 0', fontSize: 12, color: '#666' }}>
              PNG, JPG, GIF до 5MB
            </p>
          )}
        </div>
      )}
    </div>
  );
}