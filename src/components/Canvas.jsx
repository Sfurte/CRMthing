import { useDroppable } from '@dnd-kit/core';
import useStore from '../store';
import DraggableElement from './DraggableElement';
import useCanvasTransform from '../hooks/useCanvasTransform';

const ARTBOARD_WIDTH = 1440;
const ARTBOARD_HEIGHT = 900;

export default function Canvas({ canvasRef, transformRef, onCanvasClick }) {
  const elements = useStore((s) => s.elements);
  const { setNodeRef } = useDroppable({ id: 'canvas' });

  const {
    transform,
    containerRef,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    spacePressed,
  } = useCanvasTransform();

  if (transformRef) {
    transformRef.current = transform;
  }

  const mergedRef = (node) => {
    canvasRef.current = node;
    setNodeRef(node);
    containerRef.current = node;
  };

  const isPanningCursor = spacePressed.current ? 'grab' : undefined;
  const { x: panX, y: panY, zoom } = transform;

  return (
    <div
      ref={mergedRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        background: '#F0F7FF',
        cursor: isPanningCursor,
        outline: 'none',
        border: '1px solid #D4D4D4',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onClick={onCanvasClick}
    >
      {/* World container: everything inside here is panned/zoomed */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 1,
          height: 1,
          transform: 'translate(' + panX + 'px, ' + panY + 'px) scale(' + zoom + ')',
          transformOrigin: '0 0',
        }}
      >
        {/* Artboard with dashed blue border */}
        <div
          style={{
            width: ARTBOARD_WIDTH,
            height: ARTBOARD_HEIGHT,
            background: '#ffffff',
            position: 'relative',
            overflow: 'hidden',
            border: '1px dashed #3B82F6',
          }}
        >
          {elements.map((el) => (
            <DraggableElement key={el.id} element={el} zoom={zoom} />
          ))}
        </div>
      </div>


    </div>
  );
}