# ToDo List API

A RESTful API for managing todo lists, built with Express.js and Sequelize ORM.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Setup](#setup)
- [API Design](#api-design)
- [API Documentation](#api-documentation)

## Features

- User Authentication (Register, Login)
- JWT-based Authentication
- CRUD operations for Todo items
- API Documentation with Swagger

## Technologies

- **Backend**: Node.js, Express.js
- **Database ORM**: Sequelize
- **Database**: MySQL (can be configured to use PostgreSQL or SQLite)
- **Authentication**: JWT (JSON Web Tokens)
- **API Documentation**: Swagger UI
- **Security**: bcrypt for password hashing

## Setup

### Prerequisites

- Node.js (v14+)
- MySQL (or your preferred database)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd todo-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=5000
DB_NAME=todo_db
DB_USER=root
DB_PASSWORD=yourpassword
DB_HOST=localhost
JWT_SECRET=your_jwt_secret_key
```

4. Create the database:
```sql
CREATE DATABASE todo_db;
```

5. Start the server:
```bash
npm start
```

6. The server will run on `http://localhost:5000`
7. Access Swagger documentation at `http://localhost:5000/api-docs`

## API Design

### Authentication Endpoints

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | Log in a user |
| GET | /api/auth/profile | Get user profile (requires authentication) |
| PUT | /api/auth/profile | Update user profile (requires authentication) |

### Todo Endpoints

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | /api/todos | Get all todos for authenticated user |
| POST | /api/todos | Create a new todo |
| PUT | /api/todos/:id | Update a todo by ID |
| DELETE | /api/todos/:id | Delete a todo by ID |

### Request/Response Examples

#### Register a User

Request:
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "token": "jwt_token_here"
}
```

#### Login

Request:
```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "photoURL": null,
  "token": "jwt_token_here"
}
```

#### Create a Todo

Request:
```json
POST /api/todos
Authorization: Bearer jwt_token_here
{
  "task": "Complete homework"
}
```

Response:
```json
{
  "id": 1,
  "task": "Complete homework",
  "completed": false,
  "userId": 1,
  "createdAt": "2023-10-12T15:30:00.000Z",
  "updatedAt": "2023-10-12T15:30:00.000Z"
}
```

#### Get All Todos

Request:
```
GET /api/todos
Authorization: Bearer jwt_token_here
```

Response:
```json
[
  {
    "id": 1,
    "task": "Complete homework",
    "completed": false,
    "userId": 1,
    "createdAt": "2023-10-12T15:30:00.000Z",
    "updatedAt": "2023-10-12T15:30:00.000Z"
  },
  {
    "id": 2,
    "task": "Go grocery shopping",
    "completed": true,
    "userId": 1,
    "createdAt": "2023-10-12T15:35:00.000Z",
    "updatedAt": "2023-10-12T15:40:00.000Z"
  }
]
```

#### Update a Todo

Request:
```json
PUT /api/todos/1
Authorization: Bearer jwt_token_here
{
  "task": "Complete homework assignment",
  "completed": true
}
```

Response:
```json
{
  "id": 1,
  "task": "Complete homework assignment",
  "completed": true,
  "userId": 1,
  "createdAt": "2023-10-12T15:30:00.000Z",
  "updatedAt": "2023-10-12T15:45:00.000Z"
}
```

#### Delete a Todo

Request:
```
DELETE /api/todos/1
Authorization: Bearer jwt_token_here
```

Response:
```json
{
  "message": "Todo deleted"
}
```

## API Documentation

The API is documented using Swagger UI. After starting the server, you can access the documentation at:

```
http://localhost:5000/api-docs
```

This provides an interactive interface to:
- View all available endpoints
- Read detailed documentation about each endpoint
- Make test requests directly from the browser