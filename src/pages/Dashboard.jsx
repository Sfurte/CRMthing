import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SettingOutlined } from '@ant-design/icons';
import { useTranslation } from '../i18n';
import useStore, { selectLastOpenedProjectId } from '../store';
import Header from '../components/Header';
import ProjectCard from './dashboard/ProjectCard';
import CreateProjectModal from './dashboard/CreateProjectModal';
import DashboardSidebar from './dashboard/DashboardSidebar';
import './dashboard/Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const lastProjectId = useStore(selectLastOpenedProjectId);
  const projectsById = useStore((s) => s.projects);

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const lastProject = lastProjectId ? projectsById[lastProjectId] : null;

  const projectEntries = Object.entries(projectsById)
    .filter(([, p]) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => b[1].lastOpened - a[1].lastOpened);

  return (
    <div className="dashboard">
      <Header title={t('projects')} />
      <div className="dashboard-body">
        <DashboardSidebar />

        <div className="dashboard-content">
          <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 className="dashboard-title">{t('projects')}</h1>
            <button 
              onClick={() => navigate('/settings')}
              style={{
                background: 'none', border: '1px solid #d9d9d9', borderRadius: 6,
                padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                fontSize: 13, color: '#333', transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#1890ff'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#d9d9d9'}
            >
              <SettingOutlined /> {t('settings')}
            </button>
          </div>

          {lastProject && (
            <div className="dashboard-last-section">
              <h2 className="dashboard-last-title">{t('lastProject')}</h2>
              <ProjectCard projectId={lastProjectId} project={lastProject} />
            </div>
          )}

          <p className="dashboard-all-title">
            {t('allProjects')} ({projectEntries.length})
          </p>

          <div className="dashboard-search-section">
            <div className="dashboard-search-container">
              <input
                type="text"
                className="dashboard-search-input"
                placeholder={t('searchProjects')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="dashboard-filter-btn">{t('filter')}</button>
              <button
                className="dashboard-create-btn"
                onClick={() => setShowModal(true)}
              >
                {t('createProject')}
              </button>
            </div>
          </div>

          <div className="dashboard-projects-list">
            {projectEntries.length === 0 ? (
              <div className="dashboard-no-projects">
                <p>{t('noProjects')}</p>
                <p className="dashboard-no-projects-hint">{t('noProjectsHint')}</p>
              </div>
            ) : (
              projectEntries.map(([pid, project]) => (
                <ProjectCard key={pid} projectId={pid} project={project} />
              ))
            )}
          </div>

          <CreateProjectModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
          />
        </div>
      </div>
    </div>
  );
}