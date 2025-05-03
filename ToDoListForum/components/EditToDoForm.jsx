import React, { useState } from 'react';

export const EditTodoForm = ({ editToDo, task }) => {
    const [value, setValue] = useState(task.task);

    const handleSubmit = e => {
        e.preventDefault();
        
        if (value.trim()) {
            editToDo(value, task.id);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col mb-4">
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                placeholder="Update task" 
            />
            <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
                Update Task
            </button>
        </form>
    );
};