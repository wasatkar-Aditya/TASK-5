import React from 'react';

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onQuickStatusChange
}) {
  const { _id, title, description, status, priority, createdAt, updatedAt } = task;

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const statusClassMap = {
    Pending: 'badge-pending',
    'In Progress': 'badge-inprogress',
    Completed: 'badge-completed'
  };

  const priorityClassMap = {
    High: 'badge-high',
    Medium: 'badge-medium',
    Low: 'badge-low'
  };

  return (
    <article className="task-card" id={`task-card-${_id}`}>
      <div>
        <div className="task-card-header">
          <div className="task-badges">
            {/* Status Badge */}
            <span className={`badge ${statusClassMap[status] || 'badge-pending'}`}>
              <span style={{ fontSize: '8px' }}>●</span>
              {status}
            </span>

            {/* Priority Badge */}
            <span className={`badge ${priorityClassMap[priority] || 'badge-medium'}`}>
              {priority} Priority
            </span>
          </div>

          {/* Quick status dropdown */}
          <select
            className="status-dropdown"
            value={status}
            onChange={(e) => onQuickStatusChange(_id, e.target.value)}
            title="Change status directly"
            aria-label="Quick change status"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Task Title */}
        <h3 className="task-title">{title}</h3>

        {/* Task Description */}
        <p className="task-description">
          {description && description.trim() !== ''
            ? description
            : 'No additional description provided.'}
        </p>
      </div>

      {/* Task Footer with timestamps and action buttons */}
      <div className="task-footer">
        <div className="task-meta">
          <span>Created: {formatDate(createdAt)}</span>
          {updatedAt && updatedAt !== createdAt && (
            <span>Updated: {formatDate(updatedAt)}</span>
          )}
        </div>

        <div className="task-actions">
          <button
            id={`btn-edit-task-${_id}`}
            className="action-btn edit"
            onClick={() => onEdit(task)}
            title="Edit task"
            aria-label="Edit task"
          >
            ✏️
          </button>
          <button
            id={`btn-delete-task-${_id}`}
            className="action-btn delete"
            onClick={() => onDelete(task)}
            title="Delete task"
            aria-label="Delete task"
          >
            🗑️
          </button>
        </div>
      </div>
    </article>
  );
}
