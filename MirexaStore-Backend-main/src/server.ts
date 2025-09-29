import mongoose from 'mongoose';
import app from './app';
import config from './app/config';
import { Server } from 'http'
import './app/cron/sellerValidityJob';

let server: Server;
let isConnected = false;

// Connect to MongoDB
async function connectDB() {
  if (isConnected) {
    return;
  }
  
  try {
    await mongoose.connect(config.database_url as string);
    isConnected = true;
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
}

// For Vercel serverless deployment
if (process.env.VERCEL) {
  // Initialize database connection for serverless
  connectDB().catch(console.error);
  
  // Export the app for Vercel
  module.exports = app;
} else {
  // For local development
  async function main() {
    try {
      await connectDB();

      server = app.listen(config.port, () => {
        console.log(`app is listening on port ${config.port}`);
      });
    } catch (err) {
      console.log(err);
    }
  }

  main();

  process.on('unhandledRejection', () => {
    console.log(`😪 unhandledRejection is detected, shutting down ....`);
    if (server) {
      server.close(() => {
        process.exit(1)
      })
    }
    process.exit(1)
  })
}

export default app;