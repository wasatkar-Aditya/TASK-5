import mongoose from 'mongoose';
import Task from '../models/Task.js';

/**
 * @desc   Get all tasks with optional search, status & priority filters
 * @route  GET /api/tasks
 * @access Public
 */
export const getTasks = async (req, res, next) => {
  try {
    const { status, priority, search, sortBy = 'createdAt', order = 'desc' } = req.query;

    const filter = {};

    // Filter by status if provided
    if (status && ['Pending', 'In Progress', 'Completed'].includes(status)) {
      filter.status = status;
    }

    // Filter by priority if provided
    if (priority && ['Low', 'Medium', 'High'].includes(priority)) {
      filter.priority = priority;
    }

    // Search keyword in title or description
    if (search && search.trim() !== '') {
      filter.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    const sortOrder = order === 'asc' ? 1 : -1;
    const sortOptions = { [sortBy]: sortOrder };

    const tasks = await Task.find(filter).sort(sortOptions);

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get single task by ID
 * @route  GET /api/tasks/:id
 * @access Public
 */
export const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid Task ID format: "${id}"`
      });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task with ID "${id}" was not found`
      });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Create a new task
 * @route  POST /api/tasks
 * @access Public
 */
export const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority } = req.body;

    // Basic body presence check
    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Task title is required'
      });
    }

    const newTask = new Task({
      title: title.trim(),
      description: description ? description.trim() : '',
      status: status || 'Pending',
      priority: priority || 'Medium'
    });

    const savedTask = await newTask.save();

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: savedTask
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Update an existing task by ID
 * @route  PUT /api/tasks/:id
 * @access Public
 */
export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid Task ID format: "${id}"`
      });
    }

    const updates = {};
    if (req.body.title !== undefined) updates.title = req.body.title.trim();
    if (req.body.description !== undefined) updates.description = req.body.description.trim();
    if (req.body.status !== undefined) updates.status = req.body.status;
    if (req.body.priority !== undefined) updates.priority = req.body.priority;

    // Check if title is empty string
    if (req.body.title !== undefined && req.body.title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Task title cannot be empty'
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true } // Return updated doc & run schema validations
    );

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: `Task with ID "${id}" was not found`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Delete a task by ID
 * @route  DELETE /api/tasks/:id
 * @access Public
 */
export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid Task ID format: "${id}"`
      });
    }

    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({
        success: false,
        message: `Task with ID "${id}" was not found`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: {
        id: deletedTask._id,
        title: deletedTask.title
      }
    });
  } catch (error) {
    next(error);
  }
};
