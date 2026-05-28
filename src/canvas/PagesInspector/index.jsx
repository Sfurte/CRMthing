import { useState } from 'react';
import useStore from '../../store';
import styles from './PagesInspector.module.css';

const PANEL_WIDTH = 240;
const COLLAPSED_WIDTH = 44;

export default function PagesInspector() {
  const projects = useStore((s) => s.projects);
  const activeProjectId = useStore((s) => s.activeProjectId);
  const activePageId = useStore((s) => s.activePageId);
  const addPage = useStore((s) => s.addPage);
  const deletePage = useStore((s) => s.deletePage);
  const setActivePage = useStore((s) => s.setActivePage);

  const project = projects[activeProjectId];
  const pages = project ? Object.values(project.pages) : [];
  const pageCount = Object.keys(project?.pages || {}).length;

  const [collapsed, setCollapsed] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  if (collapsed) {
    return (
      <div className={styles.panelCollapsed}>
        <div onClick={() => setCollapsed(false)} style={{ cursor: 'pointer' }}>
          <svg className={styles.icon} viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" stroke="#525252" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.headerTitle}>Страницы</span>
        <div onClick={() => setCollapsed(true)} className={styles.collapseBtn}>
          <svg className={styles.icon} viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="#525252" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <div className={styles.pageList}>
        {pages.map((page) => {
          const isActive = page.id === activePageId;
          return (
            <div
              key={page.id}
              className={`${styles.pageItem}${isActive ? ' ' + styles.pageItemActive : ''}`}
              onClick={() => setActivePage(page.id)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                  stroke={isActive ? '#3B82F6' : '#525252'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                />
                <path d="M14 2V8H20" stroke={isActive ? '#3B82F6' : '#525252'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className={styles.pageName}>{page.name}</span>
              {pageCount > 1 && (
                <div
                  className={styles.deleteBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteTarget(page);
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6L18 18" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className={styles.addBtn} onClick={() => addPage()}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M12 5V19" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 12H19" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>Добавить страницу</span>
      </div>

      {deleteTarget && (
        <div className={styles.modalOverlay} onClick={() => setDeleteTarget(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Удалить страницу</h3>
            <p className={styles.modalText}>
              Действительно хотите удалить страницу &laquo;{deleteTarget.name}&raquo;?
            </p>
            <div className={styles.modalActions}>
              <button
                className={`${styles.modalBtn} ${styles.modalBtnCancel}`}
                onClick={() => setDeleteTarget(null)}
              >
                Отмена
              </button>
              <button
                className={`${styles.modalBtn} ${styles.modalBtnDelete}`}
                onClick={() => {
                  deletePage(deleteTarget.id);
                  setDeleteTarget(null);
                }}
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
