import React from 'react';
import { TodoItem } from './TodoItem';

export function TodoList({ filteredTodos, onToggleComplete, onEdit, onDelete, onRestore }) {
  if (filteredTodos.length === 0) {
    return (
      <div className="empty-state card">
        <p>No tasks found.</p>
      </div>
    );
  }

  return (
    <div className="todo-items-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
          onRestore={onRestore}
        />
      ))}
    </div>
  );
}
