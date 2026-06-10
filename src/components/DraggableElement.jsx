import { useDraggable } from '@dnd-kit/core';
import { ELEMENTS } from '../elements';
import useStore from '../store';
import ResizeHandles from './ResizeHandles';
import ResizableElement from './ResizableElement';
import './DraggableElement.css';

export default function DraggableElement({ element, zoom, onContextMenu, showContextBar }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: element.id,
    data: { 
      isCanvasElement: true, 
      elementId: element.id,
    },
  });

  const selectedIds = useStore((state) => state.selectedIds);
  const selectElement = useStore((state) => state.selectElement);
  const removeElement = useStore((state) => state.removeElement);
  const moveUp = useStore((state) => state.moveUp);
  const moveDown = useStore((state) => state.moveDown);
  const isSelected = selectedIds.includes(element.id);

  const currentWidth = element.width || 200;
  const currentHeight = element.height || 100;

  const className = 'element canvas-element'
    + (isDragging ? ' element--dragging' : '')
    + (isSelected ? ' element--selected selected' : '');

  const ElementComponent = ELEMENTS[element.type];

  if (!ElementComponent) {
    return (
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        className={className}
        style={{ left: element.x, top: element.y, width: currentWidth, height: currentHeight, zIndex: element.zIndex || 0 }}
      >
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
      className={className}
      style={{ left: element.x, top: element.y, width: currentWidth, height: currentHeight, zIndex: element.zIndex || 0 }}
      onClick={(e) => {
        e.stopPropagation();
      }}
      onContextMenu={(e) => {
        e.stopPropagation();
        onContextMenu?.(e, element.id);
      }}
    >
      {showContextBar && (
        <div className="element__context-bar" data-context-action onPointerDown={(e) => e.stopPropagation()}>
          <button className="element__context-btn" onClick={(e) => { e.stopPropagation(); moveUp(element.id); }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 12L12 5L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="element__context-btn" onClick={(e) => { e.stopPropagation(); moveDown(element.id); }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 19V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19 12L12 19L5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="element__context-btn" onClick={(e) => { e.stopPropagation(); selectElement(null); removeElement(element.id); }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      )}

      <div className="element__content">
        <ResizableElement>
          <ElementComponent element={element} isSelected={isSelected} />
        </ResizableElement>
      </div>
      
      {isSelected && (
        <div className="element__resize-overlay">
          <ResizeHandles element={{ ...element, width: currentWidth, height: currentHeight }} />
        </div>
      )}
    </div>
  );
}
