
import React from 'react';
import { Project } from '../types';

interface ProjectListProps {
  projects: Project[];
  onSelect: (project: Project) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, onSelect }) => {
  const isCleaningProject = (name: string) => 
    name.toUpperCase().includes('LIMPIEZA') || name.toUpperCase().includes('MANTENIMIENTO TALLER');

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-blue-600 uppercase tracking-tighter italic leading-none">Unidad de Trabajo</h2>
        <p className="text-red-600 font-bold mt-2 uppercase text-[10px] tracking-widest">Elige el camión o la tarea de mantenimiento</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-10">
        {projects.length > 0 ? (
          projects.map((project) => {
            const isCleaning = isCleaningProject(project.name);
            
            return (
              <button
                key={project.id}
                onClick={() => onSelect(project)}
                className={`h-24 rounded-3xl shadow-sm hover:shadow-xl transition-all active:scale-[0.97] flex flex-col justify-center px-8 border-2 group text-left relative overflow-hidden
                  ${isCleaning 
                    ? 'bg-blue-600 border-blue-700 text-white shadow-blue-100' 
                    : 'bg-white border-slate-100 border-b-8 border-b-red-600 text-blue-600'
                  }`}
              >
                {!isCleaning && <div className="absolute right-0 top-0 h-full w-1.5 bg-red-600 group-hover:w-3 transition-all"></div>}
                
                <span className={`text-[9px] font-black tracking-[0.2em] uppercase mb-1 italic ${isCleaning ? 'text-white/60' : 'text-red-500/60'}`}>
                  {isCleaning ? 'TAREA GENERAL' : 'HMF MOUNTING PROG.'}
                </span>
                
                <span className={`text-lg font-black leading-tight uppercase truncate transition-colors ${!isCleaning && 'group-hover:text-red-600'}`}>
                  {project.name}
                </span>

                {isCleaning && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 group-hover:opacity-40 transition-opacity">
                    <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })
        ) : (
          <div className="col-span-full py-20 bg-slate-50 rounded-3xl border-4 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300">
            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-xl font-black italic uppercase tracking-tighter">No hay unidades activas</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectList;
