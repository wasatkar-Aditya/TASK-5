import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Navbar from './components/Navbar';
import TaskStats from './components/TaskStats';
import TaskFilters from './components/TaskFilters';
import TaskList from './components/TaskList';
import TaskFormModal from './components/TaskFormModal';
import ConfirmModal from './components/ConfirmModal';
import Toast from './components/Toast';
import { taskApi, extractErrorMessage } from './api/taskApi';

export default function App() {
  // Main data states
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [isApiConnected, setIsApiConnected] = useState(false);

  // Filter & Search states
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [selectedTask, setSelectedTask] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete confirmation modal states
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState(null);

  const showToast = useCallback((type, message) => {
    setToast({ type, message });
  }, []);

  // Fetch all tasks from Express API
  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const response = await taskApi.getTasks();
      if (response.success && Array.isArray(response.data)) {
        setTasks(response.data);
        setIsApiConnected(true);
      } else {
        throw new Error('Unexpected response format from API');
      }
    } catch (err) {
      const message = extractErrorMessage(err);
      setApiError(message);
      setIsApiConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check health periodically or on mount
  const checkBackendHealth = useCallback(async () => {
    try {
      await taskApi.checkHealth();
      setIsApiConnected(true);
    } catch {
      setIsApiConnected(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
    checkBackendHealth();
  }, [fetchTasks, checkBackendHealth]);

  // Handle Create Task
  const handleCreateTask = async (formData) => {
    setIsSubmitting(true);
    try {
      const response = await taskApi.createTask(formData);
      if (response.success && response.data) {
        // Prepend new task to state
        setTasks((prev) => [response.data, ...prev]);
        setIsModalOpen(false);
        showToast('success', `Task "${response.data.title}" created successfully!`);
      }
    } catch (err) {
      const message = extractErrorMessage(err);
      showToast('error', `Failed to create task: ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Update Task
  const handleUpdateTask = async (formData) => {
    if (!selectedTask?._id) return;
    setIsSubmitting(true);
    try {
      const response = await taskApi.updateTask(selectedTask._id, formData);
      if (response.success && response.data) {
        // Update task in state
        setTasks((prev) =>
          prev.map((t) => (t._id === selectedTask._id ? response.data : t))
        );
        setIsModalOpen(false);
        setSelectedTask(null);
        showToast('success', `Task "${response.data.title}" updated successfully!`);
      }
    } catch (err) {
      const message = extractErrorMessage(err);
      showToast('error', `Failed to update task: ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Quick Status Change from card dropdown
  const handleQuickStatusChange = async (taskId, newStatus) => {
    try {
      const response = await taskApi.updateTask(taskId, { status: newStatus });
      if (response.success && response.data) {
        setTasks((prev) =>
          prev.map((t) => (t._id === taskId ? response.data : t))
        );
        showToast('success', `Task moved to "${newStatus}"`);
      }
    } catch (err) {
      const message = extractErrorMessage(err);
      showToast('error', `Could not update status: ${message}`);
    }
  };

  // Handle Confirm Delete
  const handleConfirmDelete = async () => {
    if (!taskToDelete?._id) return;
    setIsDeleting(true);
    try {
      const response = await taskApi.deleteTask(taskToDelete._id);
      if (response.success) {
        setTasks((prev) => prev.filter((t) => t._id !== taskToDelete._id));
        showToast('success', `Task "${taskToDelete.title}" deleted successfully!`);
        setTaskToDelete(null);
      }
    } catch (err) {
      const message = extractErrorMessage(err);
      showToast('error', `Failed to delete task: ${message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Open modal in Create mode
  const handleOpenCreateModal = () => {
    setModalMode('create');
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  // Open modal in Edit mode
  const handleOpenEditModal = (task) => {
    setModalMode('edit');
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setStatusFilter('ALL');
    setPriorityFilter('ALL');
    setSearchQuery('');
    setSortBy('newest');
  };

  // Filtered and sorted tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Status filter
        if (statusFilter !== 'ALL' && task.status !== statusFilter) {
          return false;
        }
        // Priority filter
        if (priorityFilter !== 'ALL' && task.priority !== priorityFilter) {
          return false;
        }
        // Search filter
        if (searchQuery.trim() !== '') {
          const query = searchQuery.toLowerCase().trim();
          const titleMatch = task.title?.toLowerCase().includes(query);
          const descMatch = task.description?.toLowerCase().includes(query);
          if (!titleMatch && !descMatch) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        if (sortBy === 'oldest') {
          return new Date(a.createdAt) - new Date(b.createdAt);
        }
        if (sortBy === 'title-asc') {
          return (a.title || '').localeCompare(b.title || '');
        }
        if (sortBy === 'title-desc') {
          return (b.title || '').localeCompare(a.title || '');
        }
        return 0;
      });
  }, [tasks, statusFilter, priorityFilter, searchQuery, sortBy]);

  return (
    <div>
      {/* Sticky Header */}
      <Navbar
        onOpenCreateModal={handleOpenCreateModal}
        isApiConnected={isApiConnected}
      />

      <main className="app-container">
        {/* Metric Counter Cards */}
        <TaskStats
          tasks={tasks}
          activeStatus={statusFilter}
          onSelectStatus={setStatusFilter}
        />

        {/* Toolbar & Filter Navigation */}
        <TaskFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          priorityFilter={priorityFilter}
          onPriorityChange={setPriorityFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onResetFilters={handleResetFilters}
        />

        {/* Filter Results Summary */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            color: 'var(--text-secondary)',
            fontSize: '0.88rem'
          }}
        >
          <span>
            Showing <strong>{filteredTasks.length}</strong> of{' '}
            <strong>{tasks.length}</strong> tasks
          </span>
          {statusFilter !== 'ALL' && (
            <span>
              Filtered by: <strong>{statusFilter}</strong>
            </span>
          )}
        </div>

        {/* Task Cards Grid / Empty / Loading */}
        <TaskList
          tasks={filteredTasks}
          isLoading={isLoading}
          error={apiError}
          onRetry={fetchTasks}
          onEdit={handleOpenEditModal}
          onDelete={(task) => setTaskToDelete(task)}
          onQuickStatusChange={handleQuickStatusChange}
          onOpenCreateModal={handleOpenCreateModal}
        />
      </main>

      {/* Create / Edit Modal */}
      <TaskFormModal
        isOpen={isModalOpen}
        mode={modalMode}
        taskData={selectedTask}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(null);
        }}
        onSubmit={modalMode === 'edit' ? handleUpdateTask : handleCreateTask}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(taskToDelete)}
        title="Delete Task"
        taskTitle={taskToDelete?.title}
        message="Are you sure you want to permanently delete this task from the MongoDB database?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setTaskToDelete(null)}
        isDeleting={isDeleting}
      />

      {/* Toast Notification Container */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
