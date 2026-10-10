import mongoose from 'mongoose';

/**
 * Task Mongoose Schema
 * Represents a single task with validation, defaults, and automatic timestamps
 */
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      minlength: [2, 'Title must be at least 2 characters long'],
      maxlength: [120, 'Title cannot exceed 120 characters']
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    status: {
      type: String,
      enum: {
        values: ['Pending', 'In Progress', 'Completed'],
        message: '{VALUE} is not a valid status. Must be Pending, In Progress, or Completed'
      },
      default: 'Pending'
    },
    priority: {
      type: String,
      enum: {
        values: ['Low', 'Medium', 'High'],
        message: '{VALUE} is not a valid priority. Must be Low, Medium, or High'
      },
      default: 'Medium'
    }
  },
  {
    timestamps: true // Automatically creates createdAt and updatedAt fields
  }
);

// Virtual index for searching title and description
taskSchema.index({ title: 'text', description: 'text' });

const Task = mongoose.model('Task', taskSchema);

export default Task;
