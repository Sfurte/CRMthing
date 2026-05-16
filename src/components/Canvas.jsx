/**
 * The main canvas area – a viewport into a panned/zoomed world.
 *
 * Layout hierarchy:
 *   Canvas (overflow:hidden viewport)        ← droppable target
 *     └── World container (translate + scale) ← everything inside is panned/zoomed
 *           └── Artboard (1440×900 white box)
 *                 ├── DraggableElement (Input)
 *                 ├── DraggableElement (Button)
 *                 └── …
 *
 * @param {{ current: DOMRect | null }} [props.canvasRectRef]
 *   If provided, Canvas will keep this ref up-to-date with the canvas element's
 *   bounding rect, so that parent components (like App) can compute canvas coordinates.
 */
import { useDroppable } from '@dnd-kit/core';
import { useEffect } from 'react';
import useStore from '../store';
import DraggableElement from './DraggableElement';
import useCanvasTransform from '../hooks/useCanvasTransform';
import useCombinedRef from '../hooks/useCombinedRef';
import { ARTBOARD_WIDTH, ARTBOARD_HEIGHT } from '../constants';
import { useTransformRef } from '../contexts/TransformContext';

export default function Canvas({ canvasRectRef }) {
  const elements = useStore((s) => s.elements);
  const selectElement = useStore((s) => s.selectElement);

  // dnd-kit droppable registration
  const { setNodeRef } = useDroppable({ id: 'canvas' });

  // Zoom / pan logic
  const { transform, containerRef, handlePointerDown, handlePointerMove, handlePointerUp, spacePressed } =
    useCanvasTransform();

  // Expose the latest transform via context ref so App.jsx can read it
  const transformRef = useTransformRef();
  transformRef.current = transform;

  // Keep canvasRectRef up-to-date even when the canvas is resized
  useEffect(() => {
    const node = containerRef.current;
    if (!node || !canvasRectRef) return;

    const updateRect = () => {
      canvasRectRef.current = node.getBoundingClientRect();
    };

    // Set initial value
    updateRect();

    // Watch for resizes (e.g. window resize, sidebar toggle)
    const observer = new ResizeObserver(updateRect);
    observer.observe(node);
    return () => observer.disconnect();
  }, []); // runs once on mount; refs are stable

  // Combine container ref with the droppable ref
  const mergedRef = useCombinedRef(containerRef, setNodeRef);

  const isPanning = spacePressed.current;
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
        cursor: isPanning ? 'grab' : undefined,
        border: '1px solid #D4D4D4',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onClick={() => selectElement(null)}
    >
      {/* World container: panned and zoomed via CSS transform */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 1,
          height: 1,
          transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
          transformOrigin: '0 0',
        }}
      >
        {/* Artboard – the white "page" with a dashed blue border */}
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
