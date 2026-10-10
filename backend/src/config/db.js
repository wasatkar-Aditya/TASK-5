import mongoose from 'mongoose';

/**
 * Connect to MongoDB database
 * Uses MONGO_URI from environment variables with fallback
 */
export const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskmanager';
  
  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected successfully!`);
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error(`   Please ensure MongoDB is running or check your MONGO_URI in backend/.env`);
    process.exit(1);
  }
};
