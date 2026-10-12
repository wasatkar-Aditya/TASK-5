import React from 'react';

export default function Navbar({ onOpenCreateModal, isApiConnected, isLocalStorageMode }) {
  const statusText = isLocalStorageMode
    ? 'Saved in this browser'
    : isApiConnected
      ? 'API Connected :5000'
      : 'API Offline';
  const statusTitle = isLocalStorageMode
    ? 'Tasks are saved in this browser. Configure VITE_API_URL to use a shared API.'
    : isApiConnected
      ? 'Connected to Express & MongoDB on Port 5000'
      : 'Backend is unreachable';

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="brand">
          <div className="brand-icon">✓</div>
          <div className="brand-info">
            <h1>TaskFlow Pro</h1>
            <span className="brand-badge">Internship Task 5 • Fullstack MERN</span>
          </div>
        </div>

        <div className="navbar-actions">
          <div
            className={`api-status-badge ${isApiConnected ? 'online' : 'offline'}`}
            title={statusTitle}
          >
            <span className="status-dot"></span>
            <span>{statusText}</span>
          </div>

          <button
            id="btn-create-task"
            className="btn-primary"
            onClick={onOpenCreateModal}
          >
            <span style={{ fontSize: '18px', lineHeight: 1 }}>+</span>
            <span>New Task</span>
          </button>
        </div>
      </div>
    </header>
  );
}
