import React from 'react';

export function TodoItem({ todo, onToggleComplete, onEdit, onDelete, onRestore }) {
  const getRemainingTime = (deletedAt) => {
    const threeDays = 3 * 24 * 60 * 60 * 1000;
    const timeLeft = threeDays - (Date.now() - new Date(deletedAt).getTime());
    
    if (timeLeft <= 0) return 'Expiring now';
    
    const daysLeft = Math.ceil(timeLeft / (24 * 60 * 60 * 1000));
    return `Expires in ${daysLeft} days`;
  };

  return (
    <div className={`todo-item-card ${todo.completed ? 'completed' : ''}`}>
      {!todo.deletedAt && (
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggleComplete(todo.id)}
          style={{ cursor: 'pointer', marginRight: '10px' }}
        />
      )}

      <div className="todo-item-details" style={{ flexGrow: 1 }}>
        <span className="todo-title-text" style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
          {todo.title}
        </span>
        {todo.deletedAt && (
          <span style={{ fontSize: '0.75rem', color: '#ef4444', marginLeft: '10px' }}>
            ({getRemainingTime(todo.deletedAt)})
          </span>
        )}
      </div>

      <div className="todo-item-actions">
        {todo.deletedAt ? (
          <>
            <button className="btn btn-secondary" onClick={() => onRestore(todo.id)} style={{ padding: '4px 8px', marginRight: '5px' }}>
              Restore
            </button>
            <button className="btn btn-danger" onClick={() => onDelete(todo.id, true)} style={{ padding: '4px 8px' }}>
              Delete Permanently
            </button>
          </>
        ) : (
          <>
            <button className="btn btn-secondary" onClick={() => onEdit(todo)} style={{ padding: '4px 8px', marginRight: '5px' }}>
              Edit
            </button>
            <button className="btn btn-danger" onClick={() => onDelete(todo.id, false)} style={{ padding: '4px 8px' }}>
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}
