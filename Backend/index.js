const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const CONFIG = {
  PORT: process.env.PORT || 3000,
  MONGO_URI: process.env.MONGO_URI,
  FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN || 'https://fundgoal.funfrontend.com',
};

async function startServer() {
  try {
    if (!CONFIG.MONGO_URI) {
      throw new Error('MongoDB URI is not set. Please check your secrets.');
    }

    await mongoose.connect(CONFIG.MONGO_URI);
    console.log('Connected to MongoDB successfully');

    // Middleware
    app.use(cors({
      origin: CONFIG.FRONTEND_ORIGIN,
      credentials: true,
    }));

    app.use(express.json());

    // Routes
    app.get('/', (req, res) => {
      res.json({ status: 'ok', message: 'Hello from backend with MongoDB and CORS!' });
    });

    // Start server
    app.listen(CONFIG.PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${CONFIG.PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
