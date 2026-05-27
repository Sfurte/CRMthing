import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { ELEMENTS } from '../elements';
import useStore from '../store';
import ResizeHandles from './ResizeHandles';
import ResizableElement from './ResizableElement';

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

  const currentWidth = element.width || 200;
  const currentHeight = element.height || 100;

  const style = {
    position: 'absolute',
    left: element.x,
    top: element.y,
    width: currentWidth,
    height: currentHeight,
    transform: CSS.Translate.toString(transform),
    zIndex: element.zIndex || 0,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'default',
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
      {/* Контейнер с pointerEvents: auto для контента */}
      <div style={{ width: '100%', height: '100%', pointerEvents: 'auto' }}>
        <ResizableElement>
          <ElementComponent element={element} isSelected={isSelected} />
        </ResizableElement>
      </div>
      
      {isSelected && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 50 }}>
          <ResizeHandles element={{ ...element, width: currentWidth, height: currentHeight }} />
        </div>
      )}
    </div>
  );
}