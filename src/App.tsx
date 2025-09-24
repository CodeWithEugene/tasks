import React, { useState, useMemo } from 'react';
import { Task } from './types';
import Login from './components/Login';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';

// Fix for TypeScript errors on window.google property
declare global {
    interface Window {
        google: any;
        onGoogleLibraryLoad: () => void;
    }
}

// Start with no tasks; user will add tasks via UI
const initialTasks: Task[] = [];

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

    // const handleUpdateTask = (updatedTask: Task) => {
    //     setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
    // };

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
                    user={{ name: user.name }}
                    tasks={tasks}
                    stats={stats}
                    onAddTask={handleAddTask}
                    onUpdateTask={(t) => setTasks(prev => prev.map(x => x.id === t.id ? t : x))}
                    onDeleteTask={handleDeleteTask}
                    onToggleComplete={handleToggleComplete}
                />
            </main>
            <Footer />
        </div>
    );
};

export default App;