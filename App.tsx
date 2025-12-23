import React, { useState, useEffect } from 'react';
import Onboarding from './components/Onboarding';
import WorkoutCard from './components/WorkoutCard';
import Tools from './components/Tools';
import InfoSection from './components/InfoSection';
import AiCoach from './components/AiCoach';
import ConsoleLog from './components/ConsoleLog';
import DashboardWidget from './components/DashboardWidget';
import CalendarView from './components/CalendarView';
import ProgressCharts from './components/ProgressCharts';
import ProgramMap from './components/ProgramMap';
import { UserProgress, LogMessage, Theme, WorkoutLog } from './types';
import { PHASES, determineStartWeek } from './services/program';

const App: React.FC = () => {
  // --- State ---
  const [user, setUser] = useState<UserProgress | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'workout' | 'plan' | 'tools' | 'knowledge' | 'ai' | 'settings'>('dashboard');
  const [theme, setTheme] = useState<Theme>('dark');
  const [logs, setLogs] = useState<LogMessage[]>([]);
  
  // New State for Recording Max
  const [isRecordingMax, setIsRecordingMax] = useState(false);
  const [newMaxVal, setNewMaxVal] = useState('');
  const [shouldRecalculate, setShouldRecalculate] = useState(false);

  // --- Console Mirror Setup ---
  useEffect(() => {
    const originalLog = console.log;
    const originalError = console.error;

    console.log = (...args) => {
      const msg = args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ');
      setLogs(prev => [...prev.slice(-49), { type: 'log', message: msg, timestamp: new Date().toISOString() }]);
      originalLog.apply(console, args);
    };

    console.error = (...args) => {
      const msg = args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ');
      setLogs(prev => [...prev.slice(-49), { type: 'error', message: msg, timestamp: new Date().toISOString() }]);
      originalError.apply(console, args);
    };

    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      setTheme('light');
    }

    const savedUser = localStorage.getItem('centurionUser');
    if (savedUser) {
      let userData = JSON.parse(savedUser) as UserProgress;
      const today = new Date().toDateString();
      if (userData.lastProgressUpdate !== today) {
        userData.dailyProgress = 0;
        userData.lastProgressUpdate = today;
      }
      if (!userData.maxRepsHistory) userData.maxRepsHistory = [{ date: userData.startDate || new Date().toISOString(), reps: userData.maxReps }];
      if (userData.dailyGoal === undefined) userData.dailyGoal = 50;
      if (userData.dailyProgress === undefined) userData.dailyProgress = 0;
      if (!userData.reminders) userData.reminders = { enabled: false, time: '09:00', days: [1, 3, 5] };

      setUser(userData);
      console.log('User loaded and synced');
    } else {
      console.log('No user found, starting onboarding');
    }
  }, []);

  const saveUser = (data: UserProgress) => {
    setUser(data);
    localStorage.setItem('centurionUser', JSON.stringify(data));
  };

  const handleOnboardingComplete = (progress: UserProgress) => {
    const enriched = {
        ...progress,
        maxRepsHistory: [{ date: new Date().toISOString(), reps: progress.maxReps }],
        dailyGoal: 50,
        dailyProgress: 0,
        lastProgressUpdate: new Date().toDateString(),
        reminders: { enabled: false, time: '09:00', days: [1, 3, 5] }
    };
    saveUser(enriched);
    console.log('Onboarding complete');
  };

  const handleWorkoutComplete = () => {
    if (!user) return;
    let nextDay = user.currentDay + 1;
    let nextWeek = user.currentWeek;
    let nextPhase = user.currentPhase;
    if (nextDay > 3) {
      nextDay = 1;
      nextWeek += 1;
      const currentPhaseConfig = PHASES.find(p => p.id === user.currentPhase);
      if (currentPhaseConfig) {
          const maxWeekInPhase = Math.max(...currentPhaseConfig.weeks);
          if (nextWeek > maxWeekInPhase) {
              nextPhase += 1;
          }
      }
    }
    const newLog: WorkoutLog = { 
        date: new Date().toISOString(), 
        phase: user.currentPhase, 
        week: user.currentWeek, 
        reps: [], 
        completed: true,
        totalReps: 0 
    };
    const updatedUser: UserProgress = {
      ...user,
      currentDay: nextDay,
      currentWeek: nextWeek,
      currentPhase: nextPhase,
      history: [...user.history, newLog],
      dailyProgress: user.dailyProgress + 20 
    };
    saveUser(updatedUser);
    console.log('Workout completed and saved');
  };

  const confirmNewMax = () => {
    const reps = parseInt(newMaxVal);
    if (isNaN(reps) || !user) {
        alert('Unesite ispravan broj ponavljanja.');
        return;
    }

    let updated = {
        ...user,
        maxReps: reps,
        maxRepsHistory: [...user.maxRepsHistory, { date: new Date().toISOString(), reps }]
    };

    if (shouldRecalculate) {
        const { phase, week } = determineStartWeek(reps);
        updated.currentPhase = phase;
        updated.currentWeek = week;
        updated.currentDay = 1; // Restart the week on new assessment
        console.log(`Plan adapted: Phase ${phase}, Week ${week}`);
    }

    saveUser(updated);
    setIsRecordingMax(false);
    setNewMaxVal('');
    console.log('New Max recorded:', reps);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', newTheme);
  };

  if (!user) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="flex flex-col min-h-screen max-w-4xl mx-auto w-full px-4 py-6">
      <header className="flex justify-between items-center mb-8 bg-white dark:bg-military-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-military-800">
        <div>
          <h1 className="text-2xl font-bold dark:text-white uppercase tracking-widest flex items-center">
            <span className="text-green-600 mr-2"><i className="fas fa-shield-alt"></i></span>
            Centurion <span className="text-green-600 ml-1">Architect</span>
          </h1>
          <p className="text-[10px] text-military-400 font-bold tracking-widest uppercase">Elite Training Systems</p>
        </div>
        <div className="flex items-center space-x-3">
            <button onClick={toggleTheme} className="w-10 h-10 flex items-center justify-center bg-gray-50 dark:bg-military-800 rounded-xl text-gray-800 dark:text-yellow-400 transition-colors border border-gray-100 dark:border-military-700">
               {theme === 'dark' ? <i className="fas fa-sun"></i> : <i className="fas fa-moon"></i>}
            </button>
        </div>
      </header>

      <nav className="flex space-x-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
        {[
          { id: 'dashboard', label: 'Početna', icon: 'fa-th-large' },
          { id: 'workout', label: 'Trening', icon: 'fa-dumbbell' },
          { id: 'plan', label: 'Plan', icon: 'fa-map-marked-alt' },
          { id: 'tools', label: 'Alati', icon: 'fa-stopwatch' },
          { id: 'knowledge', label: 'Znanje', icon: 'fa-book' },
          { id: 'ai', label: 'AI Trener', icon: 'fa-robot' },
          { id: 'settings', label: 'Postavke', icon: 'fa-cog' },
        ].map(item => (
            <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`whitespace-nowrap px-5 py-3 rounded-xl font-bold transition-all flex items-center ${
                    activeTab === item.id 
                    ? 'bg-green-600 text-white shadow-lg scale-105' 
                    : 'bg-white dark:bg-military-800 text-gray-500 dark:text-gray-300 border border-gray-100 dark:border-military-700'
                }`}
            >
                <i className={`fas ${item.icon} mr-2`}></i> {item.label}
            </button>
        ))}
      </nav>

      <main className="flex-grow animate-fade-in space-y-6">
        {activeTab === 'dashboard' && (
            <>
                <DashboardWidget user={user} onNavigate={setActiveTab} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CalendarView user={user} />
                    <div className="space-y-6">
                        <ProgressCharts data={user.maxRepsHistory} />
                        
                        {!isRecordingMax ? (
                            <button 
                                onClick={() => setIsRecordingMax(true)}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center uppercase tracking-wider"
                            >
                                <i className="fas fa-plus-circle mr-2"></i> Testiraj Novi Max
                            </button>
                        ) : (
                            <div id="max-test-section" className="bg-white dark:bg-military-800 p-6 rounded-xl border-2 border-blue-500 shadow-xl animate-scale-in">
                                <h4 className="text-sm font-black dark:text-white uppercase mb-4 flex items-center">
                                    <i className="fas fa-edit text-blue-500 mr-2"></i> Unos Rezultata
                                </h4>
                                <input 
                                    type="number"
                                    value={newMaxVal}
                                    onChange={(e) => setNewMaxVal(e.target.value)}
                                    placeholder="Broj sklekova..."
                                    autoFocus
                                    className="w-full bg-gray-50 dark:bg-military-900 border border-gray-200 dark:border-military-600 rounded-lg p-3 text-2xl font-black text-center dark:text-white mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                                <label className="flex items-center space-x-3 mb-6 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${shouldRecalculate ? 'bg-blue-500 border-blue-500' : 'border-gray-400 group-hover:border-blue-400'}`} onClick={() => setShouldRecalculate(!shouldRecalculate)}>
                                        {shouldRecalculate && <i className="fas fa-check text-[10px] text-white"></i>}
                                    </div>
                                    <span className="text-xs font-bold text-military-400 uppercase">Ažuriraj moj plan (tjedan/fazu)?</span>
                                </label>
                                <div className="flex space-x-2">
                                    <button onClick={confirmNewMax} className="flex-1 bg-green-600 text-white font-bold py-3 rounded-lg uppercase text-xs">Spremi</button>
                                    <button onClick={() => { setIsRecordingMax(false); setNewMaxVal(''); }} className="flex-1 bg-gray-500 text-white font-bold py-3 rounded-lg uppercase text-xs">Odustani</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </>
        )}
        
        {activeTab === 'workout' && (
            <WorkoutCard 
              user={user} 
              onComplete={handleWorkoutComplete} 
              onNavigateToMaxTest={() => {
                setActiveTab('dashboard');
                setIsRecordingMax(true);
                // Scroll to top or section if needed
                setTimeout(() => {
                  document.getElementById('max-test-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
            />
        )}

        {activeTab === 'plan' && (
            <ProgramMap user={user} />
        )}
        
        {activeTab === 'tools' && (
            <Tools restTime={PHASES.find(p => p.id === user.currentPhase)?.restTimeSeconds || 90} />
        )}
        
        {activeTab === 'knowledge' && (
            <InfoSection />
        )}
        
        {activeTab === 'ai' && (
            <AiCoach user={user} />
        )}
        
        {activeTab === 'settings' && (
            <div className="bg-white dark:bg-military-800 p-8 rounded-2xl shadow border border-gray-100 dark:border-military-700 space-y-8">
                <div>
                    <h3 className="text-xl font-bold dark:text-white mb-6 uppercase tracking-wider border-b border-gray-100 dark:border-military-700 pb-2">Konfiguracija Treninga</h3>
                    
                    <div className="space-y-6">
                        <div className="flex flex-col">
                            <label className="text-sm font-bold text-military-400 mb-2">Dnevni Cilj Ponavljanja</label>
                            <input 
                                type="number" 
                                value={user.dailyGoal}
                                onChange={(e) => saveUser({...user, dailyGoal: parseInt(e.target.value) || 0})}
                                className="bg-gray-50 dark:bg-military-900 border border-gray-200 dark:border-military-600 rounded-xl p-3 focus:ring-2 focus:ring-green-500 outline-none text-xl font-bold dark:text-white"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-sm font-bold text-military-400 mb-2">Podsjetnici</label>
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-military-900 rounded-xl border border-gray-200 dark:border-military-600">
                                <div className="flex items-center">
                                    <i className="fas fa-bell mr-3 text-yellow-500"></i>
                                    <span className="font-bold dark:text-white">Omogući obavijesti</span>
                                </div>
                                <button 
                                    onClick={() => saveUser({...user, reminders: {...user.reminders, enabled: !user.reminders.enabled}})}
                                    className={`w-12 h-6 rounded-full relative transition-colors ${user.reminders.enabled ? 'bg-green-600' : 'bg-gray-400'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${user.reminders.enabled ? 'left-7' : 'left-1'}`}></div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-xl font-bold dark:text-white mb-6 uppercase tracking-wider border-b border-gray-100 dark:border-military-700 pb-2">Privatnost i Sigurnost</h3>
                    <div className="p-4 bg-gray-50 dark:bg-military-900 rounded-xl border border-gray-200 dark:border-military-600 flex items-center justify-between">
                         <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-4">
                                <i className="fas fa-microphone-slash text-green-600 dark:text-green-400"></i>
                            </div>
                            <div>
                                <h4 className="font-bold dark:text-white text-sm">Mikrofon Isključen</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Aplikacija ne koristi audio ulaz.</p>
                            </div>
                         </div>
                         <i className="fas fa-check-circle text-green-500"></i>
                    </div>
                </div>

                <div>
                    <h3 className="text-xl font-bold dark:text-white mb-6 uppercase tracking-wider border-b border-gray-100 dark:border-military-700 pb-2">Upravljanje Podacima</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button onClick={() => {
                            const blob = new Blob([JSON.stringify(user, null, 2)], {type: 'application/json'});
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = 'centurion_data.json';
                            a.click();
                        }} className="p-4 bg-military-900 text-white rounded-xl flex items-center justify-center hover:bg-black transition-colors">
                            <i className="fas fa-file-export mr-2"></i> Export Data
                        </button>
                        <button 
                            onClick={() => { if(window.confirm('Resetirati sve?')) { localStorage.removeItem('centurionUser'); window.location.reload(); }}} 
                            className="p-4 border-2 border-red-500 text-red-500 font-bold rounded-xl flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900 transition-colors"
                        >
                            <i className="fas fa-trash-alt mr-2"></i> Resetiraj Profil
                        </button>
                    </div>
                </div>
            </div>
        )}
      </main>

      <ConsoleLog logs={logs} />

      <footer className="mt-8 text-center text-military-400 text-xs py-8 border-t border-gray-100 dark:border-military-800 space-y-2">
        <div className="font-bold uppercase tracking-widest">Centurion Push-Up Architect v2.0</div>
        <div>CreatedBy Denis Orlić • Military Grade Support</div>
        <a href="https://wa.me/38598667806" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-[10px] font-black uppercase tracking-tighter hover:scale-105 transition-transform">
          <i className="fab fa-whatsapp mr-1 text-sm"></i> Direktna Linija: +38598667806
        </a>
      </footer>
    </div>
  );
};

export default App;