/**
 * Zustand store – single source of truth for projects and pages.
 *
 * Structure:
 *   projects: { [projectId]: { name, pages: { [pageId]: { name, elements[], viewTransform } } } }
 *   activeProjectId: string
 *   activePageId: string
 *   selectedId: string | null
 *
 * All element/view actions operate on the active page automatically.
 */
import { create } from 'zustand';

let nextElId = 1;

const INITIAL_PROJECT = {
  'proj-1': {
    name: 'Мой проект',
    pages: {
      'page-1': {
        id: 'page-1',
        name: 'Главная страница',
        elements: [],
        viewTransform: { x: 0, y: 0, zoom: 1 },
      },
    },
  },
};

const getActivePage = (state) => {
  const project = state.projects[state.activeProjectId];
  if (!project) return null;
  return project.pages[state.activePageId] || null;
};

const useStore = create((set, get) => ({
  /* ---- Projects & pages ---- */
  projects: INITIAL_PROJECT,
  activeProjectId: 'proj-1',
  activePageId: 'page-1',
  selectedId: null,

  /* ---- Page switching ---- */
  setActivePage: (pageId) => set({ activePageId: pageId }),

  addPage: (name) =>
    set((state) => {
      const project = state.projects[state.activeProjectId];
      if (!project) return state;
      const pageKeys = Object.keys(project.pages);
      const maxNum = pageKeys.reduce((max, k) => {
        const m = k.match(/page-(\d+)/);
        return m ? Math.max(max, parseInt(m[1], 10)) : max;
      }, 0);
      const newId = 'page-' + (maxNum + 1);
      const newPage = {
        id: newId,
        name: name || ('Page ' + (maxNum + 1)),
        elements: [],
        viewTransform: { x: 0, y: 0, zoom: 1 },
      };
      return {
        activePageId: newId,
        projects: {
          ...state.projects,
          [state.activeProjectId]: {
            ...project,
            pages: {
              ...project.pages,
              [newId]: newPage,
            },
          },
        },
      };
    }),

  /* ---- Element actions (operate on active page) ---- */
  addElement: (type, x, y) =>
    set((state) => {
      const page = getActivePage(state);
      if (!page) return state;
      const newEl = { id: 'el-' + (nextElId++), type, x, y };
      const newElements = [...page.elements, newEl];
      return {
        projects: {
          ...state.projects,
          [state.activeProjectId]: {
            ...state.projects[state.activeProjectId],
            pages: {
              ...state.projects[state.activeProjectId].pages,
              [state.activePageId]: { ...page, elements: newElements },
            },
          },
        },
      };
    }),

  /** Move element by a delta */
  moveElement: (id, deltaX, deltaY) =>
    set((state) => {
      const page = getActivePage(state);
      if (!page) return state;
      const newElements = page.elements.map((el) =>
        el.id === id ? { ...el, x: el.x + deltaX, y: el.y + deltaY } : el
      );
      return {
        projects: {
          ...state.projects,
          [state.activeProjectId]: {
            ...state.projects[state.activeProjectId],
            pages: {
              ...state.projects[state.activeProjectId].pages,
              [state.activePageId]: { ...page, elements: newElements },
            },
          },
        },
      };
    }),

  /** Set element''s absolute position */
  setElementPosition: (id, x, y) =>
    set((state) => {
      const page = getActivePage(state);
      if (!page) return state;
      const newElements = page.elements.map((el) =>
        el.id === id ? { ...el, x, y } : el
      );
      return {
        projects: {
          ...state.projects,
          [state.activeProjectId]: {
            ...state.projects[state.activeProjectId],
            pages: {
              ...state.projects[state.activeProjectId].pages,
              [state.activePageId]: { ...page, elements: newElements },
            },
          },
        },
      };
    }),

  selectElement: (id) => set({ selectedId: id }),

  /* ---- View transform actions ---- */
  setViewTransform: (transform) =>
    set((state) => {
      const page = getActivePage(state);
      if (!page) return state;
      return {
        projects: {
          ...state.projects,
          [state.activeProjectId]: {
            ...state.projects[state.activeProjectId],
            pages: {
              ...state.projects[state.activeProjectId].pages,
              [state.activePageId]: { ...page, viewTransform: transform },
            },
          },
        },
      };
    }),
}));

/* ---- Helper selectors (for external use) ---- */
export const selectActivePage = (state) => {
  const project = state.projects[state.activeProjectId];
  if (!project) return null;
  return project.pages[state.activePageId] || null;
};

export const selectActivePageElements = (state) => {
  const page = selectActivePage(state);
  return page ? page.elements : [];
};

export const selectViewTransform = (state) => {
  const page = selectActivePage(state);
  return page ? page.viewTransform : { x: 0, y: 0, zoom: 1 };
};

export const selectActivePageName = (state) => {
  const page = selectActivePage(state);
  return page ? page.name : '';
};

export default useStore;
