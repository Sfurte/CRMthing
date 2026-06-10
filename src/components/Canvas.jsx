import { useDroppable } from '@dnd-kit/core';
import { useCallback, useEffect, useRef, useState } from 'react';
import useStore, { selectActivePageElements } from '../store';
import DraggableElement from './DraggableElement';
import useCanvasTransform from '../hooks/useCanvasTransform';
import useCombinedRef from '../hooks/useCombinedRef';
import { ARTBOARD_WIDTH, ARTBOARD_HEIGHT } from '../constants';
import { useTransformRef } from '../contexts/TransformContext';
import './Canvas.css';

function toCanvasCoords(screenX, screenY, canvasRect, transform) {
  return {
    x: (screenX - canvasRect.left - transform.x) / transform.zoom,
    y: (screenY - canvasRect.top - transform.y) / transform.zoom,
  };
}

export default function Canvas({ canvasRectRef, onElementContextMenu, contextTargetId, onCloseContext }) {
  const elements = useStore(selectActivePageElements);
  const selectElement = useStore((s) => s.selectElement);

  const { setNodeRef } = useDroppable({ id: 'canvas' });
  const { transform, containerRef, handlePointerDown: panDown, handlePointerMove: panMove, handlePointerUp: panUp, spacePressed } = useCanvasTransform();

  const transformRef = useTransformRef();
  transformRef.current = transform;

  // Selection box state
  const selBox = useRef({ active: false, startX: 0, startY: 0, curX: 0, curY: 0 });
  const [selRect, setSelRect] = useState(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || !canvasRectRef) return;
    const updateRect = () => { canvasRectRef.current = node.getBoundingClientRect(); };
    updateRect();
    const observer = new ResizeObserver(updateRect);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const mergedRef = useCombinedRef(containerRef, setNodeRef);
  const isPanning = spacePressed.current;
  const { x: panX, y: panY, zoom } = transform;

  const getSelBoxStyle = useCallback(() => {
    if (!selRect) return {};
    const { x, y, w, h } = selRect;
    return {
      position: 'absolute',
      left: x,
      top: y,
      width: w,
      height: h,
      background: 'rgba(59, 130, 246, 0.12)',
      border: '1px solid rgba(59, 130, 246, 0.5)',
      pointerEvents: 'none',
      zIndex: 999,
    };
  }, [selRect]);

  const handlePointerDown = useCallback((e) => {
    panDown(e);

    // Start selection box on left click without space (not on element)
    if (e.button === 0 && !spacePressed.current && !e.target.closest('.element') && !e.target.closest('[data-context-action]')) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const t = transformRef.current;
      const start = toCanvasCoords(e.clientX, e.clientY, rect, t);
      selBox.current = { active: true, startX: start.x, startY: start.y, curX: start.x, curY: start.y };
    }
  }, [panDown, spacePressed, containerRef, transformRef]);

  const handlePointerMove = useCallback((e) => {
    panMove(e);

    if (selBox.current.active) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const t = transformRef.current;
      const cur = toCanvasCoords(e.clientX, e.clientY, rect, t);
      selBox.current.curX = cur.x;
      selBox.current.curY = cur.y;
      const s = selBox.current;
      const x = Math.min(s.startX, s.curX);
      const y = Math.min(s.startY, s.curY);
      const w = Math.abs(s.curX - s.startX);
      const h = Math.abs(s.curY - s.startY);
      if (w > 3 || h > 3) {
        setSelRect({ x, y, w, h });
      }
    }
  }, [panMove, containerRef, transformRef]);

  const handlePointerUp = useCallback((e) => {
    panUp(e);

    if (selBox.current.active) {
      const s = selBox.current;
      selBox.current.active = false;

      const dx = Math.abs(s.curX - s.startX);
      const dy = Math.abs(s.curY - s.startY);

      if (dx > 5 || dy > 5) {
        // Selection box: find intersecting elements
        const x = Math.min(s.startX, s.curX);
        const y = Math.min(s.startY, s.curY);
        const w = Math.max(dx, 1);
        const h = Math.max(dy, 1);

        const ids = elements
          .filter((el) => {
            const ex = el.x, ey = el.y, ew = el.width || 200, eh = el.height || 100;
            return ex < x + w && ex + ew > x && ey < y + h && ey + eh > y;
          })
          .map((el) => el.id);

        if (ids.length > 0) {
          const ctrl = e.ctrlKey || e.metaKey;
          if (ctrl) {
            const existing = useStore.getState().selectedIds;
            const combined = [...new Set([...existing, ...ids])];
            useStore.setState({ selectedIds: combined });
          } else {
            useStore.setState({ selectedIds: ids });
          }
        } else {
          selectElement(null);
        }
      }
      // else: simple click, deselect is handled by onClick
      setSelRect(null);
    }
  }, [panUp, elements, selectElement]);

  return (
    <div
      ref={mergedRef}
      className={'canvas' + (isPanning ? ' canvas--panning' : ' canvas--default')}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onClick={() => {
        if (!selBox.current.active) onCloseContext?.();
      }}
      onContextMenu={(e) => {
        if (contextTargetId) {
          e.preventDefault();
          onCloseContext?.();
        }
      }}
    >
      <div
        className="canvas__world"
        style={{ transform: `translate(${panX}px, ${panY}px) scale(${zoom})` }}
      >
        <div className="canvas__artboard" style={{ position: 'relative' }}>
          {elements.map((el) => (
            <DraggableElement key={el.id} element={el} zoom={zoom} onContextMenu={onElementContextMenu} showContextBar={contextTargetId === el.id} />
          ))}
          {selRect && (
            <div style={getSelBoxStyle()} />
          )}
        </div>
      </div>
    </div>
  );
}
