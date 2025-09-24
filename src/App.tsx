import React, { useState, useMemo } from 'react';
import { Task, Priority, Category } from './types';
import Login from './components/Login';
import Header from './components/Header';
import Footer from './components/Footer';

// Fix for TypeScript errors on window.google property
declare global {
    interface Window {
        google: any;
    }
}

const initialTasks: Task[] = [
    { id: '1', title: 'Learn Javascript', description: 'Master the language powering the modern web.', startDate: '2023-07-07', completed: false, priority: Priority.HIGH, category: Category.LEARNING },
    { id: '2', title: 'Learn React', description: 'Build interactive UIs with the popular library.', startDate: '2023-07-08', completed: false, priority: Priority.HIGH, category: Category.LEARNING },
    { id: '3', title: 'Build a project', description: 'Apply skills to create a real-world app.', startDate: new Date().toISOString().split('T')[0], completed: true, priority: Priority.MEDIUM, category: Category.WORK },
    { id: '4', title: 'Go for a run', description: 'Morning jog in the park for 30 minutes.', startDate: new Date().toISOString().split('T')[0], completed: true, priority: Priority.LOW, category: Category.PERSONAL },
];

interface User {
    name: string;
    picture: string;
    email: string;
}

const App: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [user, setUser] = useState<User | null>(null);

    const stats = useMemo(() => {
        const completed = tasks.filter(task => task.completed).length;
        const pending = tasks.length - completed;
        return {
            completed,
            pending,
            total: tasks.length,
        };
    }, [tasks]);

    const handleAddTask = (task: Omit<Task, 'id' | 'completed'>) => {
        const newTask: Task = {
            ...task,
            id: new Date().toISOString(),
            completed: false,
        };
        setTasks(prevTasks => [newTask, ...prevTasks]);
    };

    const handleUpdateTask = (updatedTask: Task) => {
        setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
    };

    const handleDeleteTask = (taskId: string) => {
        setTasks(tasks.filter(task => task.id !== taskId));
    };

    const handleToggleComplete = (taskId: string) => {
        setTasks(tasks.map(task => task.id === taskId ? { ...task, completed: !task.completed } : task));
    };

    const handleSignIn = (userData: User) => {
        setUser(userData);
    };

    const handleSignOut = () => {
        if (typeof window.google !== 'undefined' && window.google.accounts) {
            window.google.accounts.id.disableAutoSelect();
        }
        setUser(null);
    };
    
    if (!user) {
        return <Login onSignIn={handleSignIn} />;
    }
    
    return (
        <div className="min-h-screen bg-[#FBF9F6] text-[#3D3D3D] flex flex-col">
            <Header user={user} onSignOut={handleSignOut} />
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="space-y-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Hello, {user.name}! <span className="font-light">Start Planning Your Day</span></h1>
                    
                    <div className="bg-[#F8F3ED] p-4 sm:p-6 lg:p-8 rounded-2xl shadow-md">
                        <h2 className="text-2xl font-bold mb-4">Your Tasks</h2>
                        
                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="bg-white p-4 rounded-xl text-center">
                                <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                                <div className="text-sm text-gray-600">Completed</div>
                            </div>
                            <div className="bg-white p-4 rounded-xl text-center">
                                <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                                <div className="text-sm text-gray-600">Pending</div>
                            </div>
                            <div className="bg-white p-4 rounded-xl text-center">
                                <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                                <div className="text-sm text-gray-600">Total</div>
                            </div>
                        </div>

                        {/* Task List */}
                        <div className="space-y-3">
                            {tasks.map(task => (
                                <div key={task.id} className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h3 className={`font-semibold ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                                {task.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                                            <div className="flex items-center space-x-4 mt-2">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    task.priority === Priority.HIGH ? 'bg-red-100 text-red-800' :
                                                    task.priority === Priority.MEDIUM ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-green-100 text-green-800'
                                                }`}>
                                                    {task.priority}
                                                </span>
                                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {task.category}
                                                </span>
                                                <span className="text-xs text-gray-500">{task.startDate}</span>
                                            </div>
                                        </div>
                                        <div className="ml-4 flex items-center space-x-2">
                                            <button
                                                onClick={() => handleToggleComplete(task.id)}
                                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                                title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
                                            >
                                                {task.completed ? (
                                                    <span className="text-green-500 text-2xl">✅</span>
                                                ) : (
                                                    <span className="text-gray-300 text-2xl hover:text-green-400">⭕</span>
                                                )}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteTask(task.id)}
                                                className="p-2 rounded-lg hover:bg-red-100 transition-colors text-red-500 hover:text-red-700"
                                                title="Delete task"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Add Task Button */}
                        <div className="mt-6 text-center">
                            <button
                                onClick={() => {
                                    const title = prompt('Task title:');
                                    const description = prompt('Task description:');
                                    if (title && description) {
                                        handleAddTask({
                                            title,
                                            description,
                                            startDate: new Date().toISOString().split('T')[0],
                                            priority: Priority.MEDIUM,
                                            category: Category.WORK
                                        });
                                    }
                                }}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                            >
                                ➕ Add New Task
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default App;