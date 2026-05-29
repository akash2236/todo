import React, { useMemo } from 'react';
import { CheckCircle2, Circle, Trash2 } from 'lucide-react';

export function TodoStats({ todos }) {
  const stats = useMemo(() => {
    const activeTodos = todos.filter(todo => !todo.deletedAt);
    const totalActive = activeTodos.length;
    const completedActive = activeTodos.filter(todo => todo.completed).length;
    const pendingActive = totalActive - completedActive;
    const trashedCount = todos.filter(todo => todo.deletedAt).length;
    const completionRate = totalActive > 0 ? Math.round((completedActive / totalActive) * 100) : 0;

    return {
      totalActive,
      completedActive,
      pendingActive,
      trashedCount,
      completionRate
    };
  }, [todos]);

  return (
    <div className="stats-container card">
      <div className="stats-header">
        <h3>Task Overview</h3>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-num">{stats.totalActive}</span>
          <span className="stat-label">Active Tasks</span>
        </div>

        <div className="stat-card">
          <div className="stat-label-icon">
            <CheckCircle2 size={12} className="text-success" />
            <span className="stat-label">Completed</span>
          </div>
          <span className="stat-num text-success">{stats.completedActive}</span>
        </div>

        <div className="stat-card">
          <div className="stat-label-icon">
            <Circle size={12} className="text-primary" />
            <span className="stat-label">Pending</span>
          </div>
          <span className="stat-num text-primary">{stats.pendingActive}</span>
        </div>

        <div className="stat-card">
          <div className="stat-label-icon">
            <Trash2 size={12} className="text-danger" />
            <span className="stat-label">In Trash</span>
          </div>
          <span className="stat-num text-danger">{stats.trashedCount}</span>
        </div>
      </div>

      <div className="mini-progress-bar-container">
        <div className="mini-progress-labels">
          <span>Task Completion Progress</span>
          <span>{stats.completionRate}% ({stats.completedActive}/{stats.totalActive})</span>
        </div>
        <div className="mini-progress-track">
          <div 
            className="mini-progress-fill" 
            style={{ width: `${stats.completionRate}%` }}
          />
        </div>
      </div>
    </div>
  );
}
