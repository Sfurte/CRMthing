import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store';
import styles from './CreateProjectModal.module.css';

export default function CreateProjectModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const createProject = useStore((s) => s.createProject);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleCreate = () => {
    if (!name.trim()) return;
    const newId = createProject(name.trim(), description.trim());
    setName('');
    setDescription('');
    onClose();
    navigate(`/editor/${newId}`);
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>Новый проект</h2>

        <label className={styles.label}>Название проекта</label>
        <input
          type="text"
          placeholder="Введите название"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
          autoFocus
        />

        <label className={styles.label}>Описание проекта</label>
        <textarea
          placeholder="Краткое описание (необязательно)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={styles.textarea}
          rows={3}
        />

        <div className={styles.actions}>
          <button className={styles.btnCancel} onClick={handleClose}>
            Отмена
          </button>
          <button
            className={styles.btnSave}
            onClick={handleCreate}
            disabled={!name.trim()}
          >
            Создать
          </button>
        </div>
      </div>
    </div>
  );
}
