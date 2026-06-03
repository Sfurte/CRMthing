/**
 * AddComponentDropdown – a dropdown menu for adding new elements to the canvas.
 * Triggered from the toolbar "+" button.
 */
import { useState, useRef } from 'react';
import { ELEMENT_DEFINITIONS } from '../elements'; // ✅ Исправлено: импорт из index.js
import useStore from '../store';
import useClickOutside from '../hooks/useClickOutside';

const styles = {
  dropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: 8,
    width: 280,
    background: '#FFFFFF',
    border: '1px solid #E0E0E0',
    borderRadius: 12,
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.12)',
    zIndex: 1000,
    overflow: 'hidden',
    fontFamily: 'Inter',
  },
  header: {
    padding: '12px 16px',
    borderBottom: '1px solid #F0F0F0',
    fontWeight: 500,
    fontSize: 14,
    color: '#202020',
  },
  list: {
    listStyle: 'none',
    margin: 0,
    padding: 8,
    maxHeight: 400,
    overflowY: 'auto',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 12px',
    borderRadius: 8,
    cursor: 'pointer',
    transition: 'background 0.15s',
    fontSize: 14,
    color: '#202020',
  },
  itemHover: {
    background: '#F5F5F5',
  },
  icon: {
    width: 20,
    height: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#1677ff',
  },
  empty: {
    padding: '16px',
    textAlign: 'center',
    color: '#999',
    fontSize: 13,
  },
};

export default function AddComponentDropdown({ anchorRef, onClose }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const addElement = useStore((s) => s.addElement);
  const dropdownRef = useRef(null);

  // Закрыть при клике вне
  useClickOutside(dropdownRef, onClose);

  // Позиционирование относительно кнопки
  const dropdownStyle = { ...styles.dropdown };
  if (anchorRef?.current) {
    const rect = anchorRef.current.getBoundingClientRect();
    dropdownStyle.top = rect.bottom + 8;
    dropdownStyle.right = window.innerWidth - rect.right;
  }

  const handleSelect = (type) => {
    // Добавляем элемент в центр видимой области (упрощённо)
    // В реальном приложении здесь нужно вычислять координаты относительно канваса
    const x = 100; 
    const y = 100;
    addElement(type, x, y);
    onClose?.();
  };

  return (
    <div ref={dropdownRef} style={dropdownStyle}>
      <div style={styles.header}>Добавить компонент</div>
      
      {ELEMENT_DEFINITIONS.length > 0 ? (
        <ul style={styles.list}>
          {ELEMENT_DEFINITIONS.map((def, index) => {
            const Icon = def.icon;
            return (
              <li
                key={def.type}
                style={{
                  ...styles.item,
                  ...(hoveredIndex === index ? styles.itemHover : {}),
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => handleSelect(def.type)}
              >
                {Icon && (
                  <span style={styles.icon}>
                    <Icon />
                  </span>
                )}
                <span>{def.label}</span>
              </li>
            );
          })}
        </ul>
      ) : (
        <div style={styles.empty}>Нет доступных компонентов</div>
      )}
    </div>
  );
}