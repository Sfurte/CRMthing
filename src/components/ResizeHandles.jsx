import { useCallback, useEffect, useRef } from 'react';
import useStore from '../store';

const handleStyle = {
  position: 'absolute',
  width: 10,
  height: 10,
  background: '#fff',
  border: '2px solid #1890ff',
  borderRadius: '50%',
  zIndex: 100,
  pointerEvents: 'auto',
};

const handlePositions = {
  'n': { top: -5, left: '50%', transform: 'translateX(-50%)', cursor: 'ns-resize' },
  's': { bottom: -5, left: '50%', transform: 'translateX(-50%)', cursor: 'ns-resize' },
  'e': { right: -5, top: '50%', transform: 'translateY(-50%)', cursor: 'ew-resize' },
  'w': { left: -5, top: '50%', transform: 'translateY(-50%)', cursor: 'ew-resize' },
  'ne': { top: -5, right: -5, cursor: 'nesw-resize' },
  'nw': { top: -5, left: -5, cursor: 'nwse-resize' },
  'se': { bottom: -5, right: -5, cursor: 'nwse-resize' },
  'sw': { bottom: -5, left: -5, cursor: 'nesw-resize' },
};

export default function ResizeHandles({ element }) {
  const resizeElement = useStore((s) => s.resizeElement);
  const isResizing = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const startSize = useRef({ w: 0, h: 0 });
  const activeHandle = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!isResizing.current) return;
    
    const dx = e.clientX - startPos.current.x;
    const dy = e.clientY - startPos.current.y;
    
    let newW = startSize.current.w;
    let newH = startSize.current.h;
    
    const direction = activeHandle.current;

    if (direction.includes('e')) {
      newW = startSize.current.w + dx;
    }
    if (direction.includes('w')) {
      newW = startSize.current.w - dx;
    }
    if (direction.includes('s')) {
      newH = startSize.current.h + dy;
    }
    if (direction.includes('n')) {
      newH = startSize.current.h - dy;
    }

    resizeElement(element.id, Math.max(20, newW), Math.max(20, newH));
  }, [element.id, resizeElement]);

  const handleMouseUp = useCallback(() => {
    isResizing.current = false;
    activeHandle.current = null;
    document.body.style.cursor = '';
    
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  const startResize = useCallback((e, direction) => {
    e.stopPropagation();
    e.preventDefault();
    
    isResizing.current = true;
    activeHandle.current = direction;
    startPos.current = { x: e.clientX, y: e.clientY };
    startSize.current = { 
      w: element.width || 200, 
      h: element.height || 100 
    };
    
    document.body.style.cursor = handlePositions[direction]?.cursor || 'default';
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [element.width, element.height, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <>
      {Object.entries(handlePositions).map(([dir, style]) => (
        <div
          key={dir}
          style={{ ...handleStyle, ...style }}
          onMouseDown={(e) => startResize(e, dir)}
          onDoubleClick={(e) => e.stopPropagation()}
        />
      ))}
    </>
  );
}