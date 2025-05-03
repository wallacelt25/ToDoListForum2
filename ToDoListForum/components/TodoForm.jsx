import { useState } from "react";

export const TodoForm = ({ addToDo }) => {
    const [value, setValue] = useState("");

    const handleSubmit = e => {
        e.preventDefault();

        if (value.trim()) {
            addToDo(value);
            setValue("");
        }
    };

    return (
        <form className="flex flex-col" onSubmit={handleSubmit}>
            <input 
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                placeholder="What needs to be done?"
            />
            <button 
                type="submit" 
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
                Add Task
            </button>
        </form>
    );
};