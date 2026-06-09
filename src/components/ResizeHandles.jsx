import { useCallback, useEffect, useRef, useContext } from 'react';
import useStore from '../store';
import { TransformContext } from '../contexts/TransformContext';
import './ResizeHandles.css';

const handlePositions = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];

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

    if (dir.includes('e')) newW = startSize.current.w + canvasDx;
    if (dir.includes('w')) {
      newX = startElPos.current.x + canvasDx;
      newW = startSize.current.w - canvasDx;
    }
    if (dir.includes('s')) newH = startSize.current.h + canvasDy;
    if (dir.includes('n')) {
      newY = startElPos.current.y + canvasDy;
      newH = startSize.current.h - canvasDy;
    }

    const clampedW = Math.max(20, Math.round(newW));
    const clampedH = Math.max(20, Math.round(newH));

    if (clampedW !== newW && dir.includes('w')) {
      newX = startElPos.current.x + (startSize.current.w - 20);
    }
    if (clampedH !== newH && dir.includes('n')) {
      newY = startElPos.current.y + (startSize.current.h - 20);
    }

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
    startSize.current = { w: element.width || 200, h: element.height || 100 };
    startElPos.current = { x: element.x || 0, y: element.y || 0 };

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
      {handlePositions.map((dir) => (
        <div
          key={dir}
          className={'resize-handle resize-handle--' + dir}
          onPointerDown={(e) => startResize(e, dir)}
        />
      ))}
    </>
  );
}
