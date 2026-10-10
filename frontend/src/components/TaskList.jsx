import React from 'react';
import TaskCard from './TaskCard';

export default function TaskList({
  tasks,
  isLoading,
  error,
  onRetry,
  onEdit,
  onDelete,
  onQuickStatusChange,
  onOpenCreateModal
}) {
  // 1. Loading Skeleton State
  if (isLoading) {
    return (
      <div className="tasks-grid" aria-label="Loading tasks">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="skeleton-card">
            <div style={{ display: 'flex', gap: '8px' }}>
              <div className="skeleton-pulse" style={{ width: '80px', height: '22px' }}></div>
              <div className="skeleton-pulse" style={{ width: '90px', height: '22px' }}></div>
            </div>
            <div className="skeleton-pulse" style={{ width: '75%', height: '26px', marginTop: '14px' }}></div>
            <div className="skeleton-pulse" style={{ width: '95%', height: '18px', marginTop: '10px' }}></div>
            <div className="skeleton-pulse" style={{ width: '60%', height: '18px', marginTop: '8px' }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '16px' }}>
              <div className="skeleton-pulse" style={{ width: '100px', height: '16px' }}></div>
              <div className="skeleton-pulse" style={{ width: '70px', height: '30px' }}></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 2. Error State
  if (error) {
    return (
      <div className="alert-banner alert-error" role="alert">
        <div>
          <strong>Error loading tasks: </strong>
          <span>{error}</span>
        </div>
        <button className="btn-secondary" onClick={onRetry}>
          Try Again
        </button>
      </div>
    );
  }

  // 3. Empty State
  if (!tasks || tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📝</div>
        <h3 className="empty-title">No tasks found</h3>
        <p className="empty-subtitle">
          There are no tasks matching your current view or database is currently empty.
          Click below to create a new task!
        </p>
        <button
          id="btn-empty-create"
          className="btn-primary"
          onClick={onOpenCreateModal}
        >
          + Create New Task
        </button>
      </div>
    );
  }

  // 4. Tasks Grid
  return (
    <div className="tasks-grid" id="tasks-container">
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onQuickStatusChange={onQuickStatusChange}
        />
      ))}
    </div>
  );
}
