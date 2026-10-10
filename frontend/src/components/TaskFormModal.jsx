import React, { useState, useEffect } from 'react';

export default function TaskFormModal({
  isOpen,
  mode = 'create', // 'create' or 'edit'
  taskData = null,
  onClose,
  onSubmit,
  isSubmitting = false
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Pending');
  const [priority, setPriority] = useState('Medium');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && taskData) {
        setTitle(taskData.title || '');
        setDescription(taskData.description || '');
        setStatus(taskData.status || 'Pending');
        setPriority(taskData.priority || 'Medium');
      } else {
        setTitle('');
        setDescription('');
        setStatus('Pending');
        setPriority('Medium');
      }
      setErrors({});
    }
  }, [isOpen, mode, taskData]);

  // Handle ESC key to dismiss modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!title.trim()) {
      errs.title = 'Title is required';
    } else if (title.trim().length < 2) {
      errs.title = 'Title must be at least 2 characters';
    } else if (title.trim().length > 120) {
      errs.title = 'Title cannot exceed 120 characters';
    }

    if (description.length > 1000) {
      errs.description = 'Description cannot exceed 1000 characters';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      status,
      priority
    });
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2 id="modal-title" className="modal-title">
            {mode === 'edit' ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Title field */}
            <div className="form-group">
              <label className="form-label" htmlFor="task-title-input">
                <span>Task Title <span className="req">*</span></span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {title.length}/120
                </span>
              </label>
              <input
                id="task-title-input"
                type="text"
                className={`form-input ${errors.title ? 'error' : ''}`}
                placeholder="e.g. Implement Express CORS middleware"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors({ ...errors, title: null });
                }}
                maxLength={120}
                autoFocus
              />
              {errors.title && <span className="form-error">{errors.title}</span>}
            </div>

            {/* Description field */}
            <div className="form-group">
              <label className="form-label" htmlFor="task-desc-input">
                <span>Description (Optional)</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {description.length}/1000
                </span>
              </label>
              <textarea
                id="task-desc-input"
                className={`form-textarea ${errors.description ? 'error' : ''}`}
                placeholder="Add helpful details, requirements, or notes..."
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) setErrors({ ...errors, description: null });
                }}
                maxLength={1000}
                rows={4}
              />
              {errors.description && (
                <span className="form-error">{errors.description}</span>
              )}
            </div>

            {/* Status and Priority Row */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="task-status-input">
                  Status
                </label>
                <select
                  id="task-status-input"
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="task-priority-input">
                  Priority
                </label>
                <select
                  id="task-priority-input"
                  className="form-select"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              id="btn-save-task"
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span>Saving...</span>
              ) : mode === 'edit' ? (
                <span>Update Task</span>
              ) : (
                <span>Create Task</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
