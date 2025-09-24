import React, { useState } from 'react';
import { ChevronDownIcon } from './icons';

interface CalendarPanelProps {
    onDateSelect: (date: Date | null) => void;
    selectedDate: Date | null;
}

const CalendarPanel: React.FC<CalendarPanelProps> = ({ onDateSelect, selectedDate }) => {
    const [displayDate, setDisplayDate] = useState(new Date());

    const daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const today = new Date();
    
    const year = displayDate.getFullYear();
    const month = displayDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const startOffset = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1;

    const handlePrevMonth = () => {
        setDisplayDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setDisplayDate(new Date(year, month + 1, 1));
    };

    const handleDayClick = (day: number) => {
        const clickedDate = new Date(year, month, day);
        if (selectedDate && selectedDate.toDateString() === clickedDate.toDateString()) {
            onDateSelect(null); // Deselect if clicking the same day
        } else {
            onDateSelect(clickedDate);
        }
    };

    const calendarDays = [];
    for (let i = 0; i < startOffset; i++) {
        calendarDays.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
        const isSelected = selectedDate ? (day === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear()) : false;
        const isRedDay = new Date(year, month, day).getDay() === 0;

        let dayClasses = 'flex items-center justify-center h-8 w-8 rounded-full cursor-pointer text-sm transition-colors ';
        if (isSelected) {
            dayClasses += 'bg-rose-400 text-white ';
        } else if (isToday) {
            dayClasses += 'bg-black dark:bg-gray-100 text-white dark:text-gray-900 ';
        } else {
            dayClasses += 'hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 ';
            if (isRedDay) {
                dayClasses += 'text-red-500 dark:text-red-400 ';
            }
        }
        
        calendarDays.push(
            <div key={day} className={dayClasses} onClick={() => handleDayClick(day)}>
                {day}
            </div>
        );
    }
    
    return (
        <div className="w-full h-full flex flex-col">
            <div className="text-left mb-4">
                <p className="font-playfair text-3xl text-[#D48A8A] italic">{today.toLocaleDateString('en-US', { weekday: 'long' })}</p>
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">{today.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow-inner flex-grow transition-colors">
                <div className="flex justify-between items-center mb-4">
                    <button onClick={handlePrevMonth} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transform rotate-90 transition-colors" aria-label="Previous month"><ChevronDownIcon /></button>
                    <span className="font-semibold text-lg text-gray-900 dark:text-gray-100">{monthNames[month]} {year}</span>
                    <button onClick={handleNextMonth} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transform -rotate-90 transition-colors" aria-label="Next month"><ChevronDownIcon /></button>
                </div>
                <div className="grid grid-cols-7 gap-y-2 text-center text-gray-500 dark:text-gray-400 text-xs">
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