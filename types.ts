
export interface Worker {
  id: string;
  name: string;
}

export interface Project {
  id: string;
  name: string;
  active: boolean;
}

export interface TimeLog {
  id: string;
  workerId: string;
  workerName: string;
  projectId: string;
  projectName: string;
  hours: number;
  timestamp: string; // ISO String
}

export type ViewState = 'SELECT_WORKER' | 'SELECT_PROJECT' | 'INPUT_HOURS' | 'ADMIN';
