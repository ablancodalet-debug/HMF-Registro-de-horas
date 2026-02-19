
import React from 'react';
import { Worker, Project } from '../types';

interface HoursFormProps {
  worker: Worker;
  project: Project;
  onRegister: (hours: number) => void;
  alreadyDone: number;
}

const HoursForm: React.FC<HoursFormProps> = ({ worker, project, onRegister, alreadyDone }) => {
  const remaining = Math.max(0, 8 - alreadyDone);
  const hourOptions = [0.5, 1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 h-full flex flex-col items-center justify-center pb-20">
      <div className="w-full text-center mb-6">
        <h2 className="text-4xl font-black text-blue-600 uppercase tracking-tighter italic">Registro de Horas</h2>
        <div className="mt-2 inline-flex items-center gap-2 bg-red-100 px-4 py-1.5 rounded-full">
           <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">HMF Unidad:</span>
           <span className="text-sm font-black text-red-700 uppercase tracking-tight">{project.name}</span>
        </div>
      </div>
      
      <div className="bg-white p-8 rounded-[3.5rem] border-4 border-slate-100 shadow-2xl w-full max-w-xl flex flex-col gap-8">
        <div className="bg-blue-600 p-8 rounded-[2.5rem] border-b-8 border-red-600 shadow-inner flex flex-col items-center group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-white/10"></div>
          <p className="text-[9px] font-black text-white/60 uppercase tracking-[0.4em] mb-2">HORAS PENDIENTES</p>
          <div className="flex items-baseline gap-2">
            <span className={`text-9xl font-black tracking-tighter ${remaining > 0 ? 'text-white' : 'text-red-500'} transition-colors`}>
              {remaining}
            </span>
            <span className="text-2xl font-black text-white/40 italic">H</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {hourOptions.map((h) => {
            const isDisabled = h > remaining;
            return (
              <button
                key={h}
                type="button"
                disabled={isDisabled}
                onClick={() => onRegister(h)}
                className={`h-24 rounded-[2rem] shadow-sm transition-all flex flex-col items-center justify-center gap-1 group overflow-hidden relative border-2 
                  ${isDisabled 
                    ? 'bg-slate-50 border-slate-50 text-slate-200 opacity-50 cursor-not-allowed' 
                    : 'bg-white border-slate-100 hover:border-red-600 hover:bg-red-600 hover:text-white active:scale-90 text-blue-600'
                  }`}
              >
                <span className="text-4xl font-black tracking-tighter">{h}</span>
                <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Horas</span>
                {!isDisabled && <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-50 group-hover:bg-red-400"></div>}
              </button>
            );
          })}
        </div>

        {remaining === 0 && (
          <div className="p-5 bg-red-50 rounded-3xl border-2 border-red-200 flex items-center gap-4">
            <div className="w-10 h-10 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-black text-red-800 uppercase leading-none italic">Jornada Completada</span>
              <span className="text-[9px] font-bold text-red-600 uppercase tracking-widest mt-1">Límite de 8h alcanzado</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HoursForm;
