import { useState } from 'react';
import useStore, { selectLastOpenedProjectId } from '../../store';
import Header from '../../shared/Header';
import ProjectCard from '../ProjectCard';
import CreateProjectModal from '../CreateProjectModal';
import DashboardSidebar from '../DashboardSidebar';
import './Dashboard.css';

export default function Dashboard() {
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
      <Header title="Проекты" />
      <div className="dashboard-body">
        <DashboardSidebar />

        <div className="dashboard-content">
          <div className="dashboard-header">
            <h1 className="dashboard-title">Проекты</h1>
          </div>

          {lastProject && (
            <div className="dashboard-last-section">
              <h2 className="dashboard-last-title">Последний проект</h2>
              <ProjectCard projectId={lastProjectId} project={lastProject} />
            </div>
          )}

          <p className="dashboard-all-title">
            Все проекты ({projectEntries.length})
          </p>

          <div className="dashboard-search-section">
            <div className="dashboard-search-container">
              <input
                type="text"
                className="dashboard-search-input"
                placeholder="Поиск проектов"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="dashboard-filter-btn">Фильтр</button>
              <button
                className="dashboard-create-btn"
                onClick={() => setShowModal(true)}
              >
                + Создать проект
              </button>
            </div>
          </div>

          <div className="dashboard-projects-list">
            {projectEntries.length === 0 ? (
              <div className="dashboard-no-projects">
                <p>Проектов пока нет</p>
                <p className="dashboard-no-projects-hint">
                  Создайте первый проект
                </p>
              </div>
            ) : (
              projectEntries.map(([pid, project]) => (
                <ProjectCard
                  key={pid}
                  projectId={pid}
                  project={project}
                />
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
