
import { Worker, Project } from './types';

export const INITIAL_WORKERS: Worker[] = [
  { id: 'w1', name: 'Juan García' },
  { id: 'w2', name: 'Pedro Martínez' },
  { id: 'w3', name: 'María Rodríguez' },
  { id: 'w4', name: 'Antonio López' },
  { id: 'w5', name: 'Luis Sánchez' },
  { id: 'w6', name: 'Francisco Fernández' },
  { id: 'w7', name: 'Manuel González' },
  { id: 'w8', name: 'José Pérez' }
];

export const INITIAL_PROJECTS: Project[] = [
  { id: 'p-limpieza', name: 'LIMPIEZA Y MANTENIMIENTO TALLER', active: true },
  { id: 'p1', name: 'CAMIÓN SCANIA R450 - GRÚA PALFINGER PK23', active: true },
  { id: 'p2', name: 'VOLVO FH16 - GRÚA FASSI F545', active: true },
  { id: 'p3', name: 'MERCEDES ACTROS - GRÚA HIAB X-HIPRO', active: true },
  { id: 'p4', name: 'IVECO STRALIS - MONTAJE CAJA FIJA', active: true },
  { id: 'p5', name: 'RENAULT T - MANTENIMIENTO PREVENTIVO', active: true },
  { id: 'p6', name: 'MAN TGX - REPARACIÓN SISTEMA HIDRÁULICO', active: true }
];

export const STORAGE_KEYS = {
  LOGS: 'workshop_time_logs',
  WORKERS: 'workshop_workers',
  PROJECTS: 'workshop_projects'
};
