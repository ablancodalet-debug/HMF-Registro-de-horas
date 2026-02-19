
import React, { useState, useEffect } from 'react';
import { Worker } from '../types';

interface WorkerListProps {
  workers: Worker[];
  onSelect: (worker: Worker) => void;
}

const WorkerList: React.FC<WorkerListProps> = ({ workers, onSelect }) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(date);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-blue-600 p-8 rounded-[2.5rem] border-b-8 border-red-600 shadow-xl">
        <div className="flex flex-col">
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic leading-none mb-2">Identificación</h2>
          <p className="text-white/80 font-black uppercase text-xs tracking-[0.3em]">Selecciona tu nombre para registrar tiempo</p>
        </div>
        
        <div className="flex flex-col md:items-end text-right">
          <div className="text-5xl font-black text-white tracking-tighter tabular-nums leading-none mb-1">
            {formatTime(now)}
          </div>
          <div className="text-white/60 font-black uppercase text-[10px] tracking-widest italic">
            {formatDate(now)}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-10">
        {workers.map((worker) => (
          <button
            key={worker.id}
            onClick={() => onSelect(worker)}
            className="h-32 bg-white border-2 border-slate-100 rounded-[2rem] shadow-sm hover:shadow-2xl hover:border-red-600 hover:bg-red-50 transition-all active:scale-90 flex flex-col items-center justify-center gap-3 group p-4 overflow-hidden relative"
          >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100 group-hover:bg-red-600 transition-colors"></div>
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-blue-600 group-hover:bg-red-100 group-hover:text-red-600 transition-colors shadow-sm border border-slate-100">
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-lg font-black text-blue-600 group-hover:text-red-600 truncate w-full text-center uppercase tracking-tighter leading-tight transition-colors">
              {worker.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default WorkerList;
