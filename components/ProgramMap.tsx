import React from 'react';
import { PHASES } from '../services/program';
import { UserProgress } from '../types';

interface ProgramMapProps {
  user: UserProgress;
}

const ProgramMap: React.FC<ProgramMapProps> = ({ user }) => {
  const totalWeeks = 20;
  const weeks = Array.from({ length: totalWeeks }, (_, i) => i + 1);

  const getPhaseColor = (week: number) => {
    if (week <= 4) return 'bg-blue-500'; // Phase 1
    if (week <= 10) return 'bg-green-500'; // Phase 2
    if (week <= 16) return 'bg-orange-500'; // Phase 3
    return 'bg-red-500'; // Phase 4
  };

  const getPhaseName = (week: number) => {
    if (week === 1) return 'FAZA 1: OSNOVE';
    if (week === 5) return 'FAZA 2: VOLUMEN';
    if (week === 11) return 'FAZA 3: GUSTOĆA';
    if (week === 17) return 'FAZA 4: PEAKING';
    return null;
  };

  return (
    <div className="bg-white dark:bg-military-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-military-700">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold dark:text-white uppercase tracking-wider">
          <i className="fas fa-map-marked-alt text-military-400 mr-2"></i> Karta Centurion Programa
        </h3>
        <div className="text-xs font-bold text-military-400">20 TJEDANA • 4 FAZE</div>
      </div>

      <div className="space-y-8">
        {/* Phase Legend */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {PHASES.map((phase) => (
            <div key={phase.id} className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                phase.id === 1 ? 'bg-blue-500' :
                phase.id === 2 ? 'bg-green-500' :
                phase.id === 3 ? 'bg-orange-500' : 'bg-red-500'
              }`}></div>
              <span className="text-[10px] font-bold uppercase text-military-400">{phase.focus}</span>
            </div>
          ))}
        </div>

        {/* The Map */}
        <div className="relative">
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-3 relative z-10">
            {weeks.map((w) => {
              const isCurrent = w === user.currentWeek;
              const isPast = w < user.currentWeek;
              const phaseName = getPhaseName(w);

              return (
                <div key={w} className="flex flex-col items-center">
                  {phaseName && (
                    <div className="absolute -mt-6 text-[8px] font-black text-military-400 uppercase tracking-tighter w-max left-0 ml-2">
                       {phaseName}
                    </div>
                  )}
                  <div 
                    className={`w-full aspect-square rounded-xl flex flex-col items-center justify-center transition-all relative overflow-hidden ${
                      isCurrent 
                        ? 'ring-4 ring-yellow-400 scale-110 shadow-xl z-20' 
                        : isPast 
                          ? 'opacity-60 grayscale-[0.5]' 
                          : ''
                    } ${getPhaseColor(w)}`}
                  >
                    <span className="text-white font-black text-lg">{w}</span>
                    <span className="text-white text-[8px] font-bold opacity-80 uppercase">TJ</span>
                    
                    {isCurrent && (
                      <div className="absolute top-1 right-1">
                        <span className="flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                        </span>
                      </div>
                    )}

                    {isPast && (
                      <div className="absolute bottom-1 right-1 text-white text-[10px]">
                        <i className="fas fa-check-circle"></i>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Progress Connector Line (Background) */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 dark:bg-military-900 -translate-y-1/2 -z-0 rounded-full"></div>
        </div>

        <div className="p-4 bg-military-50 dark:bg-military-900 rounded-xl border border-dashed border-military-700">
           <p className="text-sm text-military-400 italic">
             <i className="fas fa-info-circle mr-2"></i>
             Trenutno se nalaziš u <strong>{PHASES.find(p => p.id === user.currentPhase)?.name}</strong>. 
             Svaka faza mijenja način na koji mišići rade kako bi se spriječila adaptacija.
           </p>
        </div>
      </div>
    </div>
  );
};

export default ProgramMap;