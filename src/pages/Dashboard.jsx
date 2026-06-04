import { useState } from 'react';
import { useTranslation } from '../i18n';
import useStore, { selectLastOpenedProjectId } from '../store';
import ProjectCard from './dashboard/ProjectCard';
import CreateProjectModal from './dashboard/CreateProjectModal';
import './dashboard/Dashboard.css';

export default function Dashboard() {
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
    <div className="dashboard-content" style={{ padding: '30px 40px' }}>
      <div className="dashboard-header">
        <h1 className="dashboard-title">{t('projects')}</h1>
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
  );
}
