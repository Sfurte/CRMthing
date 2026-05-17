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

export default function PagesInspector() {
  const projects = useStore((s) => s.projects);
  const activeProjectId = useStore((s) => s.activeProjectId);
  const activePageId = useStore((s) => s.activePageId);
  const addPage = useStore((s) => s.addPage);
  const setActivePage = useStore((s) => s.setActivePage);

  const project = projects[activeProjectId];
  const pages = project ? Object.values(project.pages) : [];

  const [collapsed, setCollapsed] = useState(false);

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
              onClick={() => setActivePage(page.id)}
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
              <span>{page.name}</span>
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
          padding: '8px 16px',
          cursor: 'pointer',
          fontFamily: 'Inter',
          fontSize: 14,
          fontWeight: 400,
          color: '#3B82F6',
          borderTop: '1px solid #F8FBFF',
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
    </div>
  );
}
