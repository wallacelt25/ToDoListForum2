// controllers/todoController.js
const Todo = require('../models/todo');

// Get all todos for a user
const getTodos = async (req, res) => {
  try {
    const todos = await Todo.findAll({
      where: { userId: req.user.uid },
      order: [['createdAt', 'DESC']],
    });
    res.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new todo
const createTodo = async (req, res) => {
  try {
    const { task } = req.body;
    
    if (!task) {
      return res.status(400).json({ message: 'Task is required' });
    }
    
    const newTodo = await Todo.create({
      task,
      userId: req.user.uid,
    });
    
    res.status(201).json(newTodo);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a todo
const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { task, completed } = req.body;
    
    const todo = await Todo.findOne({
      where: {
        id,
        userId: req.user.uid,
      },
    });
    
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    const updatedTodo = await todo.update({
      task: task !== undefined ? task : todo.task,
      completed: completed !== undefined ? completed : todo.completed,
    });
    
    res.json(updatedTodo);
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a todo
const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    
    const todo = await Todo.findOne({
      where: {
        id,
        userId: req.user.uid,
      },
    });
    
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    await todo.destroy();
    
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
};