import { useDroppable } from '@dnd-kit/core';
import { useEffect } from 'react';
import useStore, { selectActivePageElements } from '../store';
import DraggableElement from './DraggableElement';
import useCanvasTransform from '../hooks/useCanvasTransform';
import useCombinedRef from '../hooks/useCombinedRef';
import { ARTBOARD_WIDTH, ARTBOARD_HEIGHT } from '../constants';
import { useTransformRef } from '../contexts/TransformContext';

export default function Canvas({ canvasRectRef, onElementContextMenu, contextTargetId, onCloseContext }) {
  const elements = useStore(selectActivePageElements);
  const selectElement = useStore((s) => s.selectElement);

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

  return (
    <div
      ref={mergedRef}
      style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: '#F0F7FF', cursor: isPanning ? 'grab' : 'default', border: '1px solid #D4D4D4' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onClick={() => onCloseContext?.()}
      onContextMenu={(e) => {
        // Right-click on empty canvas closes context menu, but doesn't deselect
        if (contextTargetId) {
          e.preventDefault();
          onCloseContext?.();
        }
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, width: 1, height: 1, transform: `translate(${panX}px, ${panY}px) scale(${zoom})`, transformOrigin: '0 0' }}>
        <div style={{ width: ARTBOARD_WIDTH, height: ARTBOARD_HEIGHT, background: '#fff', position: 'relative', overflow: 'hidden', border: '1px dashed #3B82F6' }}>
          {elements.map((el) => (
            <DraggableElement key={el.id} element={el} zoom={zoom} onContextMenu={onElementContextMenu} showContextBar={contextTargetId === el.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
