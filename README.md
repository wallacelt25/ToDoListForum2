# ToDo List API

A RESTful API for managing todo lists, built with Express.js and Sequelize ORM.

- [API Design](#api-design)
- [Diffuculties](#difficulties)

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

## Difficulties

It was hard to find the right database to implement ORM on the database using sequiloze. I had to reconfigure the Firebase as it wasn't compatbile for the method which was quite complicated. Sequiler took quite a while but Swagger was a little bit more simpler. It was hard also when I wanted to check if everything was right or not.
