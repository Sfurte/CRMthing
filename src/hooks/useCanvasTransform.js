import { useState, useCallback, useRef, useEffect } from 'react';
import useStore from '../store';

const MIN_ZOOM = 0.2;
const MAX_ZOOM = 5;

export default function useCanvasTransform() {
  const storeZoom = useStore((s) => s.zoom);
  const setStoreZoom = useStore((s) => s.setZoom);

  const [transform, setTransform] = useState(() => ({
    x: 0,
    y: 0,
    zoom: storeZoom,
  }));

  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });
  const transformOnPanStart = useRef({ x: 0, y: 0 });
  const spacePressed = useRef(false);
  const containerRef = useRef(null);

  // Keep a ref to the latest store zoom for external changes
  const storeZoomRef = useRef(storeZoom);
  storeZoomRef.current = storeZoom;

  // --- Zoom (attached via useEffect for passive:false) ---
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handler = (e) => {
      e.preventDefault();

      const delta = -e.deltaY * 0.15 * 0.01;
      const zoomFactor = 1 + delta;

      setTransform((prev) => {
        const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, prev.zoom * zoomFactor));

        const rect = el.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const scale = newZoom / prev.zoom;
        const newX = mouseX - scale * (mouseX - prev.x);
        const newY = mouseY - scale * (mouseY - prev.y);

        // Update the store
        setStoreZoom(newZoom);

        return { x: newX, y: newY, zoom: newZoom };
      });
    };

    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, [setStoreZoom]);

  // React to external zoom changes (from toolbar input)
  const prevStoreZoom = useRef(storeZoom);
  useEffect(() => {
    const sz = storeZoomRef.current;
    const prev = prevStoreZoom.current;
    prevStoreZoom.current = sz;

    if (Math.abs(sz - prev) > 0.001) {
      setTransform((prev) => {
        const scale = sz / prev.zoom;
        const el = containerRef.current;
        let cx = window.innerWidth / 2;
        let cy = window.innerHeight / 2;
        if (el) {
          const rect = el.getBoundingClientRect();
          cx = rect.width / 2;
          cy = rect.height / 2;
        }
        const newX = cx - scale * (cx - prev.x);
        const newY = cy - scale * (cy - prev.y);
        return { x: newX, y: newY, zoom: sz };
      });
    }
  }, [storeZoom]);

  // --- Pan start ---
  const handlePointerDown = useCallback((e) => {
    if (e.button === 1 || (e.button === 0 && spacePressed.current)) {
      e.preventDefault();
      isPanning.current = true;
      panStart.current = { x: e.clientX, y: e.clientY };
      setTransform((prev) => {
        transformOnPanStart.current = { x: prev.x, y: prev.y };
        return prev;
      });
    }
  }, []);

  const handlePointerMove = useCallback((e) => {
    if (!isPanning.current) return;
    const dx = e.clientX - panStart.current.x;
    const dy = e.clientY - panStart.current.y;
    setTransform((prev) => ({
      ...prev,
      x: transformOnPanStart.current.x + dx,
      y: transformOnPanStart.current.y + dy,
    }));
  }, []);

  const handlePointerUp = useCallback(() => {
    isPanning.current = false;
  }, []);

  // --- Space key for alternate pan mode ---
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
        if (isPanning.current) {
          isPanning.current = false;
        }
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
    transform,
    containerRef,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    spacePressed,
  };
}