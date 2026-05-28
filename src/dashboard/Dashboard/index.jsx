import { useState } from 'react';
import useStore, { selectLastOpenedProjectId } from '../../store';
import Header from '../../shared/Header';
import ProjectCard from '../ProjectCard';
import CreateProjectModal from '../CreateProjectModal';
import DashboardSidebar from '../DashboardSidebar';
import styles from './Dashboard.module.css';

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
    <div className={styles.dashboard}>
      <Header title="Проекты" />
      <div className={styles.body}>
        <DashboardSidebar />

        <div className={styles.content}>
          <div className={styles.header}>
            <h1 className={styles.title}>Проекты</h1>
          </div>

          {lastProject && (
            <div className={styles.lastSection}>
              <h2 className={styles.lastTitle}>Последний проект</h2>
              <ProjectCard projectId={lastProjectId} project={lastProject} />
            </div>
          )}

          <p className={styles.allTitle}>
            Все проекты ({projectEntries.length})
          </p>

          <div className={styles.searchSection}>
            <div className={styles.searchContainer}>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Поиск проектов"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className={styles.filterBtn}>Фильтр</button>
              <button
                className={styles.createBtn}
                onClick={() => setShowModal(true)}
              >
                + Создать проект
              </button>
            </div>
          </div>

          <div className={styles.projectsList}>
            {projectEntries.length === 0 ? (
              <div className={styles.noProjects}>
                <p>Проектов пока нет</p>
                <p className={styles.noProjectsHint}>
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
