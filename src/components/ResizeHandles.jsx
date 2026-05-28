import { useCallback, useEffect, useRef, useContext } from 'react';
import useStore from '../store';
import { TransformContext } from '../contexts/TransformContext';

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
  'n':  { top: -5, left: '50%', transform: 'translateX(-50%)', cursor: 'ns-resize' },
  's':  { bottom: -5, left: '50%', transform: 'translateX(-50%)', cursor: 'ns-resize' },
  'e':  { right: -5, top: '50%', transform: 'translateY(-50%)', cursor: 'ew-resize' },
  'w':  { left: -5, top: '50%', transform: 'translateY(-50%)', cursor: 'ew-resize' },
  'ne': { top: -5, right: -5, cursor: 'nesw-resize' },
  'nw': { top: -5, left: -5, cursor: 'nwse-resize' },
  'se': { bottom: -5, right: -5, cursor: 'nwse-resize' },
  'sw': { bottom: -5, left: -5, cursor: 'nesw-resize' },
};

export default function ResizeHandles({ element }) {
  const resizeElement = useStore((s) => s.resizeElement);
  const setElementPosition = useStore((s) => s.setElementPosition);
  const transformRef = useContext(TransformContext);

  const isResizing = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const startSize = useRef({ w: 0, h: 0 });
  const startElPos = useRef({ x: 0, y: 0 });
  const activeHandle = useRef(null);

  const handlePointerMove = useCallback((e) => {
    if (!isResizing.current) return;

    const dx = e.clientX - startPos.current.x;
    const dy = e.clientY - startPos.current.y;

    const zoom = transformRef?.current?.zoom || 1;
    const canvasDx = dx / zoom;
    const canvasDy = dy / zoom;

    let newX = startElPos.current.x;
    let newY = startElPos.current.y;
    let newW = startSize.current.w;
    let newH = startSize.current.h;

    const dir = activeHandle.current;

    // East
    if (dir.includes('e')) newW = startSize.current.w + canvasDx;
    // West — left edge moves, width shrinks from the left
    if (dir.includes('w')) {
      newX = startElPos.current.x + canvasDx;
      newW = startSize.current.w - canvasDx;
    }
    // South
    if (dir.includes('s')) newH = startSize.current.h + canvasDy;
    // North — top edge moves, height shrinks from the top
    if (dir.includes('n')) {
      newY = startElPos.current.y + canvasDy;
      newH = startSize.current.h - canvasDy;
    }

    const clampedW = Math.max(20, Math.round(newW));
    const clampedH = Math.max(20, Math.round(newH));

    // Adjust position when size is clamped (prevents jumping)
    if (clampedW !== newW && dir.includes('w')) {
      newX = startElPos.current.x + (startSize.current.w - 20);
    }
    if (clampedH !== newH && dir.includes('n')) {
      newY = startElPos.current.y + (startSize.current.h - 20);
    }

    // Commit position + size together
    setElementPosition(element.id, Math.round(newX), Math.round(newY));
    resizeElement(element.id, clampedW, clampedH);
  }, [element.id, resizeElement, setElementPosition, transformRef]);

  const handlePointerUp = useCallback(() => {
    isResizing.current = false;
    activeHandle.current = null;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';

    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
  }, [handlePointerMove]);

  const startResize = useCallback((e, direction) => {
    e.stopPropagation();
    e.preventDefault();

    isResizing.current = true;
    activeHandle.current = direction;
    startPos.current = { x: e.clientX, y: e.clientY };
    startSize.current = {
      w: element.width || 200,
      h: element.height || 100,
    };
    startElPos.current = {
      x: element.x || 0,
      y: element.y || 0,
    };

    document.body.style.cursor = handlePositions[direction]?.cursor || 'default';
    document.body.style.userSelect = 'none';

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  }, [element, handlePointerMove, handlePointerUp]);

  useEffect(() => {
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [handlePointerMove, handlePointerUp]);

  return (
    <>
      {Object.entries(handlePositions).map(([dir, style]) => (
        <div
          key={dir}
          style={{ ...handleStyle, ...style }}
          onPointerDown={(e) => startResize(e, dir)}
        />
      ))}
    </>
  );
}
