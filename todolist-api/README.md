# ToDoList API

This is a RESTful API for a Todo List application built with Express, MongoDB, and Sequelize ORM.

## Features

- RESTful API (GET, POST, PUT, DELETE)
- MongoDB with Sequelize ORM
- Firebase Authentication integration
- Swagger API documentation
- CORS configuration

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community)
- [Firebase](https://firebase.google.com/) project (for authentication)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/todolist-api.git
cd todolist-api
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add the following variables:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/todolist
FRONTEND_URL=http://localhost:3000
```

4. Set up Firebase credentials:
   - Create a `config/firebaseServiceAccount.json` file with your Firebase service account key

5. Start the server:
```bash
npm run dev
```

## API Documentation

API documentation is available at `/api-docs` when the server is running.

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/todos | Get all todos for authenticated user |
| POST | /api/todos | Create a new todo |
| PUT | /api/todos/:id | Update a todo |
| DELETE | /api/todos/:id | Delete a todo |

### Authentication

All endpoints require authentication using a Firebase JWT token.

Include the token in the `Authorization` header:
```
Authorization: Bearer your-firebase-token
```

## Frontend Integration

### Connecting to the API

Update your frontend Firebase configuration to use the backend API:

1. Set the API base URL:

```javascript
// In your frontend constants file
export const API_BASE_URL = 'http://localhost:5000/api';
```

2. Create an API service:

```javascript
// src/services/api.js
import { auth } from '../firebase';

const getAuthToken = async () => {
  const user = auth.currentUser;
  if (user) {
    return await user.getIdToken();
  }
  return null;
};

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

export const apiService = {
  // Get all todos
  async getTodos() {
    const response = await fetchWithAuth(`${API_BASE_URL}/todos`);
    if (!response.ok) throw new Error('Failed to fetch todos');
    return response.json();
  },
  
  // Create a new todo
  async createTodo(task) {
    const response = await fetchWithAuth(`${API_BASE_URL}/todos`, {
      method: 'POST',
      body: JSON.stringify({ task }),
    });
    if (!response.ok) throw new Error('Failed to create todo');
    return response.json();
  },
  
  // Update a todo
  async updateTodo(id, updates) {
    const response = await fetchWithAuth(`${API_BASE_URL}/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update todo');
    return response.json();
  },
  
  // Delete a todo
  async deleteTodo(id) {
    const response = await fetchWithAuth(`${API_BASE_URL}/todos/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete todo');
    return response.json();
  },
};
```

### Common CORS Issues

CORS (Cross-Origin Resource Sharing) issues typically occur when the frontend and backend are hosted on different domains or ports. If you encounter CORS errors, ensure:

1. The backend CORS middleware is properly configured with your frontend URL
2. All required headers are allowed
3. Credentials mode is properly set if needed

If you're still facing CORS issues, you can:
- Check that `FRONTEND_URL` in your `.env` file matches your frontend's actual URL
- Ensure proper headers are being sent from your frontend
- Try using a CORS browser extension for development (not recommended for production)

## Database Schema

### Todo Model

```
Todo {
  id: String (Auto-generated)
  task: String (Required)
  completed: Boolean (Default: false)
  userId: String (Required, from Firebase auth)
  createdAt: Date (Auto-generated)
  updatedAt: Date (Auto-generated)
}
```

## License

This project is licensed under the MIT License