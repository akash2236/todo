import React from 'react';

export function TodoFilters({ searchQuery, setSearchQuery, filterStatus, setFilterStatus }) {
  const statuses = ['all', 'active', 'completed', 'trash'];

  return (
    <div className="filters-container card">
      <input
        type="text"
        className="search-input"
        placeholder="Search tasks..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="status-tabs-container" style={{ marginTop: '10px' }}>
        {statuses.map(status => (
          <button
            key={status}
            type="button"
            className={`status-tab-btn ${filterStatus === status ? 'active' : ''}`}
            onClick={() => setFilterStatus(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
