import { useDroppable } from '@dnd-kit/core';
import { useEffect } from 'react';
import useStore, { selectActivePageElements } from '../store';
import DraggableElement from './DraggableElement';
import useCanvasTransform from '../hooks/useCanvasTransform';
import useCombinedRef from '../hooks/useCombinedRef';
import { ARTBOARD_WIDTH, ARTBOARD_HEIGHT } from '../constants';
import { useTransformRef } from '../contexts/TransformContext';
import './Canvas.css';

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
      className={'canvas' + (isPanning ? ' canvas--panning' : ' canvas--default')}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onClick={() => onCloseContext?.()}
      onContextMenu={(e) => {
        if (contextTargetId) {
          e.preventDefault();
          onCloseContext?.();
        }
      }}
    >
      <div
        className="canvas__world"
        style={{ transform: `translate(${panX}px, ${panY}px) scale(${zoom})` }}
      >
        <div className="canvas__artboard">
          {elements.map((el) => (
            <DraggableElement key={el.id} element={el} zoom={zoom} onContextMenu={onElementContextMenu} showContextBar={contextTargetId === el.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
