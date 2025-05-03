import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Todo } from './Todo.jsx';
import { TodoForm } from './TodoForm.jsx';
import { EditTodoForm } from './EditTodoForm.jsx';
import { todoService, authService, getCurrentUser } from '../src/services/api';

export const TodoWrapper = () => {
    const [todos, setTodos] = useState([]);
    const [showCompleted, setShowCompleted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Check authentication and fetch todos
    useEffect(() => {
        const user = getCurrentUser();
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchTodos = async () => {
            try {
                setIsLoading(true);
                const data = await todoService.getTodos();
                // Add isEditing property to each todo for frontend state management
                const todosWithEditing = data.map(todo => ({
                    ...todo,
                    isEditing: false
                }));
                setTodos(todosWithEditing);
                setError(null);
            } catch (error) {
                console.error('Error fetching todos:', error);
                setError('Failed to load todos. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTodos();
    }, [navigate]);

    const addToDo = async (task) => {
        try {
            const newTodo = await todoService.createTodo(task);
            setTodos([
                { 
                    ...newTodo, 
                    isEditing: false 
                }, 
                ...todos
            ]);
        } catch (error) {
            console.error('Error adding todo:', error);
            setError('Failed to add todo. Please try again.');
        }
    };

    const toggleComplete = async (id) => {
        try {
            const todo = todos.find(todo => todo.id === id);
            const updatedTodo = await todoService.updateTodo(id, {
                completed: !todo.completed
            });
            
            setTodos(todos.map(todo => 
                todo.id === id ? { ...updatedTodo, isEditing: false } : todo
            ));
        } catch (error) {
            console.error('Error updating todo:', error);
            setError('Failed to update todo. Please try again.');
        }
    };

    const deleteToDo = async (id) => {
        try {
            await todoService.deleteTodo(id);
            setTodos(todos.filter(todo => todo.id !== id));
        } catch (error) {
            console.error('Error deleting todo:', error);
            setError('Failed to delete todo. Please try again.');
        }
    };

    const editToDo = (id) => {
        setTodos(todos.map(todo => 
            todo.id === id ? { ...todo, isEditing: !todo.isEditing } : todo
        ));
    };

    const editTask = async (task, id) => {
        try {
            const updatedTodo = await todoService.updateTodo(id, { task });
            
            setTodos(todos.map(todo => 
                todo.id === id ? { ...updatedTodo, isEditing: false } : todo
            ));
        } catch (error) {
            console.error('Error updating todo:', error);
            setError('Failed to update todo. Please try again.');
        }
    };

    const toggleCompletedFilter = () => {
        setShowCompleted(!showCompleted);
    };

    const filteredTasks = showCompleted
        ? todos.filter(todo => todo.completed)
        : todos;

    const handleLogout = async () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-md mx-auto pt-10 pb-16 px-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">My Todo List</h1>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => navigate('/account')} 
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                        >
                            Account
                        </button>
                        <button 
                            onClick={handleLogout} 
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>
                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}
                
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Add a Task</h2>
                        <button 
                            onClick={toggleCompletedFilter}
                            className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition text-sm"
                        >
                            {showCompleted ? 'Show All' : 'Show Completed'}
                        </button>
                    </div>
                    <TodoForm addToDo={addToDo} />
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Task List</h2>
                    
                    {isLoading ? (
                        <div className="text-center py-4">
                            <p className="text-gray-500">Loading tasks...</p>
                        </div>
                    ) : filteredTasks.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">
                            {showCompleted 
                                ? "No completed tasks yet." 
                                : "No tasks yet. Add one above!"}
                        </p>
                     ) : (
                        <div className="space-y-3">
                            {filteredTasks.map((todo) => (
                                todo.isEditing ? (
                                    <EditTodoForm
                                        key={todo.id}
                                        editToDo={editTask}
                                        task={todo}
                                    />
                                ) : (
                                    <Todo
                                        key={todo.id}
                                        task={todo}
                                        toggleComplete={toggleComplete}
                                        deleteToDo={deleteToDo}
                                        editToDo={editToDo}
                                    />
                                )
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};