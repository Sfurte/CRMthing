import { useDroppable } from '@dnd-kit/core';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SnippetsOutlined } from '@ant-design/icons';
import useStore, { selectActivePageElements, selectActivePage } from '../store';
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

function getIntersectingIds(elements, x, y, w, h) {
  return elements
    .filter((el) => {
      const ex = el.x, ey = el.y, ew = el.width || 200, eh = el.height || 100;
      return ex < x + w && ex + ew > x && ey < y + h && ey + eh > y;
    })
    .map((el) => el.id);
}

export default function Canvas({ canvasRectRef, onElementContextMenu, contextTargetId, onCloseContext }) {
  const elements = useStore(selectActivePageElements);

  const { setNodeRef } = useDroppable({ id: 'canvas' });
  const { transform, containerRef, handlePointerDown: panDown, handlePointerMove: panMove, handlePointerUp: panUp, spacePressed } = useCanvasTransform();

  const transformRef = useTransformRef();
  transformRef.current = transform;

  const selBox = useRef({ active: false, startX: 0, startY: 0, curX: 0, curY: 0 });
  const [selRect, setSelRect] = useState(null);
  const [pasteMenu, setPasteMenu] = useState(null);

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

  // Native event listeners for selection box (bypasses React/DnD event system)
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const onPointerDown = (e) => {
      panDown(e);
      if (e.button === 0 && !spacePressed.current && !e.target.closest('.element') && !e.target.closest('[data-context-action]') && !e.target.closest('.canvas-paste-menu')) {
        setPasteMenu(null);
        const rect = node.getBoundingClientRect();
        const t = transformRef.current;
        const start = toCanvasCoords(e.clientX, e.clientY, rect, t);
        selBox.current = { active: true, startX: start.x, startY: start.y, curX: start.x, curY: start.y };
      } else if (!e.target.closest('.canvas-paste-menu')) {
        setPasteMenu(null);
      }
    };

    const onPointerMove = (e) => {
      panMove(e);
      if (selBox.current.active) {
        const rect = node.getBoundingClientRect();
        const t = transformRef.current;
        const cur = toCanvasCoords(e.clientX, e.clientY, rect, t);
        selBox.current.curX = cur.x;
        selBox.current.curY = cur.y;
        const s = selBox.current;
        const bx = Math.min(s.startX, s.curX);
        const by = Math.min(s.startY, s.curY);
        const bw = Math.abs(s.curX - s.startX);
        const bh = Math.abs(s.curY - s.startY);
        if (bw > 3 || bh > 3) {
          setSelRect({ x: bx, y: by, w: bw, h: bh });
          const state = useStore.getState();
          const page = selectActivePage(state);
          const allElements = page?.elements || [];
          const ids = getIntersectingIds(allElements, bx, by, bw, bh);
          useStore.setState({ selectedIds: ids });
        }
      }
    };

    const onPointerUp = (e) => {
      panUp(e);
      if (selBox.current.active) {
        const s = selBox.current;
        selBox.current.active = false;
        setSelRect(null);
        const dx = Math.abs(s.curX - s.startX);
        const dy = Math.abs(s.curY - s.startY);
        selBox.current.didDrag = dx > 5 || dy > 5;
        if (dx > 5 || dy > 5) {
          const bx = Math.min(s.startX, s.curX);
          const by = Math.min(s.startY, s.curY);
          const bw = Math.max(dx, 1);
          const bh = Math.max(dy, 1);
          const state = useStore.getState();
          const page = selectActivePage(state);
          const allElements = page?.elements || [];
          const ids = getIntersectingIds(allElements, bx, by, bw, bh);
          if (e.ctrlKey || e.metaKey) {
            const combined = [...new Set([...state.selectedIds, ...ids])];
            useStore.setState({ selectedIds: combined });
          } else {
            useStore.setState({ selectedIds: ids });
          }
        }
      }
    };

    node.addEventListener('pointerdown', onPointerDown);
    node.addEventListener('pointermove', onPointerMove);
    node.addEventListener('pointerup', onPointerUp);
    node.addEventListener('pointerleave', onPointerUp);

    return () => {
      node.removeEventListener('pointerdown', onPointerDown);
      node.removeEventListener('pointermove', onPointerMove);
      node.removeEventListener('pointerup', onPointerUp);
      node.removeEventListener('pointerleave', onPointerUp);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

  const handlePaste = useCallback(() => {
    const clip = useStore.getState().clipboard;
    if (!clip) return;
    const rect = canvasRectRef.current;
    const t = transformRef.current;
    if (rect && t && pasteMenu) {
      const { x, y } = toCanvasCoords(pasteMenu.x, pasteMenu.y, rect, t);
      useStore.getState().addElement(clip.type, x, y, clip);
    }
    setPasteMenu(null);
  }, [pasteMenu]);

  return (
    <div
      ref={mergedRef}
      className={'canvas' + (isPanning ? ' canvas--panning' : ' canvas--default')}
      onClick={() => {
        setPasteMenu(null);
        if (!selBox.current.active && !selBox.current.didDrag) onCloseContext?.();
        selBox.current.didDrag = false;
      }}
      onContextMenu={(e) => {
        if (contextTargetId) {
          e.preventDefault();
          onCloseContext?.();
        } else if (useStore.getState().clipboard) {
          e.preventDefault();
          setPasteMenu({ x: e.clientX, y: e.clientY });
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

      {pasteMenu && (
        <div
          className="canvas-paste-menu"
          data-context-action
          style={{
            position: 'fixed',
            left: pasteMenu.x,
            top: pasteMenu.y,
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '8px',
            gap: 17,
            background: '#F5F5F5',
            borderRadius: 8,
            boxSizing: 'border-box',
            transform: 'translate(-50%, -100%)',
            marginTop: -8,
          }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <button
            className="element__context-btn"
            style={{
              width: 18, height: 18, padding: 0, border: 'none', background: 'none',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#171717',
            }}
            onClick={(e) => { e.stopPropagation(); handlePaste(); }}
          >
            <SnippetsOutlined />
          </button>
        </div>
      )}
    </div>
  );
}
