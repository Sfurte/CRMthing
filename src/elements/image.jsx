import { useState, useRef } from 'react';
import { PictureOutlined, UploadOutlined } from '@ant-design/icons';
import useStore from '../store';
import { useLang } from '../hooks/useLang';
import './image.css';

export const definition = {
  type: 'Image',
  label: 'image',
  icon: PictureOutlined,
  defaultProps: {
    src: '',
    alt: 'image',
    objectFit: 'cover',
    borderRadius: 0,
  },
  properties: [
    { name: 'alt', label: 'alt', type: 'text' },
    { name: 'objectFit', label: 'scaling', type: 'select', options: ['cover', 'contain', 'fill'] },
    { name: 'borderRadius', label: 'borderRadius', type: 'number', min: 0, max: 100 },
  ],
};

export default function ImageElement({ element, isSelected }) {
  const { t } = useLang();
  const updateElementProps = useStore((s) => s.updateElementProps);
  const fileInputRef = useRef(null);
  const pointerStart = useRef(null);

  const props = element?.props || definition.defaultProps;
  const { src, alt, objectFit, borderRadius } = props;
  const [previewUrl, setPreviewUrl] = useState(src || '');

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert(t('selectImage'));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert(t('fileTooLarge'));
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result;
      if (base64) {
        setPreviewUrl(base64);
        updateElementProps(element.id, { src: base64 });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    setPreviewUrl('');
    updateElementProps(element.id, { src: '' });
  };

  const handlePointerDown = (e) => {
    pointerStart.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e) => {
    if (!pointerStart.current) return;
    if (e.button !== 0) return;
    const dx = Math.abs(e.clientX - pointerStart.current.x);
    const dy = Math.abs(e.clientY - pointerStart.current.y);
    pointerStart.current = null;
    if (dx < 5 && dy < 5) {
      handleUploadClick();
    }
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
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
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {previewUrl ? (
        <>
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
                onPointerDown={(e) => e.stopPropagation()}
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
              >
                <UploadOutlined /> {t('replace')}
              </button>
              <button
                onPointerDown={(e) => e.stopPropagation()}
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
              >
                {t('delete')}
              </button>
            </div>
          )}
        </>
      ) : (
        <div
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
            {isSelected ? t('clickToUpload') : t('uploadImage')}
          </p>
          {isSelected && (
            <p style={{ margin: '8px 0 0 0', fontSize: 12, color: '#666' }}>
              {t('uploadHint')}
            </p>
          )}
        </div>
      )}
    </div>
  );
}