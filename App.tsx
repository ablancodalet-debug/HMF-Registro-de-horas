
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ViewState, Worker, Project, TimeLog } from './types';
import { getWorkers, getProjects, saveLog, getLogs } from './services/storageService';
import WorkerList from './components/WorkerList';
import ProjectList from './components/ProjectList';
import HoursForm from './components/HoursForm';
import AdminDashboard from './components/AdminDashboard';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('SELECT_WORKER');
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [allLogs, setAllLogs] = useState<TimeLog[]>([]);

  const loadInitialData = useCallback(() => {
    const storedWorkers = getWorkers();
    const storedProjects = getProjects();
    const storedLogs = getLogs();

    setWorkers(storedWorkers);
    setProjects(storedProjects.filter(p => p.active));
    setAllLogs(storedLogs);
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const hoursToday = useMemo(() => {
    if (!selectedWorker) return 0;
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    
    return allLogs
      .filter(log => {
        const logDate = new Date(log.timestamp);
        const logDateStr = `${logDate.getFullYear()}-${String(logDate.getMonth() + 1).padStart(2, '0')}-${String(logDate.getDate()).padStart(2, '0')}`;
        return log.workerId === selectedWorker.id && logDateStr === todayStr;
      })
      .reduce((sum, log) => sum + log.hours, 0);
  }, [selectedWorker, allLogs]);

  const handleWorkerSelect = (worker: Worker) => {
    setSelectedWorker(worker);
    setView('SELECT_PROJECT');
  };

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    setView('INPUT_HOURS');
  };

  const handleRegisterHours = (hours: number) => {
    if (!selectedWorker || !selectedProject) return;

    const newLog: TimeLog = {
      id: crypto.randomUUID(),
      workerId: selectedWorker.id,
      workerName: selectedWorker.name,
      projectId: selectedProject.id,
      projectName: selectedProject.name,
      hours: hours,
      timestamp: new Date().toISOString(),
    };

    saveLog(newLog);
    const updatedLogs = [...allLogs, newLog];
    setAllLogs(updatedLogs);
    
    const newTotal = hoursToday + hours;
    
    if (newTotal >= 8) {
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
        setSelectedWorker(null);
        setSelectedProject(null);
        setView('SELECT_WORKER');
      }, 1500); 
    } else {
      setSelectedProject(null);
      setView('SELECT_PROJECT');
    }
  };

  const handleBack = () => {
    if (view === 'SELECT_PROJECT') {
      setSelectedWorker(null);
      setView('SELECT_WORKER');
    }
    else if (view === 'INPUT_HOURS') {
      setView('SELECT_PROJECT');
    }
    else if (view === 'ADMIN') {
      loadInitialData();
      setView('SELECT_WORKER');
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-white">
      {/* Header HMF Style - Lighter Blue */}
      <header className="h-20 bg-blue-600 text-white px-8 flex justify-between items-center shrink-0 border-b-4 border-red-600 shadow-2xl z-20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-10 bg-red-600 rounded flex items-center justify-center font-black text-2xl italic tracking-tighter">HMF</div>
          <div>
            <h1 className="text-xl font-black tracking-tighter uppercase italic leading-none">TALLER GRÚAS</h1>
            <p className="text-white/80 text-[9px] uppercase font-black tracking-[0.3em] mt-1">Power to Lift</p>
          </div>
        </div>

        {view !== 'ADMIN' && (
          <button 
            onClick={() => {
              loadInitialData();
              setView('ADMIN');
            }}
            className="bg-red-600 hover:bg-red-700 p-3 rounded-xl transition-all active:scale-90 border border-red-500 shadow-lg"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </button>
        )}
      </header>

      {/* Sub-Header / Breadcrumb */}
      <div className="h-16 bg-slate-50 border-b border-slate-200 px-8 flex justify-between items-center shrink-0 z-10 shadow-sm">
        {view !== 'SELECT_WORKER' && view !== 'ADMIN' ? (
          <div className="flex items-center gap-4">
            <button onClick={handleBack} className="bg-white p-2 rounded-lg text-blue-600 border border-slate-200 active:scale-90 transition-transform">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div className="h-6 w-px bg-slate-200 mx-1"></div>
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Trabajador</span>
              <span className="text-sm font-black text-blue-600 leading-none">{selectedWorker?.name}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${view === 'ADMIN' ? 'bg-red-600' : 'bg-blue-600'}`}></div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">
              {view === 'ADMIN' ? 'Modo Administrador' : 'Gestión de Turnos'}
            </span>
          </div>
        )}

        {(selectedWorker && view !== 'ADMIN') && (
          <div className="flex items-center gap-3">
             <div className="flex flex-col items-end mr-2">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Jornada Hoy</span>
              <div className="text-xs font-black text-red-600 leading-none tracking-tighter">{hoursToday.toFixed(1)}h / 8h</div>
            </div>
            <div className="w-24 h-3 bg-slate-200 rounded-full overflow-hidden border border-slate-200">
              <div 
                className={`h-full transition-all duration-700 ease-out bg-red-600`} 
                style={{ width: `${Math.min(100, (hoursToday / 8) * 100)}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden bg-white relative">
        <div className="h-full w-full overflow-y-auto custom-scrollbar p-6 lg:p-10">
          <div className="max-w-6xl mx-auto h-full">
            {view === 'SELECT_WORKER' && (
              <WorkerList workers={workers} onSelect={handleWorkerSelect} />
            )}
            {view === 'SELECT_PROJECT' && (
              <ProjectList projects={projects} onSelect={handleProjectSelect} />
            )}
            {view === 'INPUT_HOURS' && selectedWorker && selectedProject && (
              <HoursForm 
                worker={selectedWorker} 
                project={selectedProject} 
                onRegister={handleRegisterHours} 
                alreadyDone={hoursToday}
              />
            )}
            {view === 'ADMIN' && (
              <AdminDashboard onBack={handleBack} />
            )}
          </div>
        </div>
      </main>

      {/* Alerta Roja HMF */}
      {showNotification && (
        <div className="fixed inset-0 bg-blue-600/60 backdrop-blur-xl z-[200] flex items-center justify-center p-6">
          <div className="bg-red-600 text-white p-12 rounded-[4rem] shadow-2xl flex flex-col items-center text-center gap-8 animate-in zoom-in-90 duration-300 border-4 border-white/30 max-w-sm w-full">
            <div className="w-28 h-28 rounded-full flex items-center justify-center bg-white/20 shadow-inner">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-4xl font-black italic tracking-tighter uppercase leading-none">
                ¡TIEMPO REGISTRADO!
              </span>
              <span className="text-sm font-bold uppercase tracking-widest opacity-90 leading-relaxed px-4">
                Has completado las 8 horas de tu jornada de hoy.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="h-8 bg-blue-600 px-8 flex justify-between items-center shrink-0 text-[8px] font-black text-white/70 tracking-widest uppercase">
        <span>HMF Industrial - Power to Lift</span>
        <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></div> Sincronizado</span>
        <span>{new Date().toLocaleDateString('es-ES')}</span>
      </footer>
    </div>
  );
};

export default App;
