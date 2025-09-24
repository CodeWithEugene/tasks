import React, { useState } from 'react';
import { Task } from '../types';
import CalendarPanel from './CalendarPanel';
import TaskPanel from './TaskPanel';
import Stats from './Stats';

interface DashboardProps {
    user: { name: string };
    tasks: Task[];
    stats: { completed: number; pending: number; total: number };
    onAddTask: (task: Omit<Task, 'id' | 'completed'>) => void;
    onUpdateTask: (task: Task) => void;
    onDeleteTask: (taskId: string) => void;
    onToggleComplete: (taskId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = (props) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100">Hello, {props.user.name}! <span className="font-light">Start Planning Your Day</span></h1>
            
            <div className="bg-[#F8F3ED] dark:bg-gray-800 p-4 sm:p-6 lg:p-8 rounded-2xl shadow-md transition-colors">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="hidden lg:block lg:col-span-1">
                        <CalendarPanel onDateSelect={setSelectedDate} selectedDate={selectedDate}/>
                    </div>
                    <div className="col-span-1 lg:col-span-2">
                        <TaskPanel {...props} selectedDate={selectedDate} />
                    </div>
                </div>
                 <Stats stats={props.stats} />
            </div>
        </div>
    );
};

export default Dashboard;