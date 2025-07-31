const express = require('express');
const axios = require('axios');
const https = require('https');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Render API Service',
    endpoints: {
      services: '/services - Get list of all services in your Render account'
    }
  });
});

// GET endpoint to fetch list of services from Render API
app.get('/services', async (req, res) => {
  try {
    // Check if API key is configured
    if (!process.env.RENDER_API_KEY || process.env.RENDER_API_KEY === 'your_render_api_key_here') {
      return res.status(500).json({
        error: 'Render API key not configured',
        message: 'Please set your RENDER_API_KEY in the .env file'
      });
    }

    // Create HTTPS agent that ignores SSL certificate errors
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false
    });

    // Make request to Render API to list services
    const response = await axios.get('https://api.render.com/v1/services', {
      headers: {
        'Authorization': `Bearer ${process.env.RENDER_API_KEY}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      httpsAgent: httpsAgent
    });

    // Return the services data
    res.json({
      success: true,
      count: response.data.length,
      services: response.data
    });

  } catch (error) {
    console.error('Error fetching services from Render API:', error.message);
    
    // Handle different types of errors
    if (error.response) {
      // API responded with error status
      res.status(error.response.status).json({
        error: 'Render API Error',
        message: error.response.data?.message || error.message,
        status: error.response.status
      });
    } else if (error.request) {
      // Request was made but no response received
      res.status(500).json({
        error: 'Network Error',
        message: 'Unable to connect to Render API'
      });
    } else {
      // Something else happened
      res.status(500).json({
        error: 'Internal Server Error',
        message: error.message
      });
    }
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Render API Service running on port ${PORT}`);
  console.log(`📋 Services endpoint: http://localhost:${PORT}/services`);
  console.log(`💚 Health check: http://localhost:${PORT}/health`);
  
  if (!process.env.RENDER_API_KEY || process.env.RENDER_API_KEY === 'your_render_api_key_here') {
    console.log('⚠️  Warning: Please set your RENDER_API_KEY in the .env file');
  }
});

module.exports = app;
