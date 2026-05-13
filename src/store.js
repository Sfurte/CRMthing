import { create } from 'zustand';

let nextId = 1;

const useStore = create((set) => ({
  elements: [],
  selectedId: null,
  zoom: 1,

  setZoom: (zoom) => set({ zoom }),

  addElement: (type, x, y) =>
    set((state) => ({
      elements: [
        ...state.elements,
        { id: 'el-' + (nextId++), type, x, y },
      ],
    })),

  moveElement: (id, deltaX, deltaY) =>
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === id ? { ...el, x: el.x + deltaX, y: el.y + deltaY } : el
      ),
    })),

  selectElement: (id) =>
    set({ selectedId: id }),

  setElementPosition: (id, x, y) =>
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === id ? { ...el, x, y } : el
      ),
    })),
}));

export default useStore;