import React, { useEffect, useRef } from 'react';
import { LogMessage } from '../types';

interface ConsoleLogProps {
  logs: LogMessage[];
}

const ConsoleLog: React.FC<ConsoleLogProps> = ({ logs }) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="mt-8 bg-black text-green-400 p-4 rounded-lg font-mono text-xs h-40 overflow-y-auto border border-military-600 shadow-inner">
      <div className="sticky top-0 bg-black border-b border-military-800 pb-1 mb-2 font-bold flex justify-between">
         <span>SYSTEM LOG</span>
         <span>STATUS: ACTIVE</span>
      </div>
      {logs.length === 0 && <span className="opacity-50">Waiting for logs...</span>}
      {logs.map((log, idx) => (
        <div key={idx} className={`mb-1 ${log.type === 'error' ? 'text-red-500' : 'text-green-400'}`}>
          <span className="opacity-50">[{log.timestamp.split('T')[1].split('.')[0]}]</span>{' '}
          <span className="uppercase">[{log.type}]</span>{' '}
          {log.message}
        </div>
      ))}
      <div ref={endRef} />
    </div>
  );
};

export default ConsoleLog;
