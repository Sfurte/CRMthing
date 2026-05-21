import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DndContext } from '@dnd-kit/core';
import Header from '../components/Header';
import LeftPanel from '../components/LeftPanel';
import Toolbar from '../components/Toolbar';
import Canvas from '../components/Canvas';
import PagesInspector from '../components/PagesInspector';
import useStore from '../store';
import { TransformProvider, useTransformRef } from '../contexts/TransformContext';

function toCanvasCoords(screenX, screenY, canvasRect, transform) {
  return {
    x: (screenX - canvasRect.left - transform.x) / transform.zoom,
    y: (screenY - canvasRect.top - transform.y) / transform.zoom,
  };
}

function EditorContent() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const projects = useStore((s) => s.projects);
  const openProject = useStore((s) => s.openProject);
  const addElement = useStore((s) => s.addElement);
  const selectElement = useStore((s) => s.selectElement);
  const setElementPosition = useStore((s) => s.setElementPosition);
  const removeElement = useStore((s) => s.removeElement);

  const transformRef = useTransformRef();
  const canvasRectRef = useRef(null);

  const [contextMenu, setContextMenu] = useState(null);

  useEffect(() => {
    if (!projects[projectId]) {
      navigate('/', { replace: true });
      return;
    }
    openProject(projectId);
  }, [projectId]);

  // Close context menu on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setContextMenu(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!projects[projectId]) {
    return null;
  }

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

  const handleElementContextMenu = useCallback((e, elementId) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ elementId, x: e.clientX, y: e.clientY });
  }, []);

  return (
    <DndContext onDragMove={handleDragMove} onDragEnd={handleDragEnd}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Header title={projects[projectId]?.name || 'Dashboard'} onBack={() => navigate('/')} />
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <LeftPanel />
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
            <Toolbar />
            <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
              <Canvas canvasRectRef={canvasRectRef} onElementContextMenu={handleElementContextMenu} />
            </div>
          </div>
          <PagesInspector />
        </div>
      </div>

      {/* Context menu overlay */}
      {contextMenu && (
        <>
          {/* Transparent backdrop — click/right-click to close */}
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 9999 }}
            onClick={() => setContextMenu(null)}
            onContextMenu={(e) => { e.preventDefault(); setContextMenu(null); }}
          />
          {/* The menu itself */}
          <div
            style={{
              position: 'fixed',
              left: contextMenu.x,
              top: contextMenu.y,
              zIndex: 10000,
              background: '#FFFFFF',
              border: '1px solid #E0E0E0',
              borderRadius: 8,
              boxShadow: '0px 4px 12px rgba(0,0,0,0.15)',
              padding: '4px 0',
              minWidth: 160,
            }}
          >
            <button
              onClick={() => {
                removeElement(contextMenu.elementId);
                setContextMenu(null);
              }}
              style={{
                width: '100%',
                padding: '10px 16px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                fontFamily: 'Inter',
                fontSize: 14,
                color: '#EF4444',
                textAlign: 'left',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#FFF5F5'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              🗑️ Удалить
            </button>
          </div>
        </>
      )}
    </DndContext>
  );
}

export default function EditorShell() {
  return (
    <TransformProvider>
      <EditorContent />
    </TransformProvider>
  );
}
