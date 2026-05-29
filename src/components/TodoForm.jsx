import React, { useState, useEffect, useRef } from 'react';

export function TodoForm({ onAddTodo, editingTodo, onCancelEdit }) {
  const [title, setTitle] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (editingTodo) {
      setTitle(editingTodo.title);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } else {
      setTitle('');
    }
  }, [editingTodo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTodo(title.trim());
    setTitle('');
    
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <form className="todo-form card" onSubmit={handleSubmit}>
      <h4>{editingTodo ? 'Edit Task' : 'Add New Task'}</h4>
      <input
        ref={inputRef}
        type="text"
        className="form-input"
        placeholder="Enter task title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <div className="form-actions-row" style={{ marginTop: '10px' }}>
        {editingTodo && (
          <button type="button" className="btn btn-secondary" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-primary">
          {editingTodo ? 'Update' : 'Add Task'}
        </button>
      </div>
    </form>
  );
}
