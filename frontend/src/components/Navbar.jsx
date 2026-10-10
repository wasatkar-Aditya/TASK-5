import React from 'react';

export default function Navbar({ onOpenCreateModal, isApiConnected }) {
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
            title={isApiConnected ? 'Connected to Express & MongoDB on Port 5000' : 'Backend is unreachable'}
          >
            <span className="status-dot"></span>
            <span>{isApiConnected ? 'API Connected :5000' : 'API Offline'}</span>
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
