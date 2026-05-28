/**
 * Renders a single element (Input, Button, etc.) at its stored position.
 *
 * Uses @dnd-kit's useDraggable to make it movable on the canvas.
 * Selection (click) is handled by App.jsx via the drag-end delta check.
 */
import { useDraggable } from '@dnd-kit/core';
import { ElementRenderers } from '../../elements/registry';

export default function DraggableElement({ element, zoom, onContextMenu }) {
  const { id, type, x, y } = element;

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    data: { isCanvasElement: true },
    // Small threshold so dnd-kit doesn't grab on plain click; App handles selection
    activationConstraint: { distance: 5 },
  });

  const Renderer = ElementRenderers[type] ?? ElementRenderers.Input;

  return (
    <div
      ref={setNodeRef}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        opacity: isDragging ? 0.8 : 1,
        zIndex: isDragging ? 100 : 1,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      {...listeners}
      {...attributes}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onContextMenu?.(e, id);
      }}
    >
      <Renderer />
    </div>
  );
}
