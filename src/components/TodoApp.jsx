import React, { useState, useEffect, useMemo, useReducer, useCallback } from 'react';
import { TodoForm } from './TodoForm';
import { TodoFilters } from './TodoFilters';
import { TodoList } from './TodoList';
import { TodoStats } from './TodoStats';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { Toast } from './Toast';
import { Sparkles } from 'lucide-react';

const todoReducer = (state, action) => {
  switch (action.type) {
    case 'ADD':
      return [action.payload, ...state];
    case 'UPDATE':
      return state.map(todo => 
        todo.id === action.payload.id 
          ? { ...todo, ...action.payload.todoData } 
          : todo
      );
    case 'TOGGLE':
      return state.map(todo => 
        todo.id === action.payload 
          ? { ...todo, completed: !todo.completed } 
          : todo
      );
    case 'RESTORE':
      return state.map(todo => 
        todo.id === action.payload 
          ? { ...todo, deletedAt: null } 
          : todo
      );
    case 'DELETE_SOFT':
      return state.map(todo => 
        todo.id === action.payload 
          ? { ...todo, deletedAt: new Date().toISOString(), completed: false } 
          : todo
      );
    case 'DELETE_PERMANENT':
      return state.filter(todo => todo.id !== action.payload);
    case 'CLEANUP_EXPIRED': {
      const threeDaysInMs = 3 * 24 * 60 * 60 * 1000;
      const now = Date.now();
      return state.filter(todo => {
        if (!todo.deletedAt) return true;
        const deletedTime = new Date(todo.deletedAt).getTime();
        const age = now - deletedTime;
        return age < threeDaysInMs;
      });
    }
    default:
      return state;
  }
};

const getInitialTodos = () => {
  try {
    const item = window.localStorage.getItem('taskflow-todos');
    if (item) return JSON.parse(item);
  } catch (error) {
    console.error(error);
  }
  return [
    {
      id: 'default-1',
      title: 'Review React frontend code structure',
      description: 'Check how useState, useRef, and useEffect are modularized.',
      category: 'work',
      priority: 'high',
      dueDate: new Date().toISOString().split('T')[0],
      completed: false,
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      deletedAt: null
    },
    {
      id: 'default-2',
      title: 'Restock healthy snacks',
      description: 'Buy fresh apples, green tea, and almonds.',
      category: 'shopping',
      priority: 'low',
      dueDate: null,
      completed: true,
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      deletedAt: null
    },
    {
      id: 'default-3',
      title: 'Old task that was recently deleted',
      description: 'This is in the trash bin. Click the Trash tab to view or restore it!',
      category: 'other',
      priority: 'medium',
      dueDate: null,
      completed: false,
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      deletedAt: new Date(Date.now() - 3600000 * 4).toISOString()
    }
  ];
};

export function TodoApp() {
  const [todos, dispatch] = useReducer(todoReducer, null, getInitialTodos);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const [editingTodo, setEditingTodo] = useState(null);
  const [todoToDelete, setTodoToDelete] = useState(null);
  const [modalIsPermanent, setModalIsPermanent] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    try {
      window.localStorage.setItem('taskflow-todos', JSON.stringify(todos));
    } catch (error) {
      console.error(error);
    }
  }, [todos]);

  useEffect(() => {
    dispatch({ type: 'CLEANUP_EXPIRED' });
  }, []);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleAddOrEditTodo = useCallback((todoData) => {
    if (editingTodo) {
      dispatch({
        type: 'UPDATE',
        payload: { id: editingTodo.id, todoData }
      });
      addToast(`Updated task: "${todoData.title}"`, 'success');
      setEditingTodo(null);
    } else {
      const newTodo = {
        id: Date.now().toString(),
        completed: false,
        createdAt: new Date().toISOString(),
        deletedAt: null,
        ...todoData
      };
      dispatch({ type: 'ADD', payload: newTodo });
      addToast(`Added task: "${todoData.title}"`, 'success');
    }
  }, [editingTodo, addToast]);

  const handleToggleComplete = useCallback((id) => {
    dispatch({ type: 'TOGGLE', payload: id });
    const todo = todos.find(t => t.id === id);
    if (todo) {
      addToast(
        !todo.completed 
          ? `Completed task 🎉` 
          : `Reopened task`, 
        !todo.completed ? 'success' : 'info'
      );
    }
  }, [todos, addToast]);

  const handleRestoreTodo = useCallback((id) => {
    dispatch({ type: 'RESTORE', payload: id });
    addToast(`Restored task to list`, 'success');
  }, [addToast]);

  const handleEditTrigger = useCallback((todo) => {
    setEditingTodo(todo);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingTodo(null);
    addToast('Editing cancelled', 'info');
  }, [addToast]);

  const handleDeleteTrigger = useCallback((todo, isPermanent = false) => {
    setTodoToDelete(todo);
    setModalIsPermanent(isPermanent);
    setIsDeleteModalOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (todoToDelete) {
      if (modalIsPermanent) {
        dispatch({ type: 'DELETE_PERMANENT', payload: todoToDelete.id });
        addToast(`Permanently deleted task`, 'warning');
      } else {
        dispatch({ type: 'DELETE_SOFT', payload: todoToDelete.id });
        addToast(`Moved task to Trash bin`, 'warning');
      }
      
      if (editingTodo && editingTodo.id === todoToDelete.id) {
        setEditingTodo(null);
      }
      
      setTodoToDelete(null);
      setIsDeleteModalOpen(false);
    }
  }, [todoToDelete, modalIsPermanent, editingTodo, addToast]);

  const filteredAndSortedTodos = useMemo(() => {
    return todos
      .filter((todo) => {
        if (filterStatus === 'trash') {
          return !!todo.deletedAt;
        } else {
          return !todo.deletedAt;
        }
      })
      .filter((todo) => {
        if (filterStatus === 'active') return !todo.completed;
        if (filterStatus === 'completed') return todo.completed;
        return true;
      })
      .filter((todo) => {
        if (filterCategory !== 'all') return todo.category === filterCategory;
        return true;
      })
      .filter((todo) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        const matchesTitle = todo.title.toLowerCase().includes(q);
        const matchesDesc = (todo.description || '').toLowerCase().includes(q);
        return matchesTitle || matchesDesc;
      })
      .sort((a, b) => {
        if (sortBy === 'oldest') {
          return new Date(a.createdAt) - new Date(b.createdAt);
        }
        if (sortBy === 'dueDate') {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        }
        if (sortBy === 'alphabetical') {
          return a.title.localeCompare(b.title);
        }
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
  }, [todos, searchQuery, filterStatus, filterCategory, sortBy]);

  const isFiltered = useMemo(() => {
    return (
      searchQuery.trim() !== '' ||
      filterCategory !== 'all' ||
      (filterStatus !== 'all' && filterStatus !== 'trash')
    );
  }, [searchQuery, filterCategory, filterStatus]);

  return (
    <div className="todo-app-shell">
      <div className="bg-glow bg-glow-purple" />
      <div className="bg-glow bg-glow-pink" />

      <Toast toasts={toasts} removeToast={removeToast} />

      <header className="app-header">
        <div className="logo-group">
          <h1>TASKFLOW</h1>
          <span className="logo-divider">|</span>
          <p className="logo-tagline">Clean Todo Workspace</p>
        </div>
        <div className="version-pill">
          <Sparkles size={12} className="sparkle-icon" />
          <span>React Dashboard</span>
        </div>
      </header>

      <main className="app-layout-grid">
        <div className="layout-col-sidebar">
          <TodoForm
            onAddTodo={handleAddOrEditTodo}
            editingTodo={editingTodo}
            onCancelEdit={handleCancelEdit}
          />
          <TodoStats todos={todos} />
        </div>

        <div className="layout-col-main">
          <TodoFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />

          <TodoList
            filteredTodos={filteredAndSortedTodos}
            onToggleComplete={handleToggleComplete}
            onEdit={handleEditTrigger}
            onDeleteTrigger={handleDeleteTrigger}
            onRestore={handleRestoreTodo}
            isFiltered={isFiltered}
            filterStatus={filterStatus}
          />
        </div>
      </main>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setTodoToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        todoTitle={todoToDelete?.title}
        isPermanent={modalIsPermanent}
      />
    </div>
  );
}
