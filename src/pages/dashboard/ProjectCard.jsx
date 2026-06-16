import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, Dropdown, Button } from 'antd';
import { 
  FolderOutlined, 
  ClockCircleOutlined, 
  MoreOutlined,
  CheckCircleOutlined,
  InboxOutlined,
  PauseCircleOutlined 
} from '@ant-design/icons';
import { useLang } from '../../hooks/useLang';
import useStore from '../../store';
import './Dashboard.css';

const STATUS_CONFIG = {
  active: { color: '#52c41a', icon: <CheckCircleOutlined /> },
  archived: { color: '#8c8c8c', icon: <InboxOutlined /> },
  paused: { color: '#fa8c16', icon: <PauseCircleOutlined /> },
};

const STATUS_KEYS = ['active', 'archived', 'paused'];

export default function ProjectCard({ projectId, project }) {
  const { t } = useLang();
  const navigate = useNavigate();
  const openProject = useStore((s) => s.openProject);
  const removeProject = useStore((s) => s.removeProject);
  const setProjectStatus = useStore((s) => s.setProjectStatus);

  const [contextMenuOpen, setContextMenuOpen] = useState(false);

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return t('neverOpened');
    const seconds = Math.floor((new Date() - timestamp) / 1000);
    if (seconds < 60) return t('justNow');
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} ${t('minAgo')}`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} ${t('hAgo')}`;
    const days = Math.floor(hours / 24);
    return `${days} ${t('dAgo')}`;
  };

  const handleClick = () => {
    openProject(projectId);
    navigate(`/editor/${projectId}`);
  };

  const handleStatusChange = ({ key }) => {
    setProjectStatus(projectId, key);
    setContextMenuOpen(false);
  };

  const handleDelete = () => {
    if (confirm(`Удалить проект «${project.name}»?`)) {
      removeProject(projectId);
    }
  };

  const handleMenuClick = (info) => {
    if (info.key === 'delete') {
      handleDelete();
    } else {
      handleStatusChange(info);
    }
  };

  const status = project.status || 'active';
  const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG.active;

  const menuItems = [
    ...STATUS_KEYS.map(key => ({
      key,
      label: t(key),
      icon: STATUS_CONFIG[key].icon,
    })),
    { type: 'divider' },
    { 
      key: 'delete', 
      label: t('deleteProject'),
      danger: true,
    },
  ];

  return (
    <div className="dashboard-card" onClick={handleClick}>
      <div className="dashboard-card-header">
        <div className="dashboard-card-icon">
          <FolderOutlined />
        </div>
        
        <div 
          className="dashboard-card-menu-wrapper"
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <Dropdown
            menu={{ items: menuItems, onClick: handleMenuClick }}
            trigger={['click']}
            open={contextMenuOpen}
            onOpenChange={setContextMenuOpen}
            placement="bottomRight"
          >
            <Button
              type="text"
              size="small"
              icon={<MoreOutlined />}
              className="dashboard-card-menu-btn"
            />
          </Dropdown>
        </div>
      </div>
      
      <h3 className="dashboard-card-title">{project.name}</h3>
      <p className="dashboard-card-description">{project.description}</p>
      
      <div className="dashboard-card-footer">
        <div className="dashboard-card-time">
          <ClockCircleOutlined />
          <span>{t('updated')}: {getTimeAgo(project.lastOpened)}</span>
        </div>
        
        <Tag 
          color={statusConfig.color} 
          className="dashboard-card-status"
          icon={statusConfig.icon}
        >
          {t(status)}
        </Tag>
      </div>
    </div>
  );
}