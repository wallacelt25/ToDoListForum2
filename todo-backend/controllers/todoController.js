// controllers/todoController.js
const { Todo } = require('../models');

// Get all todos for authenticated user
exports.getTodos = async (req, res) => {
  try {
    const todos = await Todo.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    });
    
    res.json(todos);
  } catch (error) {
    console.error('Get todos error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new todo
exports.createTodo = async (req, res) => {
  try {
    const { task } = req.body;
    
    if (!task) {
      return res.status(400).json({ message: 'Task is required' });
    }
    
    const todo = await Todo.create({
      task,
      userId: req.user.id,
    });
    
    res.status(201).json(todo);
  } catch (error) {
    console.error('Create todo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a todo
exports.updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { task, completed } = req.body;
    
    const todo = await Todo.findOne({
      where: { id, userId: req.user.id },
    });
    
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    // Update todo
    if (task !== undefined) {
      todo.task = task;
    }
    
    if (completed !== undefined) {
      todo.completed = completed;
    }
    
    await todo.save();
    
    res.json(todo);
  } catch (error) {
    console.error('Update todo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a todo
exports.deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    
    const todo = await Todo.findOne({
      where: { id, userId: req.user.id },
    });
    
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    await todo.destroy();
    
    res.json({ message: 'Todo deleted' });
  } catch (error) {
    console.error('Delete todo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};