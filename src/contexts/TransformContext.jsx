/**
 * Provides a ref that always contains the latest view transform { x, y, zoom }.
 * App.jsx reads this ref to calculate canvas coordinates during drag,
 * without needing to re-render on every pan/zoom.
 */
import { createContext, useContext, useRef } from 'react';

const TransformContext = createContext(null);

export function TransformProvider({ children }) {
  const transformRef = useRef({ x: 0, y: 0, zoom: 1 });
  return (
    <TransformContext.Provider value={transformRef}>
      {children}
    </TransformContext.Provider>
  );
}

/**
 * Returns a ref object: { current: { x, y, zoom } }.
 * The transform is kept up-to-date by Canvas.jsx.
 */
export function useTransformRef() {
  const ctx = useContext(TransformContext);
  if (!ctx) {
    throw new Error('useTransformRef must be used inside <TransformProvider>');
  }
  return ctx;
}
