export interface TrainingLog {
  message: string;
  type: 'info' | 'success' | 'error';
  timestamp: string;
}