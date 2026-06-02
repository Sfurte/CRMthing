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

  const [contextTargetId, setContextTargetId] = useState(null);

  useEffect(() => {
    if (!projects[projectId]) {
      navigate('/', { replace: true });
      return;
    }
    openProject(projectId);
  }, [projectId]);

  // Close context menu on every mousedown except on action bar buttons
  useEffect(() => {
    const handler = (e) => {
      // Don't close if clicking on an action bar button
      if (e.target.closest('[data-context-action]')) return;
      setContextTargetId(null);
    };
    window.addEventListener('mousedown', handler);
    return () => window.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        selectElement(null);
        setContextTargetId(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectElement]);

  if (!projects[projectId]) {
    return null;
  }

  const closeContext = useCallback(() => {
    selectElement(null);
    setContextTargetId(null);
  }, [selectElement]);

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

  const handleDragStart = useCallback((event) => {
    const { active } = event;
    const data = active.data.current;
    if (data?.isCanvasElement) {
      selectElement(active.id);
    }
  }, [selectElement]);

  const handleDragEnd = useCallback(
    (event) => {
      const { active, over } = event;

      if (!over || over.id !== 'canvas') return;

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
    setContextTargetId(elementId);
  }, []);

  return (
    <DndContext onDragStart={handleDragStart} onDragMove={handleDragMove} onDragEnd={handleDragEnd}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Header title={projects[projectId]?.name || 'Dashboard'} onBack={() => navigate('/')} />
        
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <LeftPanel />
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
            <Toolbar />
            <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
              <Canvas
                canvasRectRef={canvasRectRef}
                onElementContextMenu={handleElementContextMenu}
                contextTargetId={contextTargetId}
                onCloseContext={closeContext}
              />
            </div>
          </div>
          <PagesInspector />
        </div>
      </div>
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
