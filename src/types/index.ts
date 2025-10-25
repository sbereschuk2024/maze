// Базові типи для гри лабіринт

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

// Типи клітинок лабіринту
export const CellType = {
  WALL: 'wall',
  PATH: 'path',
  START: 'start',
  FINISH: 'finish',
  PLAYER: 'player'
} as const;

export type CellType = typeof CellType[keyof typeof CellType];

// Стан клітинки лабіринту
export interface MazeCell {
  type: CellType;
  position: Position;
  visited?: boolean;
}

// Напрямки руху
export const Direction = {
  UP: 'up',
  DOWN: 'down',
  LEFT: 'left',
  RIGHT: 'right'
} as const;

export type Direction = typeof Direction[keyof typeof Direction];

// Стан гравця
export interface Player {
  position: Position;
  direction: Direction;
}

// Стан гри
export interface GameState {
  maze: MazeCell[][];
  player: Player;
  gameStatus: 'playing' | 'won' | 'paused';
  startTime: number;
  endTime?: number;
  moves: number;
  mazeSize: Size;
}

// Налаштування гри
export interface GameSettings {
  mazeWidth: number;
  mazeHeight: number;
  cellSize: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

// Клавіші керування
export interface KeyMap {
  [key: string]: Direction;
}

// Canvas контекст
export interface CanvasContext {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  size: Size;
}

// Експорт типів таблиці лідерів
export type { LeaderboardEntry, LeaderboardData } from './leaderboard';