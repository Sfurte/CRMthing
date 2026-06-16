import { useState, useRef, useEffect } from 'react';
import useStore, { selectViewTransform } from '../store';
import { ARTBOARD_WIDTH, ARTBOARD_HEIGHT } from '../constants';
import './ZoomControl.css';

export default function ZoomControl() {
  const viewTransform = useStore(selectViewTransform);
  const setViewTransform = useStore((s) => s.setViewTransform);
  
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setInputValue(String(Math.round(viewTransform.zoom * 100)));
    }
  }, [viewTransform.zoom, isOpen]);

  const applyZoom = (val) => {
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      const clamped = Math.min(500, Math.max(20, num));
      const newZoom = clamped / 100;
      
      // ✅ Центрируем artboard в viewport
      const canvasElement = document.querySelector('.canvas');
      if (canvasElement) {
        const rect = canvasElement.getBoundingClientRect();
        const viewportWidth = rect.width;
        const viewportHeight = rect.height;
        
        const newX = (viewportWidth - ARTBOARD_WIDTH * newZoom) / 2;
        const newY = (viewportHeight - ARTBOARD_HEIGHT * newZoom) / 2;
        
        setViewTransform({ x: newX, y: newY, zoom: newZoom });
      } else {
        // Fallback: если canvas не найден, используем window
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight - 120; // вычитаем header и toolbar
        
        const newX = (viewportWidth - ARTBOARD_WIDTH * newZoom) / 2;
        const newY = (viewportHeight - ARTBOARD_HEIGHT * newZoom) / 2;
        
        setViewTransform({ x: newX, y: newY, zoom: newZoom });
      }
    }
  };

  const handleInput = (e) => {
    setInputValue(e.target.value);
    applyZoom(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.target.blur();
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={containerRef} className="zoom-control">
      <button className="zoom-control__btn" onClick={() => setIsOpen(!isOpen)}>
        {Math.round(viewTransform.zoom * 100)}%
      </button>
      {isOpen && (
        <div className="zoom-control__dropdown">
          <label className="zoom-control__label">Масштаб (%)</label>
          <input
            type="number"
            className="zoom-control__input"
            value={inputValue}
            min={20}
            max={500}
            autoFocus
            onBlur={() => setIsOpen(false)}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
          />
        </div>
      )}
    </div>
  );
}