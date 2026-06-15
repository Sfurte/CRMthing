import { useDraggable } from '@dnd-kit/core';
import { CopyOutlined, ArrowUpOutlined, ArrowDownOutlined, DeleteOutlined } from '@ant-design/icons';
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
        <div style={{ padding: 8, background: '#fee', border: '1px solid #f99' }}>❌ {element.type}</div>
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
      onClick={(e) => { e.stopPropagation(); }}
      onContextMenu={(e) => { e.stopPropagation(); onContextMenu?.(e, element.id); }}
    >
      {showContextBar && (
        <div className="element__context-bar" data-context-action onPointerDown={(e) => e.stopPropagation()}>
          <button className="element__context-btn" onClick={(e) => { e.stopPropagation(); selectedIds.forEach((id) => moveUp(id)); }}>
            <ArrowUpOutlined />
          </button>
          <button className="element__context-btn" onClick={(e) => { e.stopPropagation(); selectedIds.forEach((id) => moveDown(id)); }}>
            <ArrowDownOutlined />
          </button>
          <button className="element__context-btn" onClick={(e) => {
            e.stopPropagation();
            const page = useStore.getState().projects[useStore.getState().activeProjectId]?.pages[useStore.getState().activePageId];
            const el = page?.elements.find((el) => el.id === element.id);
            if (el) {
              useStore.getState().setClipboard({
                type: el.type,
                width: el.width,
                height: el.height,
                props: el.props ? { ...el.props } : {},
              });
            }
          }}>
            <CopyOutlined />
          </button>
          <button className="element__context-btn" onClick={(e) => { e.stopPropagation(); selectElement(null); selectedIds.forEach((id) => removeElement(id)); }}>
            <DeleteOutlined />
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
