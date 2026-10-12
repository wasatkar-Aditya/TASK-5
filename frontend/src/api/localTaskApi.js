const STORAGE_KEY = 'taskflow-pro:tasks';

const VALID_STATUSES = ['Pending', 'In Progress', 'Completed'];
const VALID_PRIORITIES = ['Low', 'Medium', 'High'];

function readTasks() {
  try {
    const savedTasks = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(savedTasks) ? savedTasks : [];
  } catch {
    return [];
  }
}

function saveTasks(tasks) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function createId() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  return `local-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function findTask(id) {
  const task = readTasks().find((item) => item._id === id);
  if (!task) {
    throw new Error('Task not found');
  }
  return task;
}

function validateTask(taskData, { isUpdate = false } = {}) {
  const title = taskData.title?.trim();

  if (!isUpdate && !title) {
    throw new Error('Task title is required');
  }
  if (taskData.title !== undefined && !title) {
    throw new Error('Task title cannot be empty');
  }
  if (taskData.title && taskData.title.trim().length > 120) {
    throw new Error('Title cannot exceed 120 characters');
  }
  if (taskData.description && taskData.description.trim().length > 1000) {
    throw new Error('Description cannot exceed 1000 characters');
  }
  if (taskData.status && !VALID_STATUSES.includes(taskData.status)) {
    throw new Error('Invalid task status');
  }
  if (taskData.priority && !VALID_PRIORITIES.includes(taskData.priority)) {
    throw new Error('Invalid task priority');
  }
}

function filterTasks(tasks, { status, priority, search } = {}) {
  const query = search?.trim().toLowerCase();

  return tasks.filter((task) => {
    if (status && VALID_STATUSES.includes(status) && task.status !== status) return false;
    if (priority && VALID_PRIORITIES.includes(priority) && task.priority !== priority) return false;
    if (!query) return true;

    return [task.title, task.description].some((value) =>
      value?.toLowerCase().includes(query)
    );
  });
}

/**
 * Browser-backed version of the REST contract used when no public API URL is configured.
 * It keeps the hosted GitHub Pages site functional without exposing database credentials.
 */
export const localTaskApi = {
  async getTasks(params = {}) {
    const tasks = filterTasks(readTasks(), params).sort(
      (first, second) => new Date(second.createdAt) - new Date(first.createdAt)
    );
    return { success: true, count: tasks.length, data: tasks };
  },

  async getTask(id) {
    return { success: true, data: findTask(id) };
  },

  async createTask(taskData) {
    validateTask(taskData);

    const timestamp = new Date().toISOString();
    const newTask = {
      _id: createId(),
      title: taskData.title.trim(),
      description: taskData.description?.trim() || '',
      status: taskData.status || 'Pending',
      priority: taskData.priority || 'Medium',
      createdAt: timestamp,
      updatedAt: timestamp
    };

    const tasks = readTasks();
    saveTasks([newTask, ...tasks]);
    return { success: true, message: 'Task created successfully', data: newTask };
  },

  async updateTask(id, taskData) {
    validateTask(taskData, { isUpdate: true });
    const existingTask = findTask(id);
    const updatedTask = {
      ...existingTask,
      ...taskData,
      title: taskData.title === undefined ? existingTask.title : taskData.title.trim(),
      description:
        taskData.description === undefined ? existingTask.description : taskData.description?.trim() || '',
      updatedAt: new Date().toISOString()
    };

    saveTasks(readTasks().map((task) => (task._id === id ? updatedTask : task)));
    return { success: true, message: 'Task updated successfully', data: updatedTask };
  },

  async deleteTask(id) {
    const deletedTask = findTask(id);
    saveTasks(readTasks().filter((task) => task._id !== id));
    return {
      success: true,
      message: 'Task deleted successfully',
      data: { id: deletedTask._id, title: deletedTask.title }
    };
  },

  async checkHealth() {
    return { success: true, status: 'Browser storage active' };
  }
};
