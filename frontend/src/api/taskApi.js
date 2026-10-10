import axios from 'axios';

// Configurable base URL from environment variable or default fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
    const response = await apiClient.get('/tasks', { params });
    return response.data;
  },

  /**
   * Fetch a single task by ID
   */
  async getTaskById(id) {
    const response = await apiClient.get(`/tasks/${id}`);
    return response.data;
  },

  /**
   * Create a new task
   */
  async createTask(taskData) {
    const response = await apiClient.post('/tasks', taskData);
    return response.data;
  },

  /**
   * Update an existing task by ID
   */
  async updateTask(id, taskData) {
    const response = await apiClient.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  /**
   * Delete a task by ID
   */
  async deleteTask(id) {
    const response = await apiClient.delete(`/tasks/${id}`);
    return response.data;
  },

  /**
   * Check backend health status
   */
  async checkHealth() {
    const response = await apiClient.get('/health');
    return response.data;
  }
};

export default taskApi;
