import React, { useState, useEffect, useRef } from 'react';
import { PlusCircle, Edit3, XCircle } from 'lucide-react';

export function TodoForm({ onAddTodo, editingTodo, onCancelEdit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('personal');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  const titleInputRef = useRef(null);

  useEffect(() => {
    if (editingTodo) {
      setTitle(editingTodo.title || '');
      setDescription(editingTodo.description || '');
      setCategory(editingTodo.category || 'personal');
      setPriority(editingTodo.priority || 'medium');
      setDueDate(editingTodo.dueDate || '');
      
      if (titleInputRef.current) {
        titleInputRef.current.focus();
      }
    } else {
      clearForm();
    }
  }, [editingTodo]);

  const clearForm = () => {
    setTitle('');
    setDescription('');
    setCategory('personal');
    setPriority('medium');
    setDueDate('');
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Task title is required.');
      if (titleInputRef.current) {
        titleInputRef.current.focus();
      }
      return;
    }

    onAddTodo({
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      dueDate: dueDate || null
    });
    
    clearForm();

    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  };

  return (
    <form className="todo-form card" onSubmit={handleSubmit}>
      <div className="form-header">
        {editingTodo ? (
          <>
            <Edit3 className="form-header-icon text-accent" size={18} />
            <h3>Edit Task</h3>
          </>
        ) : (
          <>
            <PlusCircle className="form-header-icon text-primary" size={18} />
            <h3>Create New Task</h3>
          </>
        )}
      </div>

      <div className="form-grid">
        <div className="form-group span-2">
          <label htmlFor="todo-title">Task Title <span className="required-star">*</span></label>
          <input
            id="todo-title"
            ref={titleInputRef}
            type="text"
            className={`form-input ${error ? 'input-error' : ''}`}
            placeholder="e.g. Code frontend views..."
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError('');
            }}
          />
          {error && <span className="error-message-text">{error}</span>}
        </div>

        <div className="form-group span-2">
          <label htmlFor="todo-desc">Description</label>
          <textarea
            id="todo-desc"
            className="form-input form-textarea"
            placeholder="Details about this task..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="2"
          />
        </div>

        <div className="form-group">
          <label htmlFor="todo-category">Category</label>
          <select
            id="todo-category"
            className="form-input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="personal">Personal</option>
            <option value="work">Work</option>
            <option value="shopping">Shopping</option>
            <option value="health">Health</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="todo-priority">Priority</label>
          <select
            id="todo-priority"
            className="form-input"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="form-group span-2">
          <label htmlFor="todo-date">Due Date</label>
          <input
            id="todo-date"
            type="date"
            className="form-input"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      </div>

      <div className="form-actions-row">
        {editingTodo && (
          <button 
            type="button" 
            className="btn btn-secondary btn-icon-label" 
            onClick={onCancelEdit}
          >
            <XCircle size={16} />
            <span>Cancel</span>
          </button>
        )}
        <button type="submit" className="btn btn-primary btn-icon-label">
          {editingTodo ? (
            <>
              <Edit3 size={16} />
              <span>Update Task</span>
            </>
          ) : (
            <>
              <PlusCircle size={16} />
              <span>Add Task</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
