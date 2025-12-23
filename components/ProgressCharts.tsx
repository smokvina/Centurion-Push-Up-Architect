import React from 'react';

interface ProgressChartsProps {
  data: { date: string; reps: number }[];
}

const ProgressCharts: React.FC<ProgressChartsProps> = ({ data }) => {
  if (data.length < 2) {
    return (
      <div className="bg-white dark:bg-military-800 p-8 rounded-xl shadow border border-gray-200 dark:border-military-600 text-center">
        <i className="fas fa-chart-line text-4xl text-military-400 mb-4"></i>
        <h4 className="text-lg font-bold dark:text-white uppercase mb-2">Statistika Napretka</h4>
        <p className="text-military-400 text-sm">Potrebno je barem dva testiranja za prikaz grafikona. Odradi test "Novi Max" kako bi započeo praćenje.</p>
      </div>
    );
  }

  // Calculate stats
  const maxVal = Math.max(...data.map(d => d.reps), 10);
  const minVal = Math.min(...data.map(d => d.reps), 0);
  const range = maxVal - minVal;
  const startReps = data[0].reps;
  const currentReps = data[data.length - 1].reps;
  const growth = currentReps - startReps;
  const growthPercent = Math.round((growth / (startReps || 1)) * 100);
  
  // Chart dimensions
  const width = 400;
  const height = 200;
  const padding = 30;

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (width - 2 * padding);
    const y = (height - padding) - ((d.reps - minVal) / (range || 1)) * (height - 2 * padding);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="space-y-4">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-military-900 p-3 rounded-xl border border-military-700 text-center">
          <div className="text-[10px] text-military-400 uppercase font-bold">Početno</div>
          <div className="text-xl font-black text-white">{startReps}</div>
        </div>
        <div className="bg-military-900 p-3 rounded-xl border border-military-700 text-center">
          <div className="text-[10px] text-military-400 uppercase font-bold">Trenutno</div>
          <div className="text-xl font-black text-green-500">{currentReps}</div>
        </div>
        <div className="bg-military-900 p-3 rounded-xl border border-military-700 text-center">
          <div className="text-[10px] text-military-400 uppercase font-bold">Napredak</div>
          <div className="text-xl font-black text-blue-400">+{growth}</div>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="bg-white dark:bg-military-800 p-6 rounded-xl shadow border border-gray-200 dark:border-military-600">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-black dark:text-white uppercase tracking-widest">
            <i className="fas fa-chart-area text-blue-500 mr-2"></i> Krivulja Snage (Max Reps)
          </h3>
          <span className={`text-xs font-bold px-2 py-0.5 rounded ${growth >= 0 ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'}`}>
            {growth >= 0 ? '▲' : '▼'} {Math.abs(growthPercent)}%
          </span>
        </div>

        <div className="relative w-full overflow-hidden h-48">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full preserve-3d" preserveAspectRatio="none">
            {/* Grid Lines (Horizontal) */}
            {[0, 0.25, 0.5, 0.75, 1].map(v => (
               <line 
                key={v}
                x1={padding} 
                y1={padding + (height - 2 * padding) * v} 
                x2={width - padding} 
                y2={padding + (height - 2 * padding) * v} 
                stroke="currentColor" 
                className="text-gray-100 dark:text-military-900" 
                strokeWidth="1" 
               />
            ))}
            
            {/* Gradient Fill */}
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 0.3 }} />
                <stop offset="100%" style={{ stopColor: '#10b981', stopOpacity: 0 }} />
              </linearGradient>
            </defs>
            <path
              d={`M ${padding},${height - padding} L ${points} L ${width - padding},${height - padding} Z`}
              fill="url(#grad)"
            />

            {/* Path Line */}
            <polyline
              fill="none"
              stroke="#10b981"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
              className="drop-shadow-md"
            />
            
            {/* Points and Labels */}
            {data.map((d, i) => {
               const x = padding + (i / (data.length - 1)) * (width - 2 * padding);
               const y = (height - padding) - ((d.reps - minVal) / (range || 1)) * (height - 2 * padding);
               return (
                 <g key={i}>
                   <circle cx={x} cy={y} r="5" className="fill-green-500 stroke-white dark:stroke-military-800" strokeWidth="2" />
                   {/* Date Labels for first and last */}
                   {(i === 0 || i === data.length - 1) && (
                     <text x={x} y={height - 5} fontSize="8" textAnchor="middle" className="fill-military-400 font-bold uppercase">
                       {new Date(d.date).toLocaleDateString('hr-HR', { day: '2-digit', month: '2-digit' })}
                     </text>
                   )}
                 </g>
               );
            })}
          </svg>
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900/40">
           <div className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase mb-1">Coach Insight</div>
           <p className="text-xs text-gray-600 dark:text-gray-400 leading-tight">
             Tvoja snaga raste stabilno. Nastavi s ovim tempom i dosegnut ćeš 100 ponavljanja do kraja 20. tjedna.
           </p>
        </div>
      </div>
    </div>
  );
};

export default ProgressCharts;