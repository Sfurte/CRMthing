import { DndContext } from '@dnd-kit/core';
import Header from './components/Header';
import LeftPanel from './components/LeftPanel';
import Toolbar from './components/Toolbar';
import Canvas from './components/Canvas';
import useStore from './store';
import { useRef, useCallback } from 'react';

export default function App() {
  const addElement = useStore((s) => s.addElement);
  const selectElement = useStore((s) => s.selectElement);
  const setElementPosition = useStore((s) => s.setElementPosition);
  const canvasRef = useRef(null);
  const canvasTransformRef = useRef({ x: 0, y: 0, zoom: 1 });

  const handleDragMove = useCallback((event) => {
    const { active } = event;
    const data = active.data.current;
    if (data?.isCanvasElement) {
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      if (!canvasRect) return;
      const { translated } = active.rect.current;
      if (!translated) return;
      const { x: panX, y: panY, zoom } = canvasTransformRef.current;
      const canvasX = (translated.left - canvasRect.left - panX) / zoom;
      const canvasY = (translated.top - canvasRect.top - panY) / zoom;
      setElementPosition(active.id, canvasX, canvasY);
    }
  }, [setElementPosition]);

  const handleDragEnd = useCallback(
    (event) => {
      const { active, over, delta } = event;
      if (Math.abs(delta.x) < 5 && Math.abs(delta.y) < 5) {
        const data = active.data.current;
        if (data?.isCanvasElement) {
          selectElement(active.id);
          return;
        }
      }
      if (!over || over.id !== 'canvas') return;
      const data = active.data.current;
      if (data?.type) {
        const canvasRect = canvasRef.current?.getBoundingClientRect();
        if (!canvasRect) return;
        const { translated } = active.rect.current;
        const { x: panX, y: panY, zoom } = canvasTransformRef.current;
        const x = (translated.left - canvasRect.left - panX) / zoom;
        const y = (translated.top - canvasRect.top - panY) / zoom;
        addElement(data.type, x, y);
      }
    },
    [addElement, selectElement]
  );

  const handleCanvasClick = () => {
    selectElement(null);
  };

  return (
    <DndContext onDragMove={handleDragMove} onDragEnd={handleDragEnd}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Header />
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <LeftPanel />
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
            <Toolbar />
            <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
              <Canvas
                canvasRef={canvasRef}
                transformRef={canvasTransformRef}
                onCanvasClick={handleCanvasClick}
              />
            </div>
          </div>
        </div>
      </div>
    </DndContext>
  );
}