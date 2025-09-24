import React, { useState, useMemo } from 'react';
import { Task } from './types';
import Login from './components/Login';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import { saveTasksToCloud, loadTasksFromCloud } from './services/cloudStorage';
import { ThemeProvider } from './contexts/ThemeContext';

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
    const [tasks, setTasks] = useState<Task[]>(() => {
        // Load tasks from localStorage on initialization
        try {
            const savedTasks = localStorage.getItem('tasks');
            return savedTasks ? JSON.parse(savedTasks) : initialTasks;
        } catch (error) {
            console.error('Error loading tasks from localStorage:', error);
            return initialTasks;
        }
    });
    const [user, setUser] = useState<User | null>(() => {
        // Load user from localStorage on initialization
        try {
            const savedUser = localStorage.getItem('user');
            return savedUser ? JSON.parse(savedUser) : null;
        } catch (error) {
            console.error('Error loading user from localStorage:', error);
            return null;
        }
    });

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
        setTasks(prevTasks => {
            const updatedTasks = [newTask, ...prevTasks];
            // Save to localStorage
            try {
                localStorage.setItem('tasks', JSON.stringify(updatedTasks));
            } catch (error) {
                console.error('Error saving tasks to localStorage:', error);
            }
            // Save to cloud if user is logged in
            if (user) {
                console.log('Saving tasks to cloud for:', user.email);
                saveTasksToCloud(user.email, updatedTasks);
            }
            return updatedTasks;
        });
    };

    // const handleUpdateTask = (updatedTask: Task) => {
    //     setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
    // };

    const handleDeleteTask = (taskId: string) => {
        setTasks(prevTasks => {
            const updatedTasks = prevTasks.filter(task => task.id !== taskId);
            // Save to localStorage
            try {
                localStorage.setItem('tasks', JSON.stringify(updatedTasks));
            } catch (error) {
                console.error('Error saving tasks to localStorage:', error);
            }
            // Save to cloud if user is logged in
            if (user) {
                console.log('Saving tasks to cloud for:', user.email);
                saveTasksToCloud(user.email, updatedTasks);
            }
            return updatedTasks;
        });
    };

    const handleToggleComplete = (taskId: string) => {
        setTasks(prevTasks => {
            const updatedTasks = prevTasks.map(task => task.id === taskId ? { ...task, completed: !task.completed } : task);
            // Save to localStorage
            try {
                localStorage.setItem('tasks', JSON.stringify(updatedTasks));
            } catch (error) {
                console.error('Error saving tasks to localStorage:', error);
            }
            // Save to cloud if user is logged in
            if (user) {
                console.log('Saving tasks to cloud for:', user.email);
                saveTasksToCloud(user.email, updatedTasks);
            }
            return updatedTasks;
        });
    };

    const handleSignIn = async (userData: User) => {
        setUser(userData);
        // Save user to localStorage
        try {
            localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
            console.error('Error saving user to localStorage:', error);
        }

        // Load tasks from cloud storage
        try {
            console.log('Loading tasks from cloud for:', userData.email);
            const cloudTasks = await loadTasksFromCloud(userData.email);
            if (cloudTasks !== null) {
                console.log('Loaded tasks from cloud:', cloudTasks.length, 'tasks');
                setTasks(cloudTasks);
                // Update localStorage with cloud data
                localStorage.setItem('tasks', JSON.stringify(cloudTasks));
            } else {
                console.log('No cloud tasks found, using local storage');
            }
        } catch (error) {
            console.error('Error loading tasks from cloud:', error);
        }
    };

    const handleSignOut = () => {
        if (typeof window.google !== 'undefined' && window.google.accounts) {
            window.google.accounts.id.disableAutoSelect();
        }
        setUser(null);
        // Clear user from localStorage
        try {
            localStorage.removeItem('user');
        } catch (error) {
            console.error('Error removing user from localStorage:', error);
        }
    };
    
    if (!user) {
        return (
            <ThemeProvider>
                <Login onSignIn={handleSignIn} />
            </ThemeProvider>
        );
    }
    
    return (
        <ThemeProvider>
            <div className="min-h-screen bg-[#FBF9F6] dark:bg-gray-900 text-[#3D3D3D] dark:text-gray-100 flex flex-col transition-colors">
                <Header user={user} onSignOut={handleSignOut} />
                <main className="flex-grow container mx-auto px-4 py-8">
                    <Dashboard
                        user={{ name: user.name }}
                        tasks={tasks}
                        stats={stats}
                        onAddTask={handleAddTask}
                        onUpdateTask={(t) => {
                            setTasks(prev => {
                                const updatedTasks = prev.map(x => x.id === t.id ? t : x);
                                // Save to localStorage
                                try {
                                    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
                                } catch (error) {
                                    console.error('Error saving tasks to localStorage:', error);
                                }
                                // Save to cloud if user is logged in
                                if (user) {
                                    saveTasksToCloud(user.email, updatedTasks);
                                }
                                return updatedTasks;
                            });
                        }}
                        onDeleteTask={handleDeleteTask}
                        onToggleComplete={handleToggleComplete}
                    />
                </main>
                <Footer />
            </div>
        </ThemeProvider>
    );
};

export default App;