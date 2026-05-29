import React from 'react';
import { TodoItem } from './TodoItem';
import { ClipboardList, Filter, Trash2 } from 'lucide-react';

export function TodoList({ 
  filteredTodos, 
  onToggleComplete, 
  onEdit, 
  onDeleteTrigger,
  onRestore,
  isFiltered,
  filterStatus
}) {
  const hasTodos = filteredTodos.length > 0;

  return (
    <div className="todo-list-section">
      <div className="list-header-row">
        <h3>
          {filterStatus === 'trash' ? 'Trash Bin' : 'Tasks'} ({filteredTodos.length})
        </h3>
        
        {isFiltered && filterStatus !== 'trash' && (
          <span className="filter-active-pill">Filter Active</span>
        )}
        
        {filterStatus === 'trash' && (
          <span className="filter-active-pill trash-pill">Auto-Deletes in 3 Days</span>
        )}
      </div>

      {hasTodos ? (
        <div className="todo-items-list">
          {filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggleComplete={onToggleComplete}
              onEdit={onEdit}
              onDeleteTrigger={onDeleteTrigger}
              onRestore={onRestore}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state card">
          {filterStatus === 'trash' ? (
            <>
              <div className="empty-state-icon-wrapper trash-empty-icon">
                <Trash2 className="empty-state-icon text-muted" size={28} />
              </div>
              <h4 className="empty-state-title">Trash is Empty</h4>
              <p className="empty-state-subtitle">
                When you delete tasks, they will sit here for 3 days before disappearing permanently.
              </p>
            </>
          ) : isFiltered ? (
            <>
              <div className="empty-state-icon-wrapper">
                <Filter className="empty-state-icon text-accent" size={28} />
              </div>
              <h4 className="empty-state-title">No Matching Tasks</h4>
              <p className="empty-state-subtitle">
                Try clearing your search query or adjusting your category/status filters.
              </p>
            </>
          ) : (
            <>
              <div className="empty-state-icon-wrapper">
                <ClipboardList className="empty-state-icon text-primary" size={28} />
              </div>
              <h4 className="empty-state-title">No Active Tasks</h4>
              <p className="empty-state-subtitle">
                Create a task in the form to get started and plan your agenda.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
