import React from 'react';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export function TodoFilters({
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
  filterCategory,
  setFilterCategory,
  sortBy,
  setSortBy
}) {
  const categories = ['all', 'personal', 'work', 'shopping', 'health', 'other'];
  const statuses = ['all', 'active', 'completed', 'trash'];

  return (
    <div className="filters-container card">
      <div className="search-box-wrapper">
        <Search className="search-icon" size={16} />
        <input
          type="text"
          className="search-input"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button 
            type="button"
            className="clear-search-btn" 
            onClick={() => setSearchQuery('')}
            title="Clear search"
          >
            &times;
          </button>
        )}
      </div>

      <div className="filters-controls-row">
        <div className="status-tabs-container">
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

        <div className="filters-dropdowns-group">
          <div className="dropdown-wrapper">
            <SlidersHorizontal size={12} className="select-icon" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="select-filter"
              aria-label="Filter by Category"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  Category: {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="dropdown-wrapper">
            <ArrowUpDown size={12} className="select-icon" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="select-filter"
              aria-label="Sort order"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="dueDate">Due Date</option>
              <option value="alphabetical">A-Z</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
