import React, { useState, useMemo } from 'react';
import { Task, Priority, Category } from '../types';
import TaskItem from './TaskItem';
import { SearchIcon, PlusIcon, SparklesIcon } from './icons';
import { rewriteTaskWithAI } from '../services/geminiService';

interface TaskPanelProps {
    tasks: Task[];
    selectedDate: Date | null;
    onAddTask: (task: Omit<Task, 'id' | 'completed'>) => void;
    onUpdateTask: (task: Task) => void;
    onDeleteTask: (taskId: string) => void;
    onToggleComplete: (taskId: string) => void;
}

const TaskPanel: React.FC<TaskPanelProps> = ({ tasks, selectedDate, onAddTask, onUpdateTask, onDeleteTask, onToggleComplete }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);

    const handleSmartAdd = async () => {
        if (!title.trim()) return;
        setIsAiLoading(true);
        try {
            const rewrittenTask = await rewriteTaskWithAI(title, description);
            // Create and add the enhanced task
            const newTask = {
                title: rewrittenTask.title,
                description: rewrittenTask.description,
                startDate: new Date().toISOString().split('T')[0],
                priority: Priority.MEDIUM,
                category: Category.PERSONAL,
            };
            onAddTask(newTask);
            // Clear the input fields
            setTitle('');
            setDescription('');
        } catch (error) {
            alert(error instanceof Error ? error.message : "An unknown error occurred.");
        } finally {
            setIsAiLoading(false);
        }
    };
    
    const handleRegularAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if(!title.trim()) return;
        onAddTask({
            title,
            description,
            startDate: new Date().toISOString().split('T')[0],
            priority: Priority.MEDIUM,
            category: Category.PERSONAL,
        });
        setTitle('');
        setDescription('');
    }
    
    const filteredTasks = useMemo(() => {
        let tasksToFilter = tasks;

        if (selectedDate) {
            const dateString = selectedDate.toISOString().split('T')[0];
            tasksToFilter = tasksToFilter.filter(task => {
                if (task.deadline) return task.deadline.startsWith(dateString);
                return task.startDate === dateString;
            });
        }
        
        if (searchTerm) {
            tasksToFilter = tasksToFilter.filter(task => 
                task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                task.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return tasksToFilter;
    }, [tasks, searchTerm, selectedDate]);
    
    return (
        <div className="space-y-6">
             {/* Task Creation UI */}
            <div className="space-y-4">
                 {/* Desktop Form */}
                <form onSubmit={handleRegularAdd} className="hidden sm:flex items-center gap-2">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Type your task title and use AI to improve it ✨"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D48A8A] text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-colors"
                    />
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Add task details (AI will enhance both title and description)"
                        className="w-full hidden md:block px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D48A8A] text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-colors"
                    />
                    <button type="submit" className="bg-green-600 dark:bg-green-700 text-white p-3 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors shrink-0">
                        <PlusIcon />
                    </button>
                    <button type="button" onClick={handleSmartAdd} disabled={isAiLoading} className="bg-purple-600 dark:bg-purple-700 text-white p-3 rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors flex items-center justify-center disabled:bg-purple-300 dark:disabled:bg-purple-800 shrink-0">
                        {isAiLoading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <SparklesIcon />}
                    </button>
                </form>

                 {/* Mobile Header & Form */}
                <div className="sm:hidden flex flex-col space-y-4">
                    <div className="flex justify-between items-start">
                        <div>
                             <p className="font-playfair text-3xl text-[#D48A8A] dark:text-[#D48A8A] italic">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</p>
                        </div>
                         <button onClick={handleRegularAdd} className="bg-green-600 dark:bg-green-700 text-white p-3 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors shrink-0">
                            <PlusIcon />
                        </button>
                    </div>
                    <form onSubmit={handleRegularAdd} className="flex flex-col gap-2">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Type your task title..."
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D48A8A] text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-colors"
                        />
                         <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add task details..."
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D48A8A] text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-colors"
                        />
                        <button type="button" onClick={handleSmartAdd} disabled={isAiLoading} className="w-full bg-purple-600 dark:bg-purple-700 text-white p-3 rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors flex items-center justify-center disabled:bg-purple-300 dark:disabled:bg-purple-800 shrink-0 gap-2">
                            {isAiLoading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <SparklesIcon />}
                            Enhance with AI
                        </button>
                    </form>
                </div>
            </div>
            
             <div className="flex flex-col sm:flex-row items-center justify-end gap-4">
                 <div className="relative w-full sm:w-auto">
                    <input
                        type="text"
                        placeholder="Search by name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full sm:w-auto pl-4 pr-10 py-1.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg text-sm focus:outline-none text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-colors"
                    />
                    <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTasks.map(task => (
                    <TaskItem 
                        key={task.id}
                        task={task}
                        onUpdateTask={onUpdateTask}
                        onDeleteTask={onDeleteTask}
                        onToggleComplete={onToggleComplete}
                    />
                ))}
            </div>
            
            {filteredTasks.length > 4 && tasks.length > 4 && (
                <div className="text-center">
                    <button className="bg-white dark:bg-gray-800 px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-gray-100">Load more</button>
                </div>
            )}
        </div>
    );
};

export default TaskPanel;