import React from 'react';
import { UserProgress } from '../types';
import { getDailyWorkout } from '../services/program';

interface DashboardWidgetProps {
  user: UserProgress;
  onNavigate: (tab: any) => void;
}

const DashboardWidget: React.FC<DashboardWidgetProps> = ({ user, onNavigate }) => {
  const workout = getDailyWorkout(user.currentPhase, user.currentWeek, user.currentDay, user.maxReps);
  const totalRepsToday = workout.sets.reduce((a, b) => a + b, 0);
  
  const today = new Date().toDateString();
  const alreadyDoneToday = user.history.some(log => new Date(log.date).toDateString() === today);
  
  const progressPercent = Math.min(100, (user.dailyProgress / (user.dailyGoal || 1)) * 100);
  const remainingForGoal = Math.max(0, user.dailyGoal - user.dailyProgress);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {/* Daily Goal Widget */}
      <div className="bg-gradient-to-br from-military-800 to-military-900 p-6 rounded-2xl shadow-xl border border-military-700 text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-military-400">Dnevni Cilj</h4>
            <span className="text-2xl font-black text-green-500">{user.dailyProgress} / {user.dailyGoal}</span>
          </div>
          <div className="w-full bg-military-950 rounded-full h-4 mb-2">
            <div 
              className="bg-green-500 h-4 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(34,197,94,0.5)]" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          
          <div className="mt-4 flex items-start space-x-2">
             <i className="fas fa-lightbulb text-yellow-500 mt-1 text-xs"></i>
             <p className="text-[10px] text-military-300 leading-tight italic">
               {remainingForGoal > 0 
                 ? `Coach: Trebaš još ${remainingForGoal} sklekova. Odradi ih u 2-3 lagane serije tijekom popodneva (GtG metoda).` 
                 : "Coach: Dnevna kvota ispunjena. Fokusiraj se na oporavak!"}
             </p>
          </div>
        </div>
        <i className="fas fa-bullseye absolute -right-4 -bottom-4 text-8xl text-military-700 opacity-20"></i>
      </div>

      {/* Quick Workout Link */}
      <div 
        onClick={() => onNavigate('workout')}
        className={`p-6 rounded-2xl shadow-lg border transition-all transform hover:scale-[1.01] cursor-pointer ${
          alreadyDoneToday 
          ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/30' 
          : 'bg-white dark:bg-military-800 border-gray-100 dark:border-military-700 hover:border-green-500'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-military-400">Danasnji Program</h4>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
            alreadyDoneToday 
            ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
            : 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
          }`}>
            {alreadyDoneToday ? 'GOTOVO' : 'KRENI'}
          </span>
        </div>
        
        {alreadyDoneToday ? (
          <>
            <div className="text-2xl font-bold dark:text-white mb-1">Status: Oporavak</div>
            <div className="flex items-center text-sm text-gray-500 dark:text-military-300">
              <i className="fas fa-check-circle mr-2 text-blue-500"></i> Mišići su u fazi rasta
            </div>
          </>
        ) : (
          <>
            <div className="text-2xl font-bold dark:text-white mb-1">{workout.title}</div>
            <div className="flex items-center text-sm text-gray-500 dark:text-military-300">
              <i className="fas fa-dumbbell mr-2 text-green-500"></i> {totalRepsToday > 0 ? `${totalRepsToday} sklekova u planu` : "Dan za odmor"}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardWidget;