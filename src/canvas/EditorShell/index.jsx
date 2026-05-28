import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DndContext } from '@dnd-kit/core';
import Header from '../../shared/Header';
import LeftPanel from '../LeftPanel';
import Toolbar from '../Toolbar';
import Canvas from '../Canvas';
import PagesInspector from '../PagesInspector';
import useStore from '../../store';
import { TransformProvider, useTransformRef } from '../../contexts/TransformContext';
import styles from './EditorShell.module.css';

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

      {/* Context menu */}
      {contextMenu && (
        <>
          <div
            className={styles.backdrop}
            onClick={() => setContextMenu(null)}
            onContextMenu={(e) => { e.preventDefault(); setContextMenu(null); }}
          />
          <div
            className={styles.menu}
            style={{ left: contextMenu.x, top: contextMenu.y }}
          >
            <button
              className={styles.item}
              onClick={() => {
                removeElement(contextMenu.elementId);
                setContextMenu(null);
              }}
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
