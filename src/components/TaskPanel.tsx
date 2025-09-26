import React, { useState, useMemo } from 'react';
import { Task, Priority, Category } from '../types';
import TaskItem from './TaskItem';
import { SearchIcon, PlusIcon, SparklesIcon } from './icons';
import { rewriteTaskWithAI, getAIStatus } from '../services/geminiService';

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
    const [mobileSelectedDate, setMobileSelectedDate] = useState<string>(() => {
        // Default to today's date in YYYY-MM-DD format
        return new Date().toISOString().split('T')[0];
    });
    const aiStatus = getAIStatus();

    // Get the effective selected date (from calendar or mobile picker)
    const getEffectiveSelectedDate = (): Date => {
        if (selectedDate) {
            return selectedDate; // Desktop calendar selection
        }
        if (mobileSelectedDate) {
            return new Date(mobileSelectedDate); // Mobile date picker selection
        }
        return new Date(); // Default to today if no date selected
    };

    const handleSmartAdd = async () => {
        if (!title.trim()) return;
        setIsAiLoading(true);
        try {
            const rewrittenTask = await rewriteTaskWithAI(title, description);
            // Create and add the enhanced task
            const effectiveDate = getEffectiveSelectedDate();
            const newTask = {
                title: rewrittenTask.title,
                description: rewrittenTask.description,
                startDate: effectiveDate.toISOString().split('T')[0],
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
        const effectiveDate = getEffectiveSelectedDate();
        onAddTask({
            title,
            description,
            startDate: effectiveDate.toISOString().split('T')[0],
            priority: Priority.MEDIUM,
            category: Category.PERSONAL,
        });
        setTitle('');
        setDescription('');
    }
    
    const filteredTasks = useMemo(() => {
        let tasksToFilter = tasks;
        const effectiveDate = getEffectiveSelectedDate();

        if (effectiveDate) {
            const dateString = effectiveDate.toISOString().split('T')[0];
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
    }, [tasks, searchTerm, selectedDate, mobileSelectedDate]);
    
    return (
        <div className="space-y-6">
            {/* Selected Date Indicator */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                    📅 Adding tasks for: <span className="font-semibold">{getEffectiveSelectedDate().toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}</span>
                </p>
            </div>
                        {!aiStatus.available && (
                            <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 rounded-lg p-3 text-sm flex items-start gap-2">
                                <span>⚠️</span>
                                <span><strong>AI disabled:</strong> {aiStatus.reason}. Tasks will be added without AI enhancement.</span>
                            </div>
                        )}
            
             {/* Task Creation UI */}
            <div className="space-y-4">
                 {/* Desktop Form */}
                <form onSubmit={handleRegularAdd} className="hidden sm:flex items-center gap-2">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder={`Add task for ${getEffectiveSelectedDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ✨`}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D48A8A] text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-colors"
                    />
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder={`Task details for ${getEffectiveSelectedDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
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
                    
                    {/* Mobile Date Picker */}
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-300 dark:border-gray-600">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            📅 Select date for task:
                        </label>
                        <input
                            type="date"
                            value={mobileSelectedDate}
                            onChange={(e) => setMobileSelectedDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#D48A8A] transition-colors"
                        />
                        {mobileSelectedDate && mobileSelectedDate !== new Date().toISOString().split('T')[0] && (
                            <button
                                type="button"
                                onClick={() => setMobileSelectedDate(new Date().toISOString().split('T')[0])}
                                className="mt-2 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                            >
                                Reset to today
                            </button>
                        )}
                    </div>
                    
                    <form onSubmit={handleRegularAdd} className="flex flex-col gap-2">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder={`Add task for ${getEffectiveSelectedDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}...`}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D48A8A] text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-colors"
                        />
                         <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder={`Task details for ${getEffectiveSelectedDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}...`}
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