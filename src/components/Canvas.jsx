import { useDroppable } from '@dnd-kit/core';
import { useEffect } from 'react';
import useStore, { selectActivePageElements } from '../store';
import DraggableElement from './DraggableElement';
import useCanvasTransform from '../hooks/useCanvasTransform';
import useCombinedRef from '../hooks/useCombinedRef';
import { ARTBOARD_WIDTH, ARTBOARD_HEIGHT } from '../constants';
import { useTransformRef } from '../contexts/TransformContext';

export default function Canvas({ canvasRectRef, onElementContextMenu }) {
  const elements = useStore(selectActivePageElements);
  const selectElement = useStore((s) => s.selectElement);
  const setViewTransform = useStore((s) => s.setViewTransform);
  const setElementPosition = useStore((s) => s.setElementPosition);

  const { setNodeRef } = useDroppable({ id: 'canvas' });
  const { transform, containerRef, handlePointerDown, handlePointerMove, handlePointerUp, spacePressed } = useCanvasTransform();

  const transformRef = useTransformRef();
  transformRef.current = transform;

  useEffect(() => {
    const node = containerRef.current;
    if (!node || !canvasRectRef) return;
    const updateRect = () => { canvasRectRef.current = node.getBoundingClientRect(); };
    updateRect();
    const observer = new ResizeObserver(updateRect);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const mergedRef = useCombinedRef(containerRef, setNodeRef);
  const isPanning = spacePressed.current;
  const { x: panX, y: panY, zoom } = transform;

  // Обработка перемещения элементов
  const handleDragMove = (event) => {
    const { active } = event;
    if (active.data.current?.isCanvasElement) {
      const { translated } = active.rect.current;
      if (translated && canvasRectRef.current) {
        const { x, y } = {
          x: (translated.left - canvasRectRef.current.left - panX) / zoom,
          y: (translated.top - canvasRectRef.current.top - panY) / zoom,
        };
        setElementPosition(active.id, x, y);
      }
    }
  };

  return (
    <div
      ref={mergedRef}
      style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: '#F0F7FF', cursor: isPanning ? 'grab' : 'default', border: '1px solid #D4D4D4' }}
      onPointerDown={handlePointerDown}
      onPointerMove={(e) => { handlePointerMove(e); handleDragMove(e); }}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onClick={() => selectElement(null)}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, width: 1, height: 1, transform: `translate(${panX}px, ${panY}px) scale(${zoom})`, transformOrigin: '0 0' }}>
        <div style={{ width: ARTBOARD_WIDTH, height: ARTBOARD_HEIGHT, background: '#fff', position: 'relative', overflow: 'hidden', border: '1px dashed #3B82F6' }}>
          {elements.map((el) => (
            <DraggableElement key={el.id} element={el} zoom={zoom} onContextMenu={onElementContextMenu} />
          ))}
        </div>
      </div>
    </div>
  );
}