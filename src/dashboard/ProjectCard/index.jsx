import { useNavigate } from 'react-router-dom';
import useStore from '../../store';
import styles from './ProjectCard.module.css';

export default function ProjectCard({ projectId, project }) {
  const navigate = useNavigate();
  const openProject = useStore((s) => s.openProject);
  const removeProject = useStore((s) => s.removeProject);

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return 'не открывался';
    const seconds = Math.floor((new Date() - timestamp) / 1000);
    if (seconds < 60) return 'только что';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} мин назад`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} ч назад`;
    const days = Math.floor(hours / 24);
    return `${days} д назад`;
  };

  const handleClick = () => {
    openProject(projectId);
    navigate(`/editor/${projectId}`);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    if (confirm(`Удалить проект «${project.name}»?`)) {
      removeProject(projectId);
    }
  };

  return (
    <div className={styles.card} onClick={handleClick} onContextMenu={handleContextMenu}>
      <h3 className={styles.title}>📁 {project.name}</h3>
      <p className={styles.description}>{project.description}</p>
      <p className={styles.time}>
        🕐 Последний визит: {getTimeAgo(project.lastOpened)}
      </p>
    </div>
  );
}
