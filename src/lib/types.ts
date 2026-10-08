export type Difficulty = 'beginner' | 'intermediate' | 'expert' | 'custom';

export interface DifficultyConfig {
  name: string;
  nameKo: string;
  cols: number;
  rows: number;
  mines: number;
}

export interface Cell {
  x: number;
  y: number;
  isMine: boolean;
  revealed: boolean;
  flagged: boolean;
  neighborMines: number;
  exploded?: boolean;
  wrongFlag?: boolean;
}

export type GameStatus = 'idle' | 'playing' | 'won' | 'lost';

export type FaceMood = 'smile' | 'scared' | 'cool' | 'dead';

export type ThemeMode = 'classic' | 'dark';

export interface HighScoreRecord {
  timeSeconds: number;
  date: string;
  clicks: number;
}

export interface HighScores {
  beginner: HighScoreRecord | null;
  intermediate: HighScoreRecord | null;
  expert: HighScoreRecord | null;
}
