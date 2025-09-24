import React, { useState } from 'react';
import { Task } from '../types';
import { CheckCircleIcon, EditIcon, TrashIcon } from './icons';

interface TaskItemProps {
    task: Task;
    onUpdateTask: (task: Task) => void;
    onDeleteTask: (taskId: string) => void;
    onToggleComplete: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onUpdateTask, onDeleteTask, onToggleComplete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(task.title);
    const [editedDescription, setEditedDescription] = useState(task.description);

    const handleSave = () => {
        onUpdateTask({ ...task, title: editedTitle, description: editedDescription });
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div className="bg-[#f3e5cd] dark:bg-gray-700 p-4 rounded-xl shadow-sm space-y-3 ring-2 ring-[#D48A8A] transition-colors">
                <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="w-full px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-lg font-bold bg-white dark:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-[#D48A8A] text-gray-900 dark:text-gray-100 transition-colors"
                    aria-label="Edit task title"
                />
                <textarea
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    className="w-full px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-[#D48A8A] text-gray-900 dark:text-gray-100 transition-colors"
                    rows={2}
                    aria-label="Edit task description"
                />
                 <p className="text-xs text-gray-500 dark:text-gray-400">Start date : {task.startDate}</p>
                <div className="flex items-center justify-end space-x-2">
                    <button onClick={() => setIsEditing(false)} className="px-3 py-1 text-sm rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">Cancel</button>
                    <button onClick={handleSave} className="px-3 py-1 text-sm rounded-md bg-green-600 dark:bg-green-700 text-white hover:bg-green-700 dark:hover:bg-green-600 transition-colors">Save</button>
                </div>
            </div>
        );
    }


    return (
        <div className={`bg-[#F5E8D3] dark:bg-gray-700 p-4 rounded-xl shadow-sm flex justify-between items-start transition-all ${task.completed ? 'opacity-60' : 'opacity-100'}`}>
            <div className="flex-grow mr-4">
                <h3 className={`font-bold text-lg text-gray-800 dark:text-gray-100 ${task.completed ? 'line-through' : ''}`}>{task.title}</h3>
                <p className={`text-sm text-gray-600 dark:text-gray-300 mt-1 ${task.completed ? 'line-through' : ''}`}>{task.description}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">Start date : {task.startDate}</p>
                {task.deadline && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Deadline : {task.deadline}</p>
                )}
            </div>
            <div className="flex flex-col items-center space-y-2 ml-4 shrink-0">
                <button onClick={() => onToggleComplete(task.id)} className="text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors" aria-label="Toggle complete">
                    <CheckCircleIcon completed={task.completed} />
                </button>
                <button onClick={() => setIsEditing(true)} className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" aria-label="Edit task">
                    <EditIcon />
                </button>
                <button onClick={() => onDeleteTask(task.id)} className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors" aria-label="Delete task">
                    <TrashIcon />
                </button>
            </div>
        </div>
    );
};

export default TaskItem;