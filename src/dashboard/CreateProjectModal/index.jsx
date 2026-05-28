import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store';

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
    <div className="dashboard-modal-overlay" onClick={handleClose}>
      <div className="dashboard-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="dashboard-modal-title">Новый проект</h2>

        <label className="dashboard-modal-label">Название проекта</label>
        <input
          type="text"
          placeholder="Введите название"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="dashboard-modal-input"
          autoFocus
        />

        <label className="dashboard-modal-label">Описание проекта</label>
        <textarea
          placeholder="Краткое описание (необязательно)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="dashboard-modal-textarea"
          rows={3}
        />

        <div className="dashboard-modal-actions">
          <button className="dashboard-modal-btn-cancel" onClick={handleClose}>
            Отмена
          </button>
          <button
            className="dashboard-modal-btn-save"
            onClick={handleCreate}
            disabled={!name.trim()}
            style={{ opacity: name.trim() ? 1 : 0.5 }}
          >
            Создать
          </button>
        </div>
      </div>
    </div>
  );
}
