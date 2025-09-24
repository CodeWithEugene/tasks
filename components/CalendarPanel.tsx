
import React, { useState } from 'react';

const CalendarPanel: React.FC = () => {
    const [date, setDate] = useState(new Date());

    const daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0=Sun, 1=Mon...
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Adjust for week starting on Monday
    const startOffset = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1;

    const calendarDays = [];
    for (let i = 0; i < startOffset; i++) {
        calendarDays.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = day === currentDay && month === currentMonth && year === currentYear;
        const isRedDay = new Date(year, month, day).getDay() === 0; // Sunday
        
        calendarDays.push(
            <div key={day} className={`flex items-center justify-center h-8 w-8 rounded-full cursor-pointer text-sm ${isToday ? 'bg-black text-white' : ''} ${isRedDay && !isToday ? 'text-red-500' : ''}`}>
                {day}
            </div>
        );
    }
    
    return (
        <div className="w-full h-full flex flex-col">
            <div className="text-left mb-4">
                <p className="font-playfair text-3xl text-[#D48A8A] italic">Sunday</p>
                <p className="text-lg font-semibold text-gray-700">{today.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-inner flex-grow">
                <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold text-lg">{monthNames[month]}</span>
                </div>
                <div className="grid grid-cols-7 gap-y-2 text-center text-gray-500 text-xs">
                    {daysOfWeek.map(day => <div key={day} className="font-medium">{day}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-y-2 text-center mt-2">
                    {calendarDays}
                </div>
            </div>
        </div>
    );
};

export default CalendarPanel;
