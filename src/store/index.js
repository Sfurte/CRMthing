/**
 * Zustand store – single source of truth for projects and pages.
 *
 * Structure:
 *   projects: { [projectId]: { name, description, createdAt, lastOpened, pages: { ... } } }
 *   activeProjectId: string
 *   activePageId: string
 *   selectedId: string | null
 *
 * All element/view actions operate on the active page automatically.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
      /* ---- Projects & pages ---- */
      projects: INITIAL_PROJECTS,
      activeProjectId: 'proj-1',
      activePageId: 'page-1',
      selectedId: null,

      /* ---- Dashboard actions ---- */

      /** Create a new project with a default first page.
       *  Returns the new projectId so callers can navigate to it. */
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
            projects: {
              ...state.projects,
              [id]: newProject,
            },
          };
        });
        return id;
      },

      /** Open a project: update lastOpened, set as active. */
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
              [projectId]: {
                ...project,
                lastOpened: Date.now(),
              },
            },
          };
        }),

      /** Delete a project. Can't delete the last remaining project. */
      removeProject: (projectId) =>
        set((state) => {
          const projIds = Object.keys(state.projects);
          if (projIds.length <= 1) return state;

          const { [projectId]: removed, ...remaining } = state.projects;
          const remainingIds = Object.keys(remaining);

          return {
            projects: remaining,
            activeProjectId: state.activeProjectId === projectId
              ? remainingIds[0]
              : state.activeProjectId,
            activePageId: state.activeProjectId === projectId
              ? Object.values(remaining[remainingIds[0]].pages)[0]?.id
              : state.activePageId,
            selectedId: null,
          };
        }),

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
                pages: {
                  ...project.pages,
                  [newId]: newPage,
                },
              },
            },
          };
        }),

      /** Delete a page. Guards against removing the last page.
       *  If the active page is deleted, switches to the first remaining one. */
      deletePage: (pageId) =>
        set((state) => {
          const project = state.projects[state.activeProjectId];
          if (!project) return state;

          const pageIds = Object.keys(project.pages);
          if (pageIds.length <= 1) return state; // cannot delete the last page

          const { [pageId]: removed, ...remainingPages } = project.pages;

          // If deleting the active page, switch to the first remaining one
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
              [state.activeProjectId]: {
                ...project,
                pages: remainingPages,
              },
            },
          };
        }),

      /* ---- Element actions (operate on active page) ---- */
      addElement: (type, x, y) =>
        set((state) => {
          const page = getActivePage(state);
          if (!page) return state;
          const newEl = { id: 'el-' + nextElId++, type, x, y, zIndex: ++zCounter };
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

      /** Move element by a delta */
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

      /** Set element's absolute position */
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

      selectElement: (id) => set({ selectedId: id }),

      /** Remove an element from the active page. */
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

      /** Bring an element to the front by assigning it the highest z-index. */
      bringToFront: (id) =>
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
                      el.id === id ? { ...el, zIndex: ++zCounter } : el
                    ),
                  },
                },
              },
            },
          };
        }),

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
    }),
    { name: 'crmthing-store' }
  )
);

/* ---- Helper selectors ---- */
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

/** All projects sorted by lastOpened descending */
export const selectProjectList = (state) =>
  Object.values(state.projects).sort((a, b) => b.lastOpened - a.lastOpened);

/** The most recently opened project (object), or null */
export const selectLastOpenedProject = (state) => {
  const list = Object.values(state.projects);
  return list.sort((a, b) => b.lastOpened - a.lastOpened)[0] || null;
};

/** The projectId of the most recently opened project, or null */
export const selectLastOpenedProjectId = (state) => {
  const entries = Object.entries(state.projects);
  const sorted = entries.sort((a, b) => b[1].lastOpened - a[1].lastOpened);
  return sorted[0]?.[0] || null;
};

export default useStore;
