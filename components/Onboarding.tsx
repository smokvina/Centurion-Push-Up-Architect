
import React, { useState } from 'react';
import { determineStartWeek, PHASES } from '../services/program';
import { UserProgress } from '../types';

interface OnboardingProps {
  onComplete: (progress: UserProgress) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [reps, setReps] = useState<string>('');

  const handleStart = () => {
    const r = parseInt(reps);
    if (isNaN(r) || r < 0) {
      alert('Molimo unesite valjani broj sklekova.');
      return;
    }

    const { phase, week } = determineStartWeek(r);

    // Fixed: Added missing properties to satisfy UserProgress type
    const initialProgress: UserProgress = {
      maxReps: r,
      currentPhase: phase,
      currentWeek: week,
      currentDay: 1,
      history: [],
      maxRepsHistory: [{ date: new Date().toISOString(), reps: r }],
      dailyGoal: 50,
      dailyProgress: 0,
      lastProgressUpdate: new Date().toDateString(),
      reminders: {
        enabled: false,
        time: '09:00',
        days: [1, 3, 5],
      },
      onboardingComplete: true,
      startDate: new Date().toISOString(),
    };

    onComplete(initialProgress);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center animate-fade-in">
      <div className="bg-military-800 p-8 rounded-2xl shadow-2xl border border-military-600 max-w-md w-full">
        <h1 className="text-3xl font-bold text-military-100 mb-2 uppercase tracking-wider">
          <i className="fas fa-dumbbell mr-2 text-military-400"></i>
          Inicijalna Procjena
        </h1>
        <p className="text-military-200 mb-8">
          Koliko sklekova možete napraviti u jednoj seriji s pravilnom formom (prsa do poda)?
        </p>

        <div className="mb-8">
          <input
            type="number"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            className="w-full text-center text-5xl bg-military-900 border-b-2 border-military-500 text-white focus:outline-none focus:border-green-500 transition-colors p-4 rounded-t-lg"
            placeholder="0"
          />
        </div>

        <button
          onClick={handleStart}
          className="w-full bg-green-700 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg uppercase tracking-widest transition-all transform hover:scale-105 shadow-lg flex items-center justify-center"
        >
          Započni Program <i className="fas fa-chevron-right ml-2"></i>
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
