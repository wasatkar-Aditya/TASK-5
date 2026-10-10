// seed.mjs - Populate database with starter tasks
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Task from './src/models/Task.js';

dotenv.config();

const sampleTasks = [
  {
    title: 'Review Task 5 Internship Objectives',
    description: 'Understand the requirements for fullstack React, Node.js, Express, and MongoDB API integration.',
    status: 'Completed',
    priority: 'High'
  },
  {
    title: 'Build Express REST API with Mongoose',
    description: 'Implement GET, POST, PUT, DELETE endpoints with CORS and schema validation.',
    status: 'Completed',
    priority: 'High'
  },
  {
    title: 'Design Modern React Frontend UI',
    description: 'Craft an aesthetic UI with metric stats, interactive filter bar, task modals, and toast alerts.',
    status: 'In Progress',
    priority: 'Medium'
  },
  {
    title: 'Prepare Internship Mentor Presentation',
    description: 'Demonstrate database persistence, Postman testing, and explain fullstack architecture.',
    status: 'Pending',
    priority: 'High'
  },
  {
    title: 'Explore MongoDB Atlas Cloud Cluster',
    description: 'Test remote connection string switching in .env for production deployment.',
    status: 'Pending',
    priority: 'Low'
  }
];

async function seed() {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskmanager';
    await mongoose.connect(uri);
    console.log('Connected to MongoDB for seeding...');
    
    // Clear and insert
    await Task.deleteMany({});
    const inserted = await Task.insertMany(sampleTasks);
    console.log(`✅ Seeded ${inserted.length} sample tasks successfully!`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seed();
