import React, { useState, useEffect } from 'react';
import { getTasks, addTask, updateTask, deleteTask } from './service';
import './TodoList.css';

const TodoList = ({ onLogout, addLog }) => {
  const [tasks, setTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load tasks on component mount
  useEffect(() => {
    addLog && addLog('Loading tasks from API...', 'debug');
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getTasks();
      setTasks(data);
      addLog && addLog('Tasks loaded successfully.', 'success');
    } catch (err) {
      setError('Failed to load tasks. Please make sure the API is running.');
      addLog && addLog(`Error loading tasks: ${err && err.message ? err.message : err}`, 'error');
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;
    addLog && addLog(`Adding new task: ${newTaskName}`, 'debug');

    try {
      setError('');
      const newTask = {
        name: newTaskName,
        isComplete: false
      };
      
      const addedTask = await addTask(newTask);
      setTasks([...tasks, addedTask]);
      setNewTaskName('');
      addLog && addLog(`Task added: ${addedTask.name} (ID: ${addedTask.id})`, 'success');
    } catch (err) {
      setError('Failed to add task');
      addLog && addLog(`Error adding task: ${err && err.message ? err.message : err}`, 'error');
      console.error('Error adding task:', err);
    }
  };

  const handleToggleComplete = async (task) => {
    addLog && addLog(`Toggling completion for task: ${task.name} (ID: ${task.id})`, 'debug');
    try {
      setError('');
      const updatedTask = {
        ...task,
        isComplete: !task.isComplete
      };
      
      await updateTask(task.id, updatedTask);
      setTasks(tasks.map(t => 
        t.id === task.id ? { ...t, isComplete: !t.isComplete } : t
      ));
      addLog && addLog(`Task updated: ${task.name} (ID: ${task.id})`, 'success');
    } catch (err) {
      setError('Failed to update task');
      addLog && addLog(`Error updating task: ${err && err.message ? err.message : err}`, 'error');
      console.error('Error updating task:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    addLog && addLog(`Deleting task (ID: ${taskId})`, 'debug');
    try {
      setError('');
      await deleteTask(taskId);
      setTasks(tasks.filter(t => t.id !== taskId));
      addLog && addLog(`Task deleted (ID: ${taskId})`, 'success');
    } catch (err) {
      setError('Failed to delete task');
      addLog && addLog(`Error deleting task: ${err && err.message ? err.message : err}`, 'error');
      console.error('Error deleting task:', err);
    }
  };

  const completedCount = tasks.filter(task => task.isComplete).length;
  const totalCount = tasks.length;

  return (
    <div className="todo-container">
      <div className="todo-header">
        <div className="header-top">
          <h1>📝 Todo List</h1>
          <button onClick={onLogout} className="logout-button">
            🚪 Logout
          </button>
        </div>
        <p className="task-counter">
          {completedCount} of {totalCount} tasks completed
        </p>
      </div>

      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleAddTask} className="add-task-form">
        <input
          type="text"
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          placeholder="Add a new task..."
          className="task-input"
          disabled={loading}
        />
        <button type="submit" className="add-button" disabled={loading || !newTaskName.trim()}>
          ➕ Add Task
        </button>
      </form>

      {loading && <div className="loading">Loading tasks...</div>}

      <div className="tasks-list">
        {tasks.length === 0 && !loading ? (
          <div className="empty-state">
            <p>🎉 No tasks yet! Add your first task above.</p>
          </div>
        ) : (
          tasks.map(task => (
            <div key={task.id} className={`task-item ${task.isComplete ? 'completed' : ''}`}>
              <div className="task-content">
                <input
                  type="checkbox"
                  checked={task.isComplete || false}
                  onChange={() => handleToggleComplete(task)}
                  className="task-checkbox"
                />
                <span className="task-name">
                  {task.name}
                </span>
              </div>
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="delete-button"
                title="Delete task"
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>

      <div className="footer">
        <p>Built with React & .NET Minimal API</p>
      </div>
    </div>
  );
};

export default TodoList;
