/**
 * Manages zoom (scroll wheel) and pan (middle-mouse / Space+left-click).
 *
 * All state lives in the Zustand store (`viewTransform`).
 * This hook just attaches event listeners and calls store actions.
 */
import { useCallback, useRef, useEffect } from 'react';
import useStore from '../store';
import { MIN_ZOOM, MAX_ZOOM } from '../constants';

export default function useCanvasTransform() {
  const { x: panX, y: panY, zoom } = useStore((s) => s.viewTransform);
  const setViewTransform = useStore((s) => s.setViewTransform);

  const containerRef = useRef(null);

  // ---- Pan state (kept in refs to avoid re-renders on every pixel) ----
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });
  const transformOnPanStart = useRef({ x: 0, y: 0 });
  const spacePressed = useRef(false);

  // ---- Zoom with scroll wheel ----
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handler = (e) => {
      e.preventDefault();

      const delta = -e.deltaY * 0.15 * 0.01;
      const zoomFactor = 1 + delta;

      // Read the latest state directly - the store is synchronous
      const prev = useStore.getState().viewTransform;
      const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, prev.zoom * zoomFactor));

      // Zoom toward cursor - keeps the point under the mouse fixed
      const rect = el.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const scale = newZoom / prev.zoom;
      const newX = mouseX - scale * (mouseX - prev.x);
      const newY = mouseY - scale * (mouseY - prev.y);

      setViewTransform({ x: newX, y: newY, zoom: newZoom });
    };

    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, [setViewTransform]);

  // ---- Pan via pointer events ----
  const handlePointerDown = useCallback((e) => {
    // Middle mouse button OR left-click while space is held
    if (e.button === 1 || (e.button === 0 && spacePressed.current)) {
      e.preventDefault();
      isPanning.current = true;
      panStart.current = { x: e.clientX, y: e.clientY };
      // Snapshot the current transform from the store at pan start
      const { x, y } = useStore.getState().viewTransform;
      transformOnPanStart.current = { x, y };
    }
  }, []);

  const handlePointerMove = useCallback((e) => {
    if (!isPanning.current) return;
    const dx = e.clientX - panStart.current.x;
    const dy = e.clientY - panStart.current.y;
    // Read the latest zoom from the store
    const { zoom: currentZoom } = useStore.getState().viewTransform;
    setViewTransform({
      x: transformOnPanStart.current.x + dx,
      y: transformOnPanStart.current.y + dy,
      zoom: currentZoom,
    });
  }, [setViewTransform]);

  const handlePointerUp = useCallback(() => {
    isPanning.current = false;
  }, []);

  // ---- Space key toggles alternative pan mode ----
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        spacePressed.current = true;
      }
    };
    const onKeyUp = (e) => {
      if (e.code === 'Space') {
        spacePressed.current = false;
        if (isPanning.current) isPanning.current = false;
      }
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  return {
    /** The current { x, y, zoom } from the store (read from subscription) */
    transform: { x: panX, y: panY, zoom },
    containerRef,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    spacePressed,
  };
}
