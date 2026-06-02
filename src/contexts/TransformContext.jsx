import { createContext, useContext, useRef } from 'react';
export const TransformContext = createContext();
export const TransformProvider = ({ children }) => {
  const transformRef = useRef({ x: 0, y: 0, zoom: 1 });
  return <TransformContext.Provider value={transformRef}>{children}</TransformContext.Provider>;
};
export const useTransformRef = () => useContext(TransformContext);