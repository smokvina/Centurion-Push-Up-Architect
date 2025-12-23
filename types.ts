export interface UserProgress {
  maxReps: number;
  currentPhase: number;
  currentWeek: number;
  currentDay: number; 
  history: WorkoutLog[];
  maxRepsHistory: { date: string; reps: number }[];
  dailyGoal: number;
  dailyProgress: number;
  lastProgressUpdate: string; // ISO date
  reminders: {
    enabled: boolean;
    time: string; // HH:mm
    days: number[]; // 0-6
  };
  onboardingComplete: boolean;
  startDate: string;
}

export interface WorkoutLog {
  date: string;
  phase: number;
  week: number;
  reps: number[];
  completed: boolean;
  totalReps: number;
}

export interface TrainingPhase {
  id: number;
  name: string;
  description: string;
  weeks: number[]; 
  focus: string;
  restTimeSeconds: number;
}

export type Theme = 'dark' | 'light';

export interface LogMessage {
  type: 'log' | 'error' | 'warn' | 'info';
  message: string;
  timestamp: string;
}
