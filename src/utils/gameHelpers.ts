import type { Position, MazeCell, GameState } from '../types';
import { CellType } from '../types';

/**
 * Перевірка чи позиція в межах лабіринту
 */
export const isPositionInBounds = (
  position: Position,
  width: number,
  height: number
): boolean => {
  return (
    position.x >= 0 &&
    position.x < width &&
    position.y >= 0 &&
    position.y < height
  );
};

/**
 * Отримання клітинки за позицією
 */
export const getCellAtPosition = (
  maze: MazeCell[][],
  position: Position
): MazeCell | null => {
  if (!isPositionInBounds(position, maze[0]?.length || 0, maze.length)) {
    return null;
  }
  return maze[position.y][position.x];
};

/**
 * Перевірка чи клітинка є прохідною
 */
export const isCellWalkable = (cell: MazeCell | null): boolean => {
  if (!cell) return false;
  return cell.type !== CellType.WALL;
};

/**
 * Перевірка чи позиції рівні
 */
export const arePositionsEqual = (pos1: Position, pos2: Position): boolean => {
  return pos1.x === pos2.x && pos1.y === pos2.y;
};

/**
 * Розрахунок дистанції між двома позиціями (Manhattan distance)
 */
export const getManhattanDistance = (pos1: Position, pos2: Position): number => {
  return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
};

/**
 * Отримання всіх сусідніх клітинок
 */
export const getNeighbors = (
  position: Position,
  maze: MazeCell[][]
): MazeCell[] => {
  const neighbors: MazeCell[] = [];
  const directions = [
    { x: 0, y: -1 }, // вгору
    { x: 1, y: 0 },  // вправо
    { x: 0, y: 1 },  // вниз
    { x: -1, y: 0 }  // вліво
  ];

  directions.forEach(dir => {
    const newPos: Position = {
      x: position.x + dir.x,
      y: position.y + dir.y
    };
    const cell = getCellAtPosition(maze, newPos);
    if (cell) {
      neighbors.push(cell);
    }
  });

  return neighbors;
};

/**
 * Форматування часу (мілісекунди -> хвилини:секунди)
 */
export const formatTime = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Розрахунок часу гри
 */
export const calculateGameTime = (gameState: GameState): number => {
  const { startTime, endTime, gameStatus } = gameState;
  
  if (gameStatus === 'won' && endTime) {
    return endTime - startTime;
  }
  
  if (gameStatus === 'playing') {
    return Date.now() - startTime;
  }
  
  return 0;
};

/**
 * Знайти стартову позицію в лабіринті
 */
export const findStartPosition = (maze: MazeCell[][]): Position | null => {
  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[y].length; x++) {
      if (maze[y][x].type === CellType.START) {
        return { x, y };
      }
    }
  }
  return null;
};

/**
 * Знайти фінішну позицію в лабіринті
 */
export const findFinishPosition = (maze: MazeCell[][]): Position | null => {
  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[y].length; x++) {
      if (maze[y][x].type === CellType.FINISH) {
        return { x, y };
      }
    }
  }
  return null;
};