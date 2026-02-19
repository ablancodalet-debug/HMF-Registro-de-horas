
import { TimeLog, Worker, Project } from '../types';
import { STORAGE_KEYS, INITIAL_WORKERS, INITIAL_PROJECTS } from '../constants';

// Función interna para asegurar que los datos iniciales solo se carguen UNA VEZ en la vida del navegador
const ensureInitialization = () => {
  const isInitialized = localStorage.getItem('hmf_initialized');
  if (!isInitialized) {
    if (localStorage.getItem(STORAGE_KEYS.WORKERS) === null) {
      localStorage.setItem(STORAGE_KEYS.WORKERS, JSON.stringify(INITIAL_WORKERS));
    }
    if (localStorage.getItem(STORAGE_KEYS.PROJECTS) === null) {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
    }
    localStorage.setItem('hmf_initialized', 'true');
  }
};

export const getLogs = (): TimeLog[] => {
  const data = localStorage.getItem(STORAGE_KEYS.LOGS);
  return data ? JSON.parse(data) : [];
};

export const saveLog = (log: TimeLog): void => {
  const logs = getLogs();
  logs.push(log);
  localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
};

export const getWorkers = (): Worker[] => {
  ensureInitialization();
  const data = localStorage.getItem(STORAGE_KEYS.WORKERS);
  try {
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const saveWorkers = (workers: Worker[]): void => {
  localStorage.setItem(STORAGE_KEYS.WORKERS, JSON.stringify(workers));
};

export const getProjects = (): Project[] => {
  ensureInitialization();
  const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
  try {
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const saveProjects = (projects: Project[]): void => {
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
};

export const resetLogs = (): void => {
  localStorage.removeItem(STORAGE_KEYS.LOGS);
};
