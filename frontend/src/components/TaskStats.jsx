import React from 'react';

export default function TaskStats({ tasks, activeStatus, onSelectStatus }) {
  const total = tasks.length;
  const pending = tasks.filter((t) => t.status === 'Pending').length;
  const inProgress = tasks.filter((t) => t.status === 'In Progress').length;
  const completed = tasks.filter((t) => t.status === 'Completed').length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <section className="stats-section" aria-label="Task Statistics">
      <div className="stats-grid">
        {/* Total Tasks */}
        <div
          id="stat-card-total"
          className={`stat-card total ${activeStatus === 'ALL' ? 'active' : ''}`}
          onClick={() => onSelectStatus('ALL')}
          role="button"
          tabIndex={0}
          title="Click to view all tasks"
        >
          <div className="stat-header">
            <span className="stat-title">Total Tasks</span>
            <div className="stat-icon">📋</div>
          </div>
          <div className="stat-value">{total}</div>
          <div className="progress-container">
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill"
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
            <div className="progress-text">
              <span>Progress</span>
              <span>{completionRate}% Completed</span>
            </div>
          </div>
        </div>

        {/* Pending Tasks */}
        <div
          id="stat-card-pending"
          className={`stat-card pending ${activeStatus === 'Pending' ? 'active' : ''}`}
          onClick={() => onSelectStatus('Pending')}
          role="button"
          tabIndex={0}
          title="Filter by Pending tasks"
        >
          <div className="stat-header">
            <span className="stat-title">Pending</span>
            <div className="stat-icon">⏳</div>
          </div>
          <div className="stat-value">{pending}</div>
          <div className="progress-text" style={{ marginTop: 'auto' }}>
            <span>Awaiting Start</span>
            <span>{total > 0 ? Math.round((pending / total) * 100) : 0}%</span>
          </div>
        </div>

        {/* In Progress Tasks */}
        <div
          id="stat-card-inprogress"
          className={`stat-card inprogress ${activeStatus === 'In Progress' ? 'active' : ''}`}
          onClick={() => onSelectStatus('In Progress')}
          role="button"
          tabIndex={0}
          title="Filter by In Progress tasks"
        >
          <div className="stat-header">
            <span className="stat-title">In Progress</span>
            <div className="stat-icon">⚡</div>
          </div>
          <div className="stat-value">{inProgress}</div>
          <div className="progress-text" style={{ marginTop: 'auto' }}>
            <span>Underway</span>
            <span>{total > 0 ? Math.round((inProgress / total) * 100) : 0}%</span>
          </div>
        </div>

        {/* Completed Tasks */}
        <div
          id="stat-card-completed"
          className={`stat-card completed ${activeStatus === 'Completed' ? 'active' : ''}`}
          onClick={() => onSelectStatus('Completed')}
          role="button"
          tabIndex={0}
          title="Filter by Completed tasks"
        >
          <div className="stat-header">
            <span className="stat-title">Completed</span>
            <div className="stat-icon">✅</div>
          </div>
          <div className="stat-value">{completed}</div>
          <div className="progress-text" style={{ marginTop: 'auto' }}>
            <span>Finished</span>
            <span>{completionRate}%</span>
          </div>
        </div>
      </div>
    </section>
  );
}
