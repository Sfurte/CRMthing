import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { ELEMENTS } from '../elements';
import useStore from '../store';

export default function DraggableElement({ element, zoom, onContextMenu }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: element.id,
    data: { 
      isCanvasElement: true, 
      elementId: element.id,
    },
  });

  const selectedId = useStore((state) => state.selectedId);
  const selectElement = useStore((state) => state.selectElement);
  const isSelected = selectedId === element.id;

  const style = {
    position: 'absolute',
    left: element.x,
    top: element.y,
    transform: CSS.Translate.toString(transform),
    zIndex: element.zIndex || 0,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
    pointerEvents: 'auto',
  };

  const ElementComponent = ELEMENTS[element.type];

  if (!ElementComponent) {
    return (
      <div ref={setNodeRef} {...listeners} {...attributes} style={style}>
        <div style={{ padding: 8, background: '#fee', border: '1px solid #f99' }}>
          ❌ {element.type}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`canvas-element ${isSelected ? 'selected' : ''}`}
      style={style}
      onContextMenu={(e) => {
        e.stopPropagation();
        onContextMenu?.(e, element);
      }}
      onClick={(e) => {
        e.stopPropagation();
        selectElement(element.id);
      }}
    >
      <ElementComponent element={element} isSelected={isSelected} />
    </div>
  );
}