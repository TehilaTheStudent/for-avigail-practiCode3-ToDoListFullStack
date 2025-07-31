import axios from 'axios';

// Configure axios defaults - setting the base URL for the API
axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL || '/'; // Uses env var if set, else relative

// Request interceptor to add JWT token to requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and log them
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    
    // Handle 401 errors - redirect to login page
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.reload(); // This will trigger the authentication check in App.js
    }
    
    return Promise.reject(error);
  }
);

// Get all tasks
export const getTasks = async () => {
  try {
    const response = await axios.get('/items');
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

// Add new task
export const addTask = async (task) => {
  try {
    const response = await axios.post('/items', task);
    return response.data;
  } catch (error) {
    console.error('Error adding task:', error);
    throw error;
  }
};

// Update task
export const updateTask = async (id, task) => {
  try {
    const response = await axios.put(`/items/${id}`, task);
    return response.data;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

// Delete task
export const deleteTask = async (id) => {
  try {
    const response = await axios.delete(`/items/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};
