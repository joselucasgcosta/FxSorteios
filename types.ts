export interface Participant {
  id: string; // generated unique id
  code: string; // Column A
  name: string; // Column B
  weight: number; // Column C
  winChance: number; // Calculated percentage
}

export enum AppState {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  READY = 'READY',
  DRAWING = 'DRAWING',
  WINNER = 'WINNER',
}

export interface DrawHistory {
  timestamp: Date;
  winner: Participant;
}
