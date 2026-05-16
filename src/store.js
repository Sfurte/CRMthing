import { create } from 'zustand';

let nextId = 1;

/**
 * Zustand store - the single source of truth for:
 * - elements[] (all placed UI components)
 * - selectedId
 * - viewTransform (pan X, pan Y, zoom)
 */
const useStore = create((set) => ({
  /* ---- Elements ---- */
  elements: [],
  selectedId: null,

  addElement: (type, x, y) =>
    set((state) => ({
      elements: [
        ...state.elements,
        { id: 'el-' + (nextId++), type, x, y },
      ],
    })),

  /** Move an element by a delta (used for Nudge, etc.) */
  moveElement: (id, deltaX, deltaY) =>
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === id ? { ...el, x: el.x + deltaX, y: el.y + deltaY } : el
      ),
    })),

  /** Set an element's absolute position (used during drag) */
  setElementPosition: (id, x, y) =>
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === id ? { ...el, x, y } : el
      ),
    })),

  selectElement: (id) => set({ selectedId: id }),

  /* ---- View transform (pan & zoom) ---- */
  /** { x, y, zoom } - single source of truth for the canvas transform */
  viewTransform: { x: 0, y: 0, zoom: 1 },

  setViewTransform: (transform) => set({ viewTransform: transform }),
}));

export default useStore;
