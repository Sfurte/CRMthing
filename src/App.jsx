/**
 * Top-level application layout.
 * Wraps the content area in a DndContext (for drag-and-drop)
 * and a TransformProvider (so drag handlers can read pan/zoom).
 */
import { useCallback, useRef } from 'react';
import { DndContext } from '@dnd-kit/core';
import Header from './components/Header';
import LeftPanel from './components/LeftPanel';
import Toolbar from './components/Toolbar';
import Canvas from './components/Canvas';
import useStore from './store';
import { TransformProvider, useTransformRef } from './contexts/TransformContext';

/**
 * Converts a screen-space position to canvas-space coordinates,
 * accounting for the current pan and zoom.
 *
 * @param {number} screenX       - ClientX from the drag event
 * @param {number} screenY       - ClientY from the drag event
 * @param {DOMRect} canvasRect   - Bounding rect of the canvas container
 * @param {{ x: number, y: number, zoom: number }} transform - Current pan & zoom
 * @returns {{ x: number, y: number }}
 */
function toCanvasCoords(screenX, screenY, canvasRect, transform) {
  return {
    x: (screenX - canvasRect.left - transform.x) / transform.zoom,
    y: (screenY - canvasRect.top - transform.y) / transform.zoom,
  };
}

/** Inner component that has access to TransformContext */
function AppContent() {
  const addElement = useStore((s) => s.addElement);
  const selectElement = useStore((s) => s.selectElement);
  const setElementPosition = useStore((s) => s.setElementPosition);

  // Read the live transform via ref (no re-renders on pan/zoom)
  const transformRef = useTransformRef();

  // Ref to the canvas root DOM node's bounding rect; Canvas.jsx sets this for us
  const canvasRectRef = useRef(null);

  /**
   * Fires on every mouse move during a drag.
   * For already-placed elements: updates their position in real time.
   */
  const handleDragMove = useCallback(
    (event) => {
      const { active } = event;
      const data = active.data.current;
      if (!data?.isCanvasElement) return;

      const canvasRect = canvasRectRef.current;
      if (!canvasRect) return;

      const { translated } = active.rect.current;
      if (!translated) return;

      const transform = transformRef.current;
      const { x, y } = toCanvasCoords(
        translated.left,
        translated.top,
        canvasRect,
        transform
      );
      setElementPosition(active.id, x, y);
    },
    [setElementPosition]
  );

  /**
   * Fires when a drag ends.
   * - If the element barely moved (< 5px): treat as a click -> select it.
   * - If dropped from the palette onto the canvas: create a new element.
   */
  const handleDragEnd = useCallback(
    (event) => {
      const { active, over, delta } = event;

      // Minimal movement -> selection (not a drag)
      if (Math.abs(delta.x) < 5 && Math.abs(delta.y) < 5) {
        const data = active.data.current;
        if (data?.isCanvasElement) {
          selectElement(active.id);
          return;
        }
      }

      // Dropped somewhere other than the canvas -> ignore
      if (!over || over.id !== 'canvas') return;

      // Dropped from palette? (data.type is set only for new elements)
      const data = active.data.current;
      if (!data?.type) return;

      const canvasRect = canvasRectRef.current;
      if (!canvasRect) return;

      const { translated } = active.rect.current;
      const transform = transformRef.current;
      const { x, y } = toCanvasCoords(
        translated.left,
        translated.top,
        canvasRect,
        transform
      );
      addElement(data.type, x, y);
    },
    [addElement, selectElement]
  );

  return (
    <DndContext onDragMove={handleDragMove} onDragEnd={handleDragEnd}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Header />
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <LeftPanel />
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
            <Toolbar />
            <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
              <Canvas canvasRectRef={canvasRectRef} />
            </div>
          </div>
        </div>
      </div>
    </DndContext>
  );
}

/**
 * Public entry point - wraps AppContent with the TransformProvider.
 * The provider is at this level so both Canvas and AppContent can access it.
 */
export default function App() {
  return (
    <TransformProvider>
      <AppContent />
    </TransformProvider>
  );
}
