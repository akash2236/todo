import React from 'react';

export function TodoStats({ todos }) {
  const activeTodos = todos.filter(t => !t.deletedAt);
  const total = activeTodos.length;
  const completed = activeTodos.filter(t => t.completed).length;
  const pending = total - completed;
  const inTrash = todos.filter(t => t.deletedAt).length;

  return (
    <div className="stats-container card">
      <h4>Stats Summary</h4>
      <div className="stats-basic-info">
        <p>Total Active: <strong>{total}</strong></p>
        <p>Completed: <strong className="text-success">{completed}</strong></p>
        <p>Pending: <strong className="text-primary">{pending}</strong></p>
        <p>In Trash Bin: <strong className="text-danger">{inTrash}</strong></p>
      </div>
    </div>
  );
}
