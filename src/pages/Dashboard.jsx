import { useState } from 'react';
import { SearchOutlined, FilterOutlined, PlusOutlined } from '@ant-design/icons';
import { Dropdown, Button, Input } from 'antd';
import { useLang } from '../hooks/useLang';
import useStore, { selectLastOpenedProjectId } from '../store';
import ProjectCard from './dashboard/ProjectCard';
import CreateProjectModal from './dashboard/CreateProjectModal';
import './dashboard/Dashboard.css';

export default function Dashboard() {
  const { t } = useLang();
  const lastProjectId = useStore(selectLastOpenedProjectId);
  const projectsById = useStore((s) => s.projects);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);

  const lastProject = lastProjectId ? projectsById[lastProjectId] : null;

  const projectEntries = Object.entries(projectsById)
    .filter(([, p]) => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const status = p.status || 'active';
      const matchesFilter = activeFilter === 'all' || status === activeFilter;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => b[1].lastOpened - a[1].lastOpened);

  const filterMenuItems = [
    { key: 'all', label: t('all') },
    { key: 'active', label: t('active') },
    { key: 'archived', label: t('archived') },
    { key: 'paused', label: t('paused') },
  ].map(f => ({
    key: f.key,
    label: f.label,
    onClick: () => setActiveFilter(f.key),
  }));

  const activeFilterLabel = filterMenuItems.find(f => f.key === activeFilter)?.label || t('filters');

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h1 className="dashboard-title">{t('allProjects')}</h1>
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
          <div className="dashboard-search-wrapper">
            <SearchOutlined className="dashboard-search-icon" />
            <Input
              placeholder={t('search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="dashboard-search-input"
            />
          </div>
          
          <Dropdown menu={{ items: filterMenuItems }} trigger={['click']}>
            <Button className="dashboard-filter-btn" icon={<FilterOutlined />}>
              {activeFilterLabel}
            </Button>
          </Dropdown>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setShowModal(true)}
            className="dashboard-create-btn"
          >
            {t('createProject')}
          </Button>
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