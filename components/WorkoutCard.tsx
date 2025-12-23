import React, { useState } from 'react';
import { UserProgress } from '../types';
import { getDailyWorkout, PHASES, isMaxTestDay } from '../services/program';

interface WorkoutCardProps {
  user: UserProgress;
  onComplete: () => void;
  onNavigateToMaxTest?: () => void;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ user, onComplete, onNavigateToMaxTest }) => {
  const currentPhase = PHASES.find((p) => p.id === user.currentPhase);
  const workout = getDailyWorkout(user.currentPhase, user.currentWeek, user.currentDay, user.maxReps);
  const [completedSets, setCompletedSets] = useState<boolean[]>(new Array(workout.sets.length).fill(false));

  const isTestDay = isMaxTestDay(user.currentWeek, user.currentDay);

  // Check if a workout was already recorded today
  const today = new Date().toDateString();
  const alreadyDoneToday = user.history.some(log => new Date(log.date).toDateString() === today);

  const toggleSet = (index: number) => {
    const newSets = [...completedSets];
    newSets[index] = !newSets[index];
    setCompletedSets(newSets);
  };

  const allSetsDone = workout.sets.length > 0 && completedSets.every((s) => s);

  if (alreadyDoneToday) {
    return (
      <div className="bg-white dark:bg-military-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-military-600 mb-6 animate-fade-in">
        <div className="bg-blue-600 p-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white uppercase tracking-wide">Faza Oporavka</h2>
            <p className="text-blue-100 text-sm italic">"Mišići rastu dok odmaraš, ne dok treniraš."</p>
          </div>
          <div className="text-white text-3xl">
            <i className="fas fa-couch"></i>
          </div>
        </div>
        <div className="p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 mb-6">
            <i className="fas fa-check-double text-3xl"></i>
          </div>
          <h3 className="text-2xl font-black dark:text-white mb-2 uppercase">Trening za danas je završen!</h3>
          <p className="text-military-400 mb-8 max-w-md mx-auto">
            Sustav je zabilježio tvoj napredak. Sljedeća sesija će biti dostupna sutra. Iskoristi ovo vrijeme za istezanje, kvalitetan san i unos proteina.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <div className="p-4 bg-gray-50 dark:bg-military-900 rounded-xl border border-gray-100 dark:border-military-700">
              <div className="text-blue-500 font-bold text-xs uppercase mb-1">Savjet za danas</div>
              <p className="text-xs dark:text-gray-300">Pij minimalno 3L vode i odradi 10 minuta laganog istezanja ramena i prsa.</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-military-900 rounded-xl border border-gray-100 dark:border-military-700">
              <div className="text-green-500 font-bold text-xs uppercase mb-1">Sljedeći korak</div>
              <p className="text-xs dark:text-gray-300">Sljedeći trening je <strong>Tjedan {user.currentWeek} - Dan {user.currentDay}</strong>.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isTestDay) {
    return (
      <div className="bg-white dark:bg-military-800 rounded-xl shadow-2xl overflow-hidden border-4 border-yellow-500 mb-6 animate-pulse-slow">
        <div className="bg-yellow-500 p-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-black uppercase tracking-tighter">DAN ZA MAX TEST!</h2>
            <p className="text-yellow-900 text-xs font-bold uppercase tracking-widest">Status: Spreman za borbu</p>
          </div>
          <div className="text-black text-4xl">
            <i className="fas fa-trophy"></i>
          </div>
        </div>
        <div className="p-8 text-center">
          <h3 className="text-2xl font-black dark:text-white mb-4 uppercase">Danas nema običnog treninga!</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            Stigli smo do kraja faze. Da bismo znali jesi li spreman za teže treninge u idućem tjednu, moramo testirati tvoj <strong>novi maksimum</strong>. 
            <br/><br/>
            <strong>Pravila:</strong> Zagrij se dobro, odmori 5 minuta, i onda odradi jednu seriju do potpunog otkaza.
          </p>
          
          <div className="flex flex-col gap-3">
              <button
                onClick={onNavigateToMaxTest}
                className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black py-5 rounded-xl uppercase tracking-widest text-lg shadow-xl transform transition-transform hover:scale-[1.02]"
              >
                UNESI NOVI MAX REKORD <i className="fas fa-arrow-right ml-2"></i>
              </button>
              <button
                onClick={onComplete}
                className="text-gray-500 dark:text-military-400 text-xs font-bold uppercase hover:underline"
              >
                Već sam odradio test, samo završi dan
              </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-military-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-military-600 mb-6">
      <div className="bg-military-700 p-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white uppercase tracking-wide">{currentPhase?.name}</h2>
          <p className="text-military-200 text-sm">Fokus: {currentPhase?.focus}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-400">Tjedan {user.currentWeek}</div>
          <div className="text-sm text-military-300">Dan {user.currentDay}</div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-bold dark:text-gray-100 mb-2">{workout.title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6 italic">{workout.description}</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {workout.sets.map((reps, idx) => (
            <button
              key={idx}
              onClick={() => toggleSet(idx)}
              className={`p-4 rounded-lg flex flex-col items-center justify-center transition-all border-2 ${
                completedSets[idx]
                  ? 'bg-green-600 border-green-500 text-white'
                  : 'bg-gray-100 dark:bg-military-900 border-gray-300 dark:border-military-600 text-gray-800 dark:text-gray-200 hover:border-green-500'
              }`}
            >
              <span className="text-sm uppercase text-opacity-80 mb-1">Set {idx + 1}</span>
              <span className="text-3xl font-bold">{reps}</span>
              <span className="text-xs mt-1">{completedSets[idx] ? 'GOTOVO' : 'PON'}</span>
            </button>
          ))}
        </div>

        {workout.sets.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <i className="fas fa-bed text-4xl mb-4"></i>
            <p>Danas nema treninga. Odmorite se.</p>
          </div>
        )}

        <button
          onClick={onComplete}
          disabled={!allSetsDone && workout.sets.length > 0}
          className={`w-full py-4 rounded-lg font-bold uppercase tracking-wider text-lg transition-all ${
            allSetsDone || workout.sets.length === 0
              ? 'bg-green-600 hover:bg-green-500 text-white shadow-lg transform hover:scale-[1.02]'
              : 'bg-gray-300 dark:bg-military-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          }`}
        >
          {workout.sets.length === 0 ? 'Završi Odmor' : 'Završi Trening'}
        </button>
      </div>
    </div>
  );
};

export default WorkoutCard;