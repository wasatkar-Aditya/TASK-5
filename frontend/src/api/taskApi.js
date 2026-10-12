import axios from 'axios';
import { localTaskApi } from './localTaskApi';

// A configured URL uses the Express/MongoDB API. GitHub Pages has no server runtime,
// so production builds with no URL use browser storage instead of requesting localhost.
const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
export const isLocalStorageMode =
  import.meta.env.VITE_TASK_STORAGE === 'local' ||
  (!configuredApiUrl && import.meta.env.PROD);
const API_BASE_URL = configuredApiUrl || 'http://localhost:5000/api';

// Create configured axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 second timeout
});

// Helper to extract clear error messages from backend or network
export const extractErrorMessage = (error) => {
  if (error.response?.data?.message) {
    if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
      return `${error.response.data.message}: ${error.response.data.errors.join(', ')}`;
    }
    return error.response.data.message;
  }
  if (error.message === 'Network Error') {
    return 'Cannot reach the backend API server. Please check if your Express backend is running on port 5000.';
  }
  return error.message || 'An unexpected error occurred';
};

/**
 * Task API Service Methods
 */
export const taskApi = {
  /**
   * Fetch all tasks with optional filters (status, priority, search)
   */
  async getTasks(params = {}) {
    if (isLocalStorageMode) return localTaskApi.getTasks(params);
    const response = await apiClient.get('/tasks', { params });
    return response.data;
  },

  /**
   * Fetch a single task by ID
   */
  async getTaskById(id) {
    if (isLocalStorageMode) return localTaskApi.getTask(id);
    const response = await apiClient.get(`/tasks/${id}`);
    return response.data;
  },

  /**
   * Create a new task
   */
  async createTask(taskData) {
    if (isLocalStorageMode) return localTaskApi.createTask(taskData);
    const response = await apiClient.post('/tasks', taskData);
    return response.data;
  },

  /**
   * Update an existing task by ID
   */
  async updateTask(id, taskData) {
    if (isLocalStorageMode) return localTaskApi.updateTask(id, taskData);
    const response = await apiClient.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  /**
   * Delete a task by ID
   */
  async deleteTask(id) {
    if (isLocalStorageMode) return localTaskApi.deleteTask(id);
    const response = await apiClient.delete(`/tasks/${id}`);
    return response.data;
  },

  /**
   * Check backend health status
   */
  async checkHealth() {
    if (isLocalStorageMode) return localTaskApi.checkHealth();
    const response = await apiClient.get('/health');
    return response.data;
  }
};

export default taskApi;
