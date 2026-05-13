import { useDraggable } from '@dnd-kit/core';
import { ElementRenderers } from '../elements/registry';
import useStore from '../store';
import { useRef, useEffect } from 'react';

export default function DraggableElement({ element, zoom }) {
  const selectElement = useStore((s) => s.selectElement);
  const { id, type, x, y } = element;
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    data: { isCanvasElement: true },
    activationConstraint: { distance: 5 },
  });

  const pointerDownPos = useRef(null);
  const elementRef = useRef(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const onPointerDownCapture = (e) => {
      pointerDownPos.current = { x: e.clientX, y: e.clientY };
    };

    const onPointerUpCapture = (e) => {
      const start = pointerDownPos.current;
      if (!start) return;
      const dx = Math.abs(e.clientX - start.x);
      const dy = Math.abs(e.clientY - start.y);
      if (dx < 5 && dy < 5) {
        selectElement(id);
      }
      pointerDownPos.current = null;
    };

    el.addEventListener('pointerdown', onPointerDownCapture, true);
    el.addEventListener('pointerup', onPointerUpCapture, true);

    return () => {
      el.removeEventListener('pointerdown', onPointerDownCapture, true);
      el.removeEventListener('pointerup', onPointerUpCapture, true);
    };
  }, [id, selectElement]);

  const mergedRef = (node) => {
    elementRef.current = node;
    setNodeRef(node);
  };

  const style = {
    position: 'absolute',
    left: x,
    top: y,
    transform: isDragging ? 'none' : undefined,
    cursor: isDragging ? 'grabbing' : 'grab',
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 100 : 1,
  };

  const Renderer = ElementRenderers[type] || ElementRenderers.Input;

  return (
    <div ref={mergedRef} style={style} {...listeners} {...attributes}>
      <Renderer />
    </div>
  );
}