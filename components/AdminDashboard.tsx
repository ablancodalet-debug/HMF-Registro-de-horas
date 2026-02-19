
import React, { useState, useEffect } from 'react';
import { TimeLog, Worker, Project } from '../types';
import { getLogs, getWorkers, saveWorkers, getProjects, saveProjects } from '../services/storageService';
import * as XLSX from 'xlsx';

interface AdminDashboardProps {
  onBack: () => void;
}

type AdminTab = 'LOGS' | 'WORKERS' | 'PROJECTS';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('LOGS');
  
  const [logs, setLogs] = useState<TimeLog[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const [editingItem, setEditingItem] = useState<{id: string | null, name: string} | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  useEffect(() => {
    if (isAuthorized) {
      loadAllData();
    }
  }, [isAuthorized]);

  const loadAllData = () => {
    setLogs(getLogs().sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    setWorkers(getWorkers());
    setProjects(getProjects());
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthorized(true);
    } else {
      alert('Contraseña incorrecta');
    }
  };

  const handleEditConfirm = () => {
    if (!editingItem || !editingItem.name.trim()) return;

    if (activeTab === 'WORKERS') {
      let newWorkers;
      if (editingItem.id) {
        newWorkers = workers.map(w => w.id === editingItem.id ? { ...w, name: editingItem.name.trim() } : w);
      } else {
        newWorkers = [...workers, { id: crypto.randomUUID(), name: editingItem.name.trim() }];
      }
      setWorkers(newWorkers);
      saveWorkers(newWorkers);
    } else if (activeTab === 'PROJECTS') {
      let newProjects;
      if (editingItem.id) {
        newProjects = projects.map(p => p.id === editingItem.id ? { ...p, name: editingItem.name.trim() } : p);
      } else {
        newProjects = [...projects, { id: crypto.randomUUID(), name: editingItem.name.trim(), active: true }];
      }
      setProjects(newProjects);
      saveProjects(newProjects);
    }
    setEditingItem(null);
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 1500);
  };

  const handleDelete = (id: string) => {
    if (activeTab === 'WORKERS') {
      const newWorkers = workers.filter(w => w.id !== id);
      setWorkers(newWorkers);
      saveWorkers(newWorkers);
    } else if (activeTab === 'PROJECTS') {
      const newProjects = projects.filter(p => p.id !== id);
      setProjects(newProjects);
      saveProjects(newProjects);
    }
    setConfirmDeleteId(null);
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 1500);
  };

  const toggleProjectActive = (id: string) => {
    const newProjects = projects.map(p => p.id === id ? { ...p, active: !p.active } : p);
    setProjects(newProjects);
    saveProjects(newProjects);
  };

  const exportToExcel = () => {
    if (logs.length === 0) {
      alert("No hay registros para exportar");
      return;
    }

    const workbook = XLSX.utils.book_new();
    
    // 1. Agrupar registros por el nombre del proyecto
    const projectsMap: Record<string, TimeLog[]> = {};
    logs.forEach(log => {
      if (!projectsMap[log.projectName]) {
        projectsMap[log.projectName] = [];
      }
      projectsMap[log.projectName].push(log);
    });

    // 2. Crear estructura de filas para el Excel
    const excelData: any[][] = [
      ['HMF INDUSTRIAL - REPORTE DE HORAS POR PROYECTO'],
      ['Fecha de Reporte:', new Date().toLocaleString('es-ES')],
      [] // Espacio
    ];

    // Ordenar proyectos alfabéticamente
    const sortedProjectNames = Object.keys(projectsMap).sort();

    sortedProjectNames.forEach(projectName => {
      const projectLogs = projectsMap[projectName];
      
      // Título de la sección del proyecto
      excelData.push(['PROYECTO:', projectName.toUpperCase()]);
      // Cabecera de la tabla interna
      excelData.push(['OPERARIO', 'HORAS REGISTRADAS', 'FECHA DE TRABAJO', 'HORA REGISTRO']);
      
      let totalProjectHours = 0;
      
      // Ordenar registros de este proyecto por fecha
      const sortedLogs = [...projectLogs].sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

      sortedLogs.forEach(log => {
        const d = new Date(log.timestamp);
        excelData.push([
          log.workerName,
          log.hours,
          d.toLocaleDateString('es-ES'),
          d.toLocaleTimeString('es-ES')
        ]);
        totalProjectHours += log.hours;
      });

      // Sumatorio del proyecto
      excelData.push(['TOTAL PROYECTO:', totalProjectHours, '', '']);
      excelData.push([]); // Salto de línea entre bloques
      excelData.push([]); 
    });

    const ws = XLSX.utils.aoa_to_sheet(excelData);
    
    // Configuración de anchos de columna
    ws['!cols'] = [
      { wch: 40 }, // Operario / Etiquetas
      { wch: 20 }, // Horas
      { wch: 25 }, // Fecha
      { wch: 20 }, // Hora
    ];

    XLSX.utils.book_append_sheet(workbook, ws, "Reporte Detallado");
    XLSX.writeFile(workbook, `HMF_Reporte_Taller_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  if (!isAuthorized) {
    return (
      <div className="max-w-md mx-auto mt-10 p-10 bg-white rounded-[3rem] shadow-2xl border-4 border-red-600">
        <h2 className="text-2xl font-black mb-8 text-blue-600 flex items-center gap-3 italic">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold">!</div>
          ACCESO HMF CONTROL
        </h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="password"
            placeholder="Clave Maestro..."
            className="w-full p-5 text-xl bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-red-600 outline-none font-bold"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
          <div className="flex gap-3">
            <button type="button" onClick={onBack} className="flex-1 p-5 bg-slate-100 text-slate-500 font-black rounded-2xl uppercase tracking-tighter">Cerrar</button>
            <button type="submit" className="flex-1 p-5 bg-blue-600 text-white font-black rounded-2xl shadow-lg uppercase tracking-tighter">Entrar</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 space-y-6 pb-32">
      {editingItem && (
        <div className="fixed inset-0 bg-blue-600/60 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200 border-4 border-red-600">
            <h3 className="text-2xl font-black text-blue-600 mb-6 uppercase italic">Editar Información</h3>
            <input
              autoFocus
              className="w-full p-6 text-2xl border-4 border-slate-50 bg-slate-50 rounded-2xl focus:border-red-600 outline-none font-black uppercase mb-8 text-blue-600"
              value={editingItem.name}
              onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
              onKeyDown={(e) => e.key === 'Enter' && handleEditConfirm()}
            />
            <div className="flex gap-4">
              <button onClick={() => setEditingItem(null)} className="flex-1 py-5 bg-slate-100 text-slate-500 font-black rounded-2xl text-xl uppercase italic">Cancelar</button>
              <button onClick={handleEditConfirm} className="flex-1 py-5 bg-red-600 text-white font-black rounded-2xl text-xl uppercase shadow-lg italic">Confirmar</button>
            </div>
          </div>
        </div>
      )}

      {confirmDeleteId && (
        <div className="fixed inset-0 bg-red-900/40 backdrop-blur-md z-[210] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl border-4 border-red-600 animate-in zoom-in-95">
            <h3 className="text-2xl font-black text-blue-600 text-center uppercase mb-8 italic">¿Eliminar definitivamente?</h3>
            <div className="flex gap-4">
              <button onClick={() => setConfirmDeleteId(null)} className="flex-1 py-4 bg-slate-100 text-slate-500 font-black rounded-2xl uppercase italic">No, volver</button>
              <button onClick={() => handleDelete(confirmDeleteId)} className="flex-1 py-4 bg-red-600 text-white font-black rounded-2xl uppercase shadow-lg italic">Sí, borrar</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-blue-600 p-8 rounded-[2.5rem] shadow-xl border-b-8 border-red-600 text-white">
        <div>
          <h2 className="text-3xl font-black uppercase italic leading-none">Panel Maestro HMF</h2>
          <p className="text-white/80 font-bold uppercase text-[10px] tracking-widest mt-2">Los cambios se guardan automáticamente</p>
        </div>
        <button onClick={onBack} className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-black shadow-lg transition-all active:scale-95 uppercase italic tracking-tighter">Regresar</button>
      </div>

      <div className="flex bg-white p-2 rounded-[2rem] shadow-inner border-2 border-slate-100 sticky top-4 z-20">
        {(['LOGS', 'WORKERS', 'PROJECTS'] as AdminTab[]).map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all ${activeTab === tab ? 'bg-red-600 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            {tab === 'LOGS' ? 'Historial' : tab === 'WORKERS' ? 'Personal' : 'Unidades'}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[3rem] p-8 border-2 border-slate-100 shadow-sm min-h-[400px]">
        {activeTab === 'LOGS' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-black uppercase italic text-blue-600">Registros del Taller</h3>
               <button 
                  onClick={exportToExcel} 
                  className="bg-red-600 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-colors shadow-lg italic"
               >
                 Exportar Excel Estructurado
               </button>
            </div>
            <div className="divide-y divide-slate-100">
              {logs.map(log => (
                <div key={log.id} className="py-4 flex justify-between items-center">
                  <div>
                    <p className="font-black uppercase text-blue-600 tracking-tighter">{log.workerName}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{log.projectName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-red-600 italic">{log.hours}h</p>
                    <p className="text-[9px] font-bold text-slate-300 uppercase">{new Date(log.timestamp).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
              {logs.length === 0 && <p className="text-center py-20 text-slate-300 font-black italic uppercase">Sin registros</p>}
            </div>
          </div>
        )}

        {activeTab === 'WORKERS' && (
          <div className="space-y-6">
            <button 
              onClick={() => setEditingItem({id: null, name: ''})}
              className="w-full py-6 bg-red-50 border-4 border-dashed border-red-200 rounded-[2rem] font-black text-red-400 hover:text-red-600 hover:border-red-400 transition-all uppercase italic"
            >
              + Registrar nuevo operario
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {workers.map(w => (
                <div key={w.id} className="bg-slate-50 p-6 rounded-3xl flex justify-between items-center group border border-slate-100">
                  <span className="font-black uppercase text-blue-600 tracking-tighter">{w.name}</span>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingItem({id: w.id, name: w.name})} className="p-2 text-red-600 font-black text-[10px] uppercase italic">Editar</button>
                    <button onClick={() => setConfirmDeleteId(w.id)} className="p-2 text-slate-400 font-black text-[10px] uppercase italic hover:text-red-600 transition-colors">Borrar</button>
                  </div>
                </div>
              ))}
              {workers.length === 0 && <p className="col-span-full text-center py-10 text-slate-300 font-bold uppercase italic">Lista de personal vacía</p>}
            </div>
          </div>
        )}

        {activeTab === 'PROJECTS' && (
          <div className="space-y-6">
            <button 
              onClick={() => setEditingItem({id: null, name: ''})}
              className="w-full py-6 bg-blue-50 border-4 border-dashed border-blue-200 rounded-[2rem] font-black text-blue-400 hover:text-blue-600 hover:border-blue-400 transition-all uppercase italic"
            >
              + Añadir unidad de montaje
            </button>
            <div className="space-y-3">
              {projects.map(p => (
                <div key={p.id} className={`p-6 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-4 transition-all ${p.active ? 'bg-white border-2 border-slate-100 shadow-sm' : 'bg-slate-100 opacity-50'}`}>
                  <div className="flex-1 truncate w-full">
                    <p className="font-black uppercase text-blue-600 tracking-tighter truncate italic">{p.name}</p>
                    <span className={`text-[9px] font-bold uppercase tracking-widest ${p.active ? 'text-red-600' : 'text-slate-400'}`}>{p.active ? 'ACTIVO' : 'FINALIZADO'}</span>
                  </div>
                  <div className="flex gap-3 w-full md:w-auto">
                    <button onClick={() => toggleProjectActive(p.id)} className={`px-4 py-2 rounded-xl font-black text-[10px] uppercase transition-all ${p.active ? 'bg-red-100 text-red-600' : 'bg-blue-600 text-white'}`}>
                      {p.active ? 'Cerrar' : 'Reabrir'}
                    </button>
                    <button onClick={() => setEditingItem({id: p.id, name: p.name})} className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-black text-[10px] uppercase text-blue-600">Editar</button>
                    <button onClick={() => setConfirmDeleteId(p.id)} className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-black text-[10px] uppercase text-red-500">Borrar</button>
                  </div>
                </div>
              ))}
              {projects.length === 0 && <p className="text-center py-10 text-slate-300 font-bold uppercase italic">No hay unidades registradas</p>}
            </div>
          </div>
        )}
      </div>

      {showSaveSuccess && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-green-600 text-white px-10 py-5 rounded-full shadow-2xl font-black uppercase italic tracking-tighter animate-in slide-in-from-bottom-10 z-[300] flex items-center gap-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
          Sincronizado Permanentemente
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
