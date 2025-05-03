import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

export const Todo = ({ task, toggleComplete, deleteToDo, editToDo }) => {
    return (
        <div className="flex justify-between items-center p-3 mb-2 bg-white border rounded shadow-sm" key={task.id}>
            <p className={`${task.completed ? 'line-through text-gray-500' : 'text-gray-800'} flex-grow`}>
                {task.task}
            </p>

            <div className="flex items-center gap-3">
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleComplete(task.id)}
                    className="w-4 h-4 cursor-pointer"
                />

                <FontAwesomeIcon
                    icon={faPenToSquare}
                    onClick={() => editToDo(task.id)}
                    className="text-blue-500 cursor-pointer hover:text-blue-700 transition w-4 h-4"
                />

                <FontAwesomeIcon
                    icon={faTrash}
                    onClick={() => deleteToDo(task.id)}
                    className="text-red-500 cursor-pointer hover:text-red-700 transition w-4 h-4"
                />
            </div>
        </div>
    );
};