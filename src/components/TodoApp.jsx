import React, { useState, useEffect } from 'react';
import { TodoForm } from './TodoForm';
import { TodoFilters } from './TodoFilters';
import { TodoList } from './TodoList';
import { TodoStats } from './TodoStats';

export function TodoApp() {
  const [todos, setTodos] = useState(() => {
    try {
      const saved = window.localStorage.getItem('taskflow-todos');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      { id: '1', title: 'Learn basic React hooks', completed: false, deletedAt: null },
      { id: '2', title: 'Practice using useState and useEffect', completed: true, deletedAt: null },
      { id: '3', title: 'Understand localStorage synchronization', completed: false, deletedAt: new Date().toISOString() }
    ];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [editingTodo, setEditingTodo] = useState(null);

  useEffect(() => {
    try {
      window.localStorage.setItem('taskflow-todos', JSON.stringify(todos));
    } catch (e) {
      console.error(e);
    }
  }, [todos]);

  useEffect(() => {
    const threeDays = 3 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    setTodos(prev => prev.filter(todo => {
      if (!todo.deletedAt) return true;
      const age = now - new Date(todo.deletedAt).getTime();
      return age < threeDays;
    }));
  }, []);

  const handleAddTodo = (title) => {
    if (editingTodo) {
      setTodos(prev => prev.map(todo => 
        todo.id === editingTodo.id ? { ...todo, title } : todo
      ));
      setEditingTodo(null);
    } else {
      const newTodo = {
        id: Date.now().toString(),
        title,
        completed: false,
        deletedAt: null
      };
      setTodos(prev => [newTodo, ...prev]);
    }
  };

  const handleToggleComplete = (id) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const handleRestoreTodo = (id) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, deletedAt: null } : todo
    ));
  };

  const handleEditTrigger = (todo) => {
    setEditingTodo(todo);
  };

  const handleCancelEdit = () => {
    setEditingTodo(null);
  };

  const handleDeleteTodo = (id, isPermanent) => {
    if (isPermanent) {
      const confirmDelete = window.confirm('Are you sure you want to permanently delete this task?');
      if (confirmDelete) {
        setTodos(prev => prev.filter(todo => todo.id !== id));
      }
    } else {
      setTodos(prev => prev.map(todo => 
        todo.id === id ? { ...todo, deletedAt: new Date().toISOString(), completed: false } : todo
      ));
      if (editingTodo && editingTodo.id === id) {
        setEditingTodo(null);
      }
    }
  };

  const filteredTodos = todos
    .filter(todo => {
      if (filterStatus === 'trash') {
        return !!todo.deletedAt;
      } else {
        if (todo.deletedAt) return false;
        if (filterStatus === 'active') return !todo.completed;
        if (filterStatus === 'completed') return todo.completed;
        return true;
      }
    })
    .filter(todo => {
      if (!searchQuery.trim()) return true;
      return todo.title.toLowerCase().includes(searchQuery.toLowerCase());
    });

  return (
    <div className="todo-app-shell" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <header className="app-header" style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2>My Todo List</h2>
      </header>

      <main className="app-layout-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
        <TodoForm
          onAddTodo={handleAddTodo}
          editingTodo={editingTodo}
          onCancelEdit={handleCancelEdit}
        />

        <TodoStats todos={todos} />

        <TodoFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
        />

        <TodoList
          filteredTodos={filteredTodos}
          onToggleComplete={handleToggleComplete}
          onEdit={handleEditTrigger}
          onDelete={handleDeleteTodo}
          onRestore={handleRestoreTodo}
        />
      </main>
    </div>
  );
}
