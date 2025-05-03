// src/services/todoService.js
import { auth } from '../firebase';

// API base URL - should match your Express server
const API_BASE_URL = 'http://localhost:5000/api/todos';

// Get Firebase auth token
const getAuthToken = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }
  try {
    return await user.getIdToken();
  } catch (error) {
    console.error("Error getting auth token:", error);
    throw new Error('Failed to get authentication token');
  }
};

// Handle API responses
const handleResponse = async (response) => {
  // Check if the response is OK (status 200-299)
  if (!response.ok) {
    // Try to parse error message from JSON response
    try {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status} ${response.statusText}`);
    } catch (e) {
      // If parsing JSON fails, use status text
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
  }
  
  // Parse successful response
  try {
    return await response.json();
  } catch (error) {
    console.error("Error parsing response:", error);
    throw new Error('Invalid response format');
  }
};

// Fetch with authentication
const fetchWithAuth = async (url, options = {}) => {
  try {
    const token = await getAuthToken();
    
    // Include credentials for CORS with cookies
    const fetchOptions = {
      ...options,
      credentials: 'include', // Include cookies for CORS requests
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    };
    
    return await fetch(url, fetchOptions);
  } catch (error) {
    console.error("Fetch error:", error);
    // Specifically check for CORS errors
    if (error.message.includes('CORS') || error.name === 'TypeError') {
      throw new Error('Network error: CORS issue or server unavailable. Check that your backend is running and properly configured.');
    }
    throw error;
  }
};

// Todo service
const todoService = {
  // Get all todos
  async getTodos() {
    try {
      const response = await fetchWithAuth(API_BASE_URL);
      const result = await handleResponse(response);
      return result.data.todos;
    } catch (error) {
      console.error("Error getting todos:", error);
      throw error;
    }
  },
  
  // Get a single todo
  async getTodo(id) {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/${id}`);
      const result = await handleResponse(response);
      return result.data.todo;
    } catch (error) {
      console.error(`Error getting todo ${id}:`, error);
      throw error;
    }
  },
  
  // Create a new todo
  async createTodo(task) {
    try {
      const response = await fetchWithAuth(API_BASE_URL, {
        method: 'POST',
        body: JSON.stringify({ task }),
      });
      const result = await handleResponse(response);
      return result.data.todo;
    } catch (error) {
      console.error("Error creating todo:", error);
      throw error;
    }
  },
  
  // Update a todo
  async updateTodo(id, updates) {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      const result = await handleResponse(response);
      return result.data.todo;
    } catch (error) {
      console.error(`Error updating todo ${id}:`, error);
      throw error;
    }
  },
  
  // Delete a todo
  async deleteTodo(id) {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      await handleResponse(response);
      return { id };
    } catch (error) {
      console.error(`Error deleting todo ${id}:`, error);
      throw error;
    }
  }
};

export default todoService;