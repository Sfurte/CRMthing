import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ELEMENT_DEFINITIONS } from './elements';

let nextElId = 1;
let nextProjId = 2;
let zCounter = 0;

const INITIAL_PROJECTS = {
  'proj-1': {
    name: 'Мой проект',
    description: 'Новый проект',
    createdAt: Date.now(),
    lastOpened: Date.now(),
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

const useStore = create(
  persist(
    (set, get) => ({
      projects: INITIAL_PROJECTS,
      activeProjectId: 'proj-1',
      activePageId: 'page-1',
      selectedId: null,

      createProject: (name, description) => {
        const now = Date.now();
        let id;
        set((state) => {
          const projKeys = Object.keys(state.projects);
          let maxNum = 0;
          for (const k of projKeys) {
            const m = k.match(/proj-(\d+)/);
            if (m) maxNum = Math.max(maxNum, parseInt(m[1], 10));
          }
          id = 'proj-' + (maxNum + 1);
          const newProject = {
            name,
            description: description || '',
            createdAt: now,
            lastOpened: now,
            pages: {
              'page-1': {
                id: 'page-1',
                name: 'Главная страница',
                elements: [],
                viewTransform: { x: 0, y: 0, zoom: 1 },
              },
            },
          };
          return {
            activeProjectId: id,
            activePageId: 'page-1',
            selectedId: null,
            projects: { ...state.projects, [id]: newProject },
          };
        });
        return id;
      },

      openProject: (projectId) =>
        set((state) => {
          const project = state.projects[projectId];
          if (!project) return state;
          const pages = Object.values(project.pages);
          const firstPageId = pages.length > 0 ? pages[0].id : null;
          return {
            activeProjectId: projectId,
            activePageId: firstPageId,
            selectedId: null,
            projects: {
              ...state.projects,
              [projectId]: { ...project, lastOpened: Date.now() },
            },
          };
        }),

      removeProject: (projectId) =>
        set((state) => {
          const { [projectId]: removed, ...remaining } = state.projects;
          const remainingIds = Object.keys(remaining);
          return {
            projects: remaining,
            activeProjectId: state.activeProjectId === projectId ? (remainingIds[0] || null) : state.activeProjectId,
            activePageId: remainingIds[0] && state.activeProjectId === projectId ? Object.values(remaining[remainingIds[0]].pages)[0]?.id : (remainingIds.length ? state.activePageId : null),
            selectedId: null,
          };
        }),

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
            name: name || 'Page ' + (maxNum + 1),
            elements: [],
            viewTransform: { x: 0, y: 0, zoom: 1 },
          };
          return {
            activePageId: newId,
            projects: {
              ...state.projects,
              [state.activeProjectId]: {
                ...project,
                pages: { ...project.pages, [newId]: newPage },
              },
            },
          };
        }),

      deletePage: (pageId) =>
        set((state) => {
          const project = state.projects[state.activeProjectId];
          if (!project) return state;
          const pageIds = Object.keys(project.pages);
          if (pageIds.length <= 1) return state;
          const { [pageId]: removed, ...remainingPages } = project.pages;
          let nextPageId = state.activePageId;
          if (pageId === state.activePageId) {
            const remainingIds = Object.keys(remainingPages);
            nextPageId = remainingIds[0];
          }
          return {
            activePageId: nextPageId,
            selectedId: null,
            projects: {
              ...state.projects,
              [state.activeProjectId]: { ...project, pages: remainingPages },
            },
          };
        }),

      addElement: (type, x, y) =>
        set((state) => {
          const page = getActivePage(state);
          if (!page) return state;
          const def = ELEMENT_DEFINITIONS.find(d => d.type === type);
          const defaultProps = def?.defaultProps ? { ...def.defaultProps } : {};
          const newEl = { 
            id: 'el-' + nextElId++, 
            type, 
            x, 
            y, 
            zIndex: ++zCounter,
            width: def?.defaultWidth || 200,
            height: def?.defaultHeight || 100,
            props: defaultProps,
          };
          return {
            projects: {
              ...state.projects,
              [state.activeProjectId]: {
                ...state.projects[state.activeProjectId],
                pages: {
                  ...state.projects[state.activeProjectId].pages,
                  [state.activePageId]: { ...page, elements: [...page.elements, newEl] },
                },
              },
            },
          };
        }),

      moveElement: (id, deltaX, deltaY) =>
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
                  [state.activePageId]: {
                    ...page,
                    elements: page.elements.map((el) =>
                      el.id === id ? { ...el, x: el.x + deltaX, y: el.y + deltaY } : el
                    ),
                  },
                },
              },
            },
          };
        }),

      setElementPosition: (id, x, y) =>
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
                  [state.activePageId]: {
                    ...page,
                    elements: page.elements.map((el) =>
                      el.id === id ? { ...el, x, y } : el
                    ),
                  },
                },
              },
            },
          };
        }),

      resizeElement: (id, newWidth, newHeight) =>
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
                  [state.activePageId]: {
                    ...page,
                    elements: page.elements.map((el) =>
                      el.id === id ? { 
                        ...el, 
                        width: Math.max(20, newWidth),
                        height: Math.max(20, newHeight)
                      } : el
                    ),
                  },
                },
              },
            },
          };
        }),

      selectElement: (id) => set({ selectedId: id }),

      removeElement: (id) =>
        set((state) => {
          const page = getActivePage(state);
          if (!page) return state;
          return {
            selectedId: state.selectedId === id ? null : state.selectedId,
            projects: {
              ...state.projects,
              [state.activeProjectId]: {
                ...state.projects[state.activeProjectId],
                pages: {
                  ...state.projects[state.activeProjectId].pages,
                  [state.activePageId]: {
                    ...page,
                    elements: page.elements.filter((el) => el.id !== id),
                  },
                },
              },
            },
          };
        }),

      moveUp: (id) =>
        set((state) => {
          const page = getActivePage(state);
          if (!page) return state;
          const sorted = [...page.elements].sort((a, b) => a.zIndex - b.zIndex);
          const idx = sorted.findIndex((el) => el.id === id);
          if (idx < 0 || idx >= sorted.length - 1) return state;
          const above = sorted[idx + 1];
          return {
            projects: {
              ...state.projects,
              [state.activeProjectId]: {
                ...state.projects[state.activeProjectId],
                pages: {
                  ...state.projects[state.activeProjectId].pages,
                  [state.activePageId]: {
                    ...page,
                    elements: page.elements.map((el) => {
                      if (el.id === id) return { ...el, zIndex: above.zIndex };
                      if (el.id === above.id) return { ...above, zIndex: sorted[idx].zIndex };
                      return el;
                    }),
                  },
                },
              },
            },
          };
        }),

      moveDown: (id) =>
        set((state) => {
          const page = getActivePage(state);
          if (!page) return state;
          const sorted = [...page.elements].sort((a, b) => a.zIndex - b.zIndex);
          const idx = sorted.findIndex((el) => el.id === id);
          if (idx <= 0) return state;
          const below = sorted[idx - 1];
          return {
            projects: {
              ...state.projects,
              [state.activeProjectId]: {
                ...state.projects[state.activeProjectId],
                pages: {
                  ...state.projects[state.activeProjectId].pages,
                  [state.activePageId]: {
                    ...page,
                    elements: page.elements.map((el) => {
                      if (el.id === id) return { ...el, zIndex: below.zIndex };
                      if (el.id === below.id) return { ...below, zIndex: sorted[idx].zIndex };
                      return el;
                    }),
                  },
                },
              },
            },
          };
        }),

      updateElementProps: (id, newProps) =>
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
                  [state.activePageId]: {
                    ...page,
                    elements: page.elements.map((el) =>
                      el.id === id ? { ...el, props: { ...el.props, ...newProps } } : el
                    ),
                  },
                },
              },
            },
          };
        }),

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
    }),
    { name: 'crmthing-store' }
  )
);

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

export const selectProjectList = (state) =>
  Object.values(state.projects).sort((a, b) => b.lastOpened - a.lastOpened);

export const selectLastOpenedProject = (state) => {
  const list = Object.values(state.projects);
  return list.sort((a, b) => b.lastOpened - a.lastOpened)[0] || null;
};

export const selectLastOpenedProjectId = (state) => {
  const entries = Object.entries(state.projects);
  const sorted = entries.sort((a, b) => b[1].lastOpened - a[1].lastOpened);
  return sorted[0]?.[0] || null;
};

export default useStore;
