// src/services/api.js
const API_BASE_URL = 'http://localhost:5000/api';

// Local storage keys
const TOKEN_KEY = 'todo_token';
const USER_KEY = 'todo_user';

// Get auth token from local storage
const getToken = () => localStorage.getItem(TOKEN_KEY);

// Get current user from local storage
export const getCurrentUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

// Set auth token and user in local storage
export const setAuth = (token, user) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

// Clear auth token and user from local storage
export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// Check if user is authenticated
export const isAuthenticated = () => !!getToken();

// Fetch with authentication
const fetchWithAuth = async (url, options = {}) => {
  const token = getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return fetch(url, {
    ...options,
    headers,
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

// Auth API service
export const authService = {
  // Register a new user
  async register(name, email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });
    
    const data = await handleResponse(response);
    setAuth(data.token, {
      id: data.id,
      name: data.name,
      email: data.email,
      photoURL: data.photoURL,
    });
    
    return data;
  },
  
  // Login a user
  async login(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await handleResponse(response);
    setAuth(data.token, {
      id: data.id,
      name: data.name,
      email: data.email,
      photoURL: data.photoURL,
    });
    
    return data;
  },
  
  // Logout a user
  logout() {
    clearAuth();
  },
  
  // Get user profile
  async getProfile() {
    const response = await fetchWithAuth(`${API_BASE_URL}/auth/profile`);
    return handleResponse(response);
  },
  
  // Update user profile
  async updateProfile(userData) {
    const response = await fetchWithAuth(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    
    const data = await handleResponse(response);
    
    // Update stored user data
    const currentUser = getCurrentUser();
    if (currentUser) {
      setAuth(getToken(), {
        ...currentUser,
        name: data.name,
        photoURL: data.photoURL,
      });
    }
    
    return data;
  },
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