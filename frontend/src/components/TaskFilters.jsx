import React from 'react';

export default function TaskFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
  sortBy,
  onSortChange,
  onResetFilters
}) {
  const isFiltered =
    searchQuery.trim() !== '' ||
    statusFilter !== 'ALL' ||
    priorityFilter !== 'ALL' ||
    sortBy !== 'newest';

  return (
    <div className="toolbar-container">
      <div className="toolbar-top">
        {/* Search input */}
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            id="search-tasks-input"
            type="text"
            className="search-input"
            placeholder="Search tasks by title or details..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              className="search-clear"
              onClick={() => onSearchChange('')}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter controls */}
        <div className="filter-group">
          {/* Priority filter */}
          <select
            id="filter-priority-select"
            className="filter-select"
            value={priorityFilter}
            onChange={(e) => onPriorityChange(e.target.value)}
            aria-label="Filter by Priority"
          >
            <option value="ALL">All Priorities</option>
            <option value="High">🔴 High Priority</option>
            <option value="Medium">🟡 Medium Priority</option>
            <option value="Low">🔵 Low Priority</option>
          </select>

          {/* Sort order */}
          <select
            id="sort-tasks-select"
            className="filter-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            aria-label="Sort Tasks"
          >
            <option value="newest">🕒 Newest First</option>
            <option value="oldest">⌛ Oldest First</option>
            <option value="title-asc">🔤 Title (A to Z)</option>
            <option value="title-desc">🔤 Title (Z to A)</option>
          </select>

          {/* Reset button */}
          {isFiltered && (
            <button
              id="btn-reset-filters"
              className="btn-secondary"
              onClick={onResetFilters}
              title="Reset all filters"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Status pills navigation */}
      <div className="status-pills" role="tablist">
        {['ALL', 'Pending', 'In Progress', 'Completed'].map((status) => (
          <button
            key={status}
            id={`filter-pill-${status.toLowerCase().replace(' ', '-')}`}
            className={`status-pill ${statusFilter === status ? 'active' : ''}`}
            onClick={() => onStatusChange(status)}
            role="tab"
            aria-selected={statusFilter === status}
          >
            {status === 'ALL' ? 'All Tasks' : status}
          </button>
        ))}
      </div>
    </div>
  );
}
