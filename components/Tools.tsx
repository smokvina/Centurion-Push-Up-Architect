import React, { useState, useEffect, useRef } from 'react';

interface ToolsProps {
  restTime: number;
}

const Tools: React.FC<ToolsProps> = ({ restTime }) => {
  // Timer State
  const [timeLeft, setTimeLeft] = useState(restTime);
  const [timerActive, setTimerActive] = useState(false);
  
  // Metronome State
  const [metronomeActive, setMetronomeActive] = useState(false);
  const [tempoPhase, setTempoPhase] = useState<'DOWN' | 'UP' | 'HOLD'>('DOWN');
  const [bpm, setBpm] = useState(20); // Slow controlled reps
  const audioContext = useRef<AudioContext | null>(null);

  // Timer Logic
  useEffect(() => {
    let interval: any;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
      // Play beep
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      osc.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const resetTimer = () => {
    setTimerActive(false);
    setTimeLeft(restTime);
  };

  // Metronome Logic (Visual + Audio)
  useEffect(() => {
    let interval: any;
    if (metronomeActive) {
      // 2-0-1 Tempo: 2s down, 0s hold, 1s up. Total 3s per rep.
      // We can simplify to visual cues.
      const cycleTime = 3000; // 3 seconds
      
      const runCycle = () => {
        setTempoPhase('DOWN');
        setTimeout(() => setTempoPhase('UP'), 2000); // Switch to UP after 2s
      };

      runCycle();
      interval = setInterval(runCycle, cycleTime);
    }
    return () => clearInterval(interval);
  }, [metronomeActive]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Rest Timer */}
      <div className="bg-white dark:bg-military-800 p-6 rounded-xl shadow border border-gray-200 dark:border-military-600">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <i className="fas fa-stopwatch text-green-500 mr-2"></i> Tajmer Odmora
        </h3>
        <div className="text-6xl font-mono text-center mb-6 text-gray-800 dark:text-gray-100">
          {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setTimerActive(!timerActive)}
            className={`flex-1 py-2 rounded font-bold ${timerActive ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}
          >
            {timerActive ? 'PAUZA' : 'START'}
          </button>
          <button onClick={resetTimer} className="px-4 py-2 bg-gray-600 text-white rounded">
            <i className="fas fa-redo"></i>
          </button>
        </div>
      </div>

      {/* Tempo Guide */}
      <div className="bg-white dark:bg-military-800 p-6 rounded-xl shadow border border-gray-200 dark:border-military-600">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <i className="fas fa-tachometer-alt text-blue-500 mr-2"></i> Tempo Vodič (2-0-1)
        </h3>
        
        <div className={`h-24 flex items-center justify-center rounded-lg mb-6 transition-colors duration-500 ${
            !metronomeActive ? 'bg-gray-100 dark:bg-military-900' : 
            tempoPhase === 'DOWN' ? 'bg-orange-500' : 'bg-green-500'
        }`}>
            <span className="text-3xl font-bold text-white uppercase">
                {!metronomeActive ? 'SPREMAN' : tempoPhase === 'DOWN' ? 'DOLJE (2s)' : 'GORE (1s)'}
            </span>
        </div>

        <button
            onClick={() => setMetronomeActive(!metronomeActive)}
            className={`w-full py-2 rounded font-bold ${metronomeActive ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'}`}
          >
            {metronomeActive ? 'STOP' : 'START TEMPO'}
          </button>
      </div>
    </div>
  );
};

export default Tools;
