import React from 'react';
import { 
  Calendar, 
  Trash2, 
  Edit2, 
  Check, 
  User, 
  Briefcase, 
  ShoppingCart, 
  HeartPulse, 
  FolderMinus,
  AlertCircle,
  RotateCcw
} from 'lucide-react';

export function TodoItem({ todo, onToggleComplete, onEdit, onDeleteTrigger, onRestore }) {
  
  const getCategoryConfig = (category) => {
    switch (category) {
      case 'personal':
        return { icon: <User size={12} />, label: 'Personal', className: 'cat-personal' };
      case 'work':
        return { icon: <Briefcase size={12} />, label: 'Work', className: 'cat-work' };
      case 'shopping':
        return { icon: <ShoppingCart size={12} />, label: 'Shopping', className: 'cat-shopping' };
      case 'health':
        return { icon: <HeartPulse size={12} />, label: 'Health', className: 'cat-health' };
      case 'other':
      default:
        return { icon: <FolderMinus size={12} />, label: 'Other', className: 'cat-other' };
    }
  };

  const catConfig = getCategoryConfig(todo.category);

  const isOverdue = () => {
    if (!todo.dueDate || todo.completed || todo.deletedAt) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(todo.dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getRemainingDays = (deletedAt) => {
    const threeDaysInMs = 3 * 24 * 60 * 60 * 1000;
    const deletedTime = new Date(deletedAt).getTime();
    const timePassed = Date.now() - deletedTime;
    const timeLeft = threeDaysInMs - timePassed;
    
    if (timeLeft <= 0) return 'Expiring now...';
    
    const daysLeft = Math.ceil(timeLeft / (24 * 60 * 60 * 1000));
    if (daysLeft <= 1) {
      const hoursLeft = Math.ceil(timeLeft / (60 * 60 * 1000));
      return `Expires in ${hoursLeft}h`;
    }
    return `Expires in ${daysLeft} days`;
  };

  return (
    <div className={`todo-item-card 
      ${todo.completed ? 'completed' : ''} 
      ${isOverdue() ? 'overdue' : ''} 
      ${todo.deletedAt ? 'in-trash' : ''}
    `}>
      
      {!todo.deletedAt && (
        <div className="todo-checkbox-wrapper">
          <button
            type="button"
            className={`todo-custom-checkbox ${todo.completed ? 'checked' : ''}`}
            onClick={() => onToggleComplete(todo.id)}
            aria-label={todo.completed ? "Mark incomplete" : "Mark complete"}
          >
            {todo.completed && <Check size={14} className="checkbox-check-icon" />}
          </button>
        </div>
      )}

      <div className="todo-item-details">
        <div className="todo-item-main">
          <h4 className="todo-title-text">{todo.title}</h4>
          {todo.description && (
            <p className="todo-description-text">{todo.description}</p>
          )}
        </div>

        <div className="todo-meta-row">
          <span className={`badge ${catConfig.className}`}>
            {catConfig.icon}
            <span>{catConfig.label}</span>
          </span>

          {!todo.deletedAt && (
            <span className={`badge prio-${todo.priority}`}>
              <span className="dot" />
              <span>{todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}</span>
            </span>
          )}

          {todo.dueDate && !todo.deletedAt && (
            <span className={`todo-due-badge ${isOverdue() ? 'text-danger overdue-pulse' : ''}`}>
              {isOverdue() ? <AlertCircle size={12} /> : <Calendar size={12} />}
              <span>{isOverdue() ? 'Overdue: ' : 'Due: '}{formatDate(todo.dueDate)}</span>
            </span>
          )}

          {todo.deletedAt && (
            <span className="badge badge-trash-countdown">
              <AlertCircle size={12} className="text-danger" />
              <span>{getRemainingDays(todo.deletedAt)}</span>
            </span>
          )}
        </div>
      </div>

      <div className="todo-item-actions">
        {todo.deletedAt ? (
          <>
            <button
              type="button"
              className="todo-action-btn restore"
              onClick={() => onRestore(todo.id)}
              title="Restore Task"
            >
              <RotateCcw size={14} />
            </button>
            <button
              type="button"
              className="todo-action-btn delete-permanent"
              onClick={() => onDeleteTrigger(todo, true)}
              title="Delete Permanently"
            >
              <Trash2 size={14} />
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="todo-action-btn edit"
              onClick={() => onEdit(todo)}
              title="Edit Task"
            >
              <Edit2 size={14} />
            </button>
            <button
              type="button"
              className="todo-action-btn delete"
              onClick={() => onDeleteTrigger(todo, false)}
              title="Move to Trash"
            >
              <Trash2 size={14} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
