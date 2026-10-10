import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import taskRoutes from './routes/taskRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration - allow requests from Vite frontend dev server
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in development
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
);

// Express JSON middleware to parse incoming JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root welcoming route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Task Manager API is running smoothly',
    endpoints: {
      health: 'GET /api/health',
      tasks: 'GET /api/tasks',
      createTask: 'POST /api/tasks',
      getTaskById: 'GET /api/tasks/:id',
      updateTask: 'PUT /api/tasks/:id',
      deleteTask: 'DELETE /api/tasks/:id'
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'Healthy',
    timestamp: new Date().toISOString()
  });
});

// Main Task resource API routes
app.use('/api/tasks', taskRoutes);

// Catch-all for undefined routes
app.use(notFound);

// Centralized error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Task Manager Backend Server is running on http://localhost:${PORT}`);
  console.log(`📡 API Endpoints base URL: http://localhost:${PORT}/api/tasks`);
});
