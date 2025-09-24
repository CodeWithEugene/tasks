import React, { useState, useMemo } from 'react';
import { Task, Priority, Category } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import Login from './components/Login';

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
                <Dashboard 
                    user={user}
                    tasks={tasks}
                    stats={stats}
                    onAddTask={handleAddTask}
                    onUpdateTask={handleUpdateTask}
                    onDeleteTask={handleDeleteTask}
                    onToggleComplete={handleToggleComplete}
                />
            </main>
            <Footer />
        </div>
    );
};

export default App;