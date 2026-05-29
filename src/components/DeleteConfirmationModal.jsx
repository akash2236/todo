import React, { useEffect, useRef } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export function DeleteConfirmationModal({ isOpen, onClose, onConfirm, todoTitle, isPermanent }) {
  const confirmBtnRef = useRef(null);

  useEffect(() => {
    if (isOpen && confirmBtnRef.current) {
      confirmBtnRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close dialog">
          <X size={18} />
        </button>
        
        <div className="modal-header">
          <div className="warning-icon-wrapper">
            <AlertTriangle className="warning-icon" size={24} />
          </div>
          <h3>{isPermanent ? 'Delete Permanently' : 'Move to Trash'}</h3>
        </div>

        <div className="modal-body">
          <p>
            {isPermanent 
              ? 'Are you sure you want to permanently delete this task?' 
              : 'Are you sure you want to move this task to the Trash?'}
          </p>
          
          {todoTitle && (
            <div className="todo-preview-box">
              <span className="todo-preview-title">"{todoTitle}"</span>
            </div>
          )}
          
          <p className="warning-text">
            {isPermanent 
              ? 'This action is irreversible.' 
              : 'Tasks in trash are saved for 3 days before auto-deleting.'}
          </p>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button 
            ref={confirmBtnRef} 
            className="btn btn-danger" 
            onClick={onConfirm}
          >
            <Trash2 size={16} />
            <span>{isPermanent ? 'Delete' : 'Move to Trash'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
