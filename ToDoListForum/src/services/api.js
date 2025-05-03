// src/services/api.js
import { auth } from '../firebase';

const API_BASE_URL = 'http://localhost:5000/api';

// Get Firebase auth token
const getAuthToken = async () => {
  const user = auth.currentUser;
  if (user) {
    return await user.getIdToken();
  }
  throw new Error('User not authenticated');
};

// Fetch with authentication
const fetchWithAuth = async (url, options = {}) => {
  const token = await getAuthToken();
  
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });
};

// Handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const errorMessage = errorData?.message || 'An error occurred';
    throw new Error(errorMessage);
  }
  return response.json();
};

// Todo API service
export const todoService = {
  // Get all todos for the authenticated user
  async getTodos() {
    const response = await fetchWithAuth(`${API_BASE_URL}/todos`);
    return handleResponse(response);
  },
  
  // Create a new todo
  async createTodo(task) {
    const response = await fetchWithAuth(`${API_BASE_URL}/todos`, {
      method: 'POST',
      body: JSON.stringify({ task }),
    });
    return handleResponse(response);
  },
  
  // Update a todo
  async updateTodo(id, updates) {
    const response = await fetchWithAuth(`${API_BASE_URL}/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return handleResponse(response);
  },
  
  // Delete a todo
  async deleteTodo(id) {
    const response = await fetchWithAuth(`${API_BASE_URL}/todos/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};