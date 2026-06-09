/**
 * PagesInspector - a minimizable vertical panel on the right side
 * showing all pages of the current project and allowing switching.
 */
import { useState } from 'react';
import useStore from '../store';
import './PagesInspector.css';

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
      <div className="inspector--collapsed">
        <div className="inspector__toggle" onClick={() => setCollapsed(false)}>
          <svg viewBox='0 0 24 24' fill='none'>
            <path d='M9 18L15 12L9 6' stroke='currentColor' strokeWidth='1.67' strokeLinecap='round' strokeLinejoin='round'/>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="inspector">
      {/* Header: title + collapse */}
      <div className="inspector__header">
        <span className="inspector__title">Страницы</span>
        <div className="inspector__toggle" onClick={() => setCollapsed(true)}>
          <svg viewBox='0 0 24 24' fill='none'>
            <path d='M15 18L9 12L15 6' stroke='currentColor' strokeWidth='1.67' strokeLinecap='round' strokeLinejoin='round'/>
          </svg>
        </div>
      </div>

      {/* Page list */}
      <div className="inspector__list">
        {pages.map((page) => {
          const isActive = page.id === activePageId;
          return (
            <div
              key={page.id}
              className={'inspector__item' + (isActive ? ' inspector__item--active' : '')}
              onClick={() => setActivePage(page.id)}
            >
              <svg viewBox='0 0 24 24' fill='none'>
                <path d='M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z' stroke={isActive ? 'var(--accent)' : 'currentColor'} strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'/>
                <path d='M14 2V8H20' stroke={isActive ? 'var(--accent)' : 'currentColor'} strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'/>
              </svg>
              <span className="inspector__item-name">{page.name}</span>
              {pageCount > 1 && (
                <button
                  className="inspector__delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteTarget(page);
                  }}
                >
                  <svg viewBox='0 0 24 24' fill='none'>
                    <path d='M18 6L6 18M6 6L18 18' stroke='var(--text-tertiary)' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/>
                  </svg>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Add page button */}
      <button className="inspector__add-btn" onClick={() => addPage()}>
        <svg viewBox='0 0 24 24' fill='none'>
          <path d='M12 5V19' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'/>
          <path d='M5 12H19' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'/>
        </svg>
        <span>Добавить страницу</span>
      </button>

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="inspector__modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="inspector__modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="inspector__modal-title">Удалить страницу</h3>
            <p className="inspector__modal-text">
              Действительно хотите удалить страницу &laquo;{deleteTarget.name}&raquo;?
            </p>
            <div className="inspector__modal-actions">
              <button
                className="inspector__modal-btn inspector__modal-btn--cancel"
                onClick={() => setDeleteTarget(null)}
              >
                Отмена
              </button>
              <button
                className="inspector__modal-btn inspector__modal-btn--danger"
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
