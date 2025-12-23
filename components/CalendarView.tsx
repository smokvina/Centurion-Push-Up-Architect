import React from 'react';
import { WorkoutLog, UserProgress } from '../types';
import { MAX_TEST_WEEKS } from '../services/program';

interface CalendarViewProps {
  user: UserProgress;
}

const CalendarView: React.FC<CalendarViewProps> = ({ user }) => {
  const history = user.history;
  const schedule = user.reminders?.days || [1, 3, 5];
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  
  const getHrDayIndex = (date: Date) => {
    const day = date.getDay();
    return day === 0 ? 6 : day - 1;
  };

  const offset = getHrDayIndex(new Date(now.getFullYear(), now.getMonth(), 1));
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: offset }, (_, i) => i);

  const getDayStatus = (day: number) => {
    const date = new Date(now.getFullYear(), now.getMonth(), day);
    const dayOfWeek = date.getDay();
    
    const isCompleted = history.some(log => {
      const d = new Date(log.date);
      return d.getDate() === day && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });

    const isScheduled = schedule.includes(dayOfWeek);
    const isPast = date < new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const isToday = day === now.getDate();

    // Logic for identifying Max Test Day (simplified for calendar display)
    // We assume a Test week happens roughly every phase end.
    // To be precise, we check if this day maps to one of our test weeks.
    // For visual purposes, we'll mark the last scheduled workout day of weeks 4, 10, 16 etc.
    // If the user started on startDate, we calculate the week number.
    const start = new Date(user.startDate);
    const diffTime = Math.abs(date.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const weekNum = Math.ceil((diffDays + (start.getDay() || 7)) / 7);
    const isMaxTestDay = MAX_TEST_WEEKS.includes(weekNum) && dayOfWeek === schedule[schedule.length - 1];

    return { isCompleted, isScheduled, isPast, isToday, isMaxTestDay };
  };

  const monthNames = ["Siječanj", "Veljača", "Ožujak", "Travanj", "Svibanj", "Lipanj", "Srpanj", "Kolovoz", "Rujan", "Listopad", "Studeni", "Prosinac"];

  return (
    <div className="bg-white dark:bg-military-800 p-6 rounded-xl shadow border border-gray-200 dark:border-military-600">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold flex items-center dark:text-white uppercase tracking-wider">
          <i className="fas fa-calendar-alt text-military-400 mr-2"></i> {monthNames[now.getMonth()]} {now.getFullYear()}
        </h3>
        <div className="flex space-x-2">
            <div className="flex items-center text-[10px] font-bold uppercase text-military-400">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div> Max Test
            </div>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['P', 'U', 'S', 'Č', 'P', 'S', 'N'].map(d => (
          <div key={d} className="text-xs font-bold text-military-400">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {blanks.map(b => <div key={`b-${b}`} className="h-10"></div>)}
        {days.map(day => {
          const { isCompleted, isScheduled, isPast, isToday, isMaxTestDay } = getDayStatus(day);
          
          let bgColor = 'bg-gray-50 dark:bg-military-900/40';
          let textColor = 'text-gray-400 dark:text-military-500';
          let borderColor = 'border-transparent';

          if (isCompleted) {
            bgColor = 'bg-green-600';
            textColor = 'text-white font-bold';
          } else if (isMaxTestDay) {
            bgColor = 'bg-yellow-500/10 dark:bg-yellow-500/5';
            borderColor = 'border-yellow-500 border-dashed';
            textColor = 'text-yellow-600 dark:text-yellow-500 font-black';
          } else if (isScheduled) {
            if (isPast) {
                borderColor = 'border-red-500/50';
                bgColor = 'bg-red-50/5 dark:bg-red-900/10';
            } else {
                borderColor = 'border-green-500/30 border-dashed';
                bgColor = 'bg-green-50/5 dark:bg-green-900/5';
                textColor = 'text-green-600 dark:text-green-500 font-bold';
            }
          } else {
            bgColor = 'bg-blue-50/30 dark:bg-blue-900/10';
            textColor = 'text-blue-400/60 dark:text-blue-400/40';
          }

          if (isToday) {
            borderColor = 'border-yellow-500 border-2';
          }

          return (
            <div 
              key={day} 
              className={`h-10 flex flex-col items-center justify-center rounded-lg text-xs transition-all border ${bgColor} ${textColor} ${borderColor} relative overflow-hidden`}
            >
              <span>{day}</span>
              {isMaxTestDay && !isCompleted && (
                <i className="fas fa-trophy absolute top-0.5 right-0.5 text-[8px] text-yellow-500 animate-pulse"></i>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 space-y-2">
        <div className="flex items-center justify-between p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30">
            <div className="flex items-center">
                <i className="fas fa-trophy text-yellow-600 mr-2"></i>
                <span className="text-[10px] text-yellow-800 dark:text-yellow-400 font-bold uppercase">Dani za testiranje (Max Test)</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;