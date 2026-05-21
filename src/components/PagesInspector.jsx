/**
 * PagesInspector - a minimizable vertical panel on the right side
 * showing all pages of the current project and allowing switching.
 */
import { useState } from 'react';
import useStore from '../store';

const PANEL_WIDTH = 240;
const COLLAPSED_WIDTH = 44;

const iconExpandStyle = {
  width: 20,
  height: 20,
  cursor: 'pointer',
};

const crossStyle = {
  width: 16,
  height: 16,
  cursor: 'pointer',
  marginLeft: 'auto',
  borderRadius: 4,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

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
      <div
        style={{
          width: COLLAPSED_WIDTH,
          flexShrink: 0,
          background: '#FFFFFF',
          borderLeft: '1px solid #F8FBFF',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 12,
          gap: 8,
        }}
      >
        <div onClick={() => setCollapsed(false)} style={{ cursor: 'pointer' }}>
          <svg style={iconExpandStyle} viewBox='0 0 24 24' fill='none'>
            <path d='M9 18L15 12L9 6' stroke='#525252' strokeWidth='1.67' strokeLinecap='round' strokeLinejoin='round'/>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        width: PANEL_WIDTH,
        flexShrink: 0,
        background: '#FFFFFF',
        borderLeft: '1px solid #F8FBFF',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}
    >
      { /* Header: title + collapse */ }
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
          borderBottom: '1px solid #F8FBFF',
        }}
      >
        <span style={{
          fontFamily: 'Inter',
          fontSize: 14,
          fontWeight: 500,
          color: '#202020',
        }}>
          Страницы
        </span>
        <div onClick={() => setCollapsed(true)} style={{ cursor: 'pointer', display: 'flex' }}>
          <svg style={iconExpandStyle} viewBox='0 0 24 24' fill='none'>
            <path d='M15 18L9 12L15 6' stroke='#525252' strokeWidth='1.67' strokeLinecap='round' strokeLinejoin='round'/>
          </svg>
        </div>
      </div>

      { /* Page list */ }
      <div style={{ padding: '8px 0' }}>
        {pages.map((page) => {
          const isActive = page.id === activePageId;
          return (
            <div
              key={page.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 16px',
                cursor: 'pointer',
                fontFamily: 'Inter',
                fontSize: 14,
                fontWeight: isActive ? 500 : 400,
                color: isActive ? '#202020' : '#525252',
                borderLeft: '3px solid ' + (isActive ? '#3B82F6' : 'transparent'),
                background: isActive ? '#F0F7FF' : 'transparent',
              }}
              onClick={() => setActivePage(page.id)}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = '#FAFAFA';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = 'transparent';
              }}
            >
              <svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
                <path d='M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z' stroke={isActive ? '#3B82F6' : '#525252'} strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'/>
                <path d='M14 2V8H20' stroke={isActive ? '#3B82F6' : '#525252'} strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'/>
              </svg>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{page.name}</span>
              {pageCount > 1 && (
                <div
                  style={crossStyle}
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteTarget(page);
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#F0F2F5'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <svg width='12' height='12' viewBox='0 0 24 24' fill='none'>
                    <path d='M18 6L6 18M6 6L18 18' stroke='#999' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/>
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add page button */}
      <div
        onClick={() => addPage()}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '12px 16px',
          cursor: 'pointer',
          fontFamily: 'Inter',
          fontSize: 14,
          fontWeight: 400,
          color: '#3B82F6',
          borderTop: '1px solid #E0E0E0',
          marginTop: 'auto',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = '#F0F7FF'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
      >
        <svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
          <path d='M12 5V19' stroke='#3B82F6' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'/>
          <path d='M5 12H19' stroke='#3B82F6' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'/>
        </svg>
        <span>Добавить страницу</span>
      </div>

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setDeleteTarget(null)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: 16,
              padding: 24,
              width: 400,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{
              fontFamily: 'Inter',
              fontSize: 18,
              fontWeight: 600,
              color: '#1a1f36',
              marginBottom: 12,
            }}>
              Удалить страницу
            </h3>
            <p style={{
              fontFamily: 'Inter',
              fontSize: 14,
              color: '#525252',
              marginBottom: 24,
              lineHeight: '20px',
            }}>
              Действительно хотите удалить страницу &laquo;{deleteTarget.name}&raquo;?
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setDeleteTarget(null)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#f0f2f5',
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontFamily: 'Inter',
                  fontSize: 14,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#e8ecf0'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f0f2f5'; }}
              >
                Отмена
              </button>
              <button
                onClick={() => {
                  deletePage(deleteTarget.id);
                  setDeleteTarget(null);
                }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#EF4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontFamily: 'Inter',
                  fontSize: 14,
                  fontWeight: 500,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#DC2626'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#EF4444'; }}
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
