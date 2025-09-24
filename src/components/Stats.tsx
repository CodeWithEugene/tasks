import React from 'react';

interface StatsProps {
    stats: { completed: number; pending: number; total: number };
}

const StatCard: React.FC<{ title: string; value: string | number; bgColor: string }> = ({ title, value, bgColor }) => (
    <div className={`p-4 rounded-xl shadow-sm flex flex-col items-center justify-center text-center ${bgColor} transition-colors`}>
        <span className="text-xs text-gray-700 dark:text-gray-300 font-medium tracking-wider">{title}</span>
        <span className="text-4xl font-bold text-gray-800 dark:text-gray-100">{String(value).padStart(2, '0')}</span>
    </div>
);

const Stats: React.FC<StatsProps> = ({ stats }) => {
    return (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
            <StatCard title="COMPLETED TASKS" value={stats.completed} bgColor="bg-[#F5E8D3] dark:bg-gray-600" />
            <StatCard title="PENDING TASKS" value={stats.pending} bgColor="bg-[#D7C6BA] dark:bg-gray-500" />
            
            <div className="md:col-span-2 lg:col-span-2 flex items-center justify-between bg-white dark:bg-gray-700 p-4 rounded-xl shadow-sm transition-colors">
                <div>
                    <span className="text-sm text-blue-500 dark:text-blue-400 font-semibold">Tasks created</span>
                    <p className="text-4xl font-bold text-gray-800 dark:text-gray-100">{stats.total.toLocaleString()}</p>
                </div>
                <div className="text-right">
                     <span className="text-sm text-green-500 dark:text-green-400 font-semibold">25k+ Active Users</span>
                     <div className="flex -space-x-2 overflow-hidden mt-2 justify-end">
                        <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-700" src="https://picsum.photos/id/1005/32/32" alt="user"/>
                        <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-700" src="https://picsum.photos/id/1011/32/32" alt="user"/>
                        <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-700" src="https://picsum.photos/id/1025/32/32" alt="user"/>
                        <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-700" src="https://picsum.photos/id/1027/32/32" alt="user"/>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default Stats;