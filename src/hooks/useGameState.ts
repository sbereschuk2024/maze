import { useState, useCallback, useMemo } from 'react';
import type { GameState, GameSettings, Position, MazeCell, Player, Direction } from '../types';
import { CellType } from '../types';
import { 
  generatePrimsMaze
} from '../utils/mazeGenerators';

const DEFAULT_SETTINGS: GameSettings = {
  mazeWidth: 20,
  mazeHeight: 15,
  cellSize: 30,
  difficulty: 'medium'
};

export const useGameState = (initialSettings?: Partial<GameSettings>) => {
  const settings = useMemo(() => 
    ({ ...DEFAULT_SETTINGS, ...initialSettings }), 
    [initialSettings]
  );
  
  // Ініціалізація початкового стану
  const [gameState, setGameState] = useState<GameState>(() => 
    createInitialGameState(settings)
  );

  // Рух гравця
  const movePlayer = useCallback((direction: Direction) => {
    setGameState(prevState => {
      const newPosition = calculateNewPosition(prevState.player.position, direction);
      
      // Перевірка чи можна рухатися (чи не стіна)
      if (isValidMove(newPosition, prevState.maze)) {
        const updatedPlayer: Player = {
          position: newPosition,
          direction
        };

        // Перевірка чи досягнуто фінішу
        const finishCell = prevState.maze[newPosition.y][newPosition.x];
        const gameStatus = finishCell.type === CellType.FINISH ? 'won' : 'playing';
        const endTime = gameStatus === 'won' ? Date.now() : undefined;

        return {
          ...prevState,
          player: updatedPlayer,
          moves: prevState.moves + 1,
          gameStatus,
          endTime
        };
      }
      
      return prevState;
    });
  }, []);

  // Пауза/відновлення гри
  const togglePause = useCallback(() => {
    setGameState(prevState => ({
      ...prevState,
      gameStatus: prevState.gameStatus === 'paused' ? 'playing' : 'paused'
    }));
  }, []);

  // Рестарт гри
  const resetGame = useCallback(() => {
    setGameState(createInitialGameState(settings));
  }, [settings]);

  // Нова гра з новими налаштуваннями
  const startNewGame = useCallback((newSettings?: Partial<GameSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setGameState(createInitialGameState(updatedSettings));
  }, [settings]);

  return {
    gameState,
    movePlayer,
    togglePause,
    resetGame,
    startNewGame,
    settings
  };
};

// Допоміжні функції

function createInitialGameState(settings: GameSettings): GameState {
  // Вибір алгоритму генерації лабіринту
  // Змініть тут для переключення алгоритму:
  // - generateRandomMaze (простий випадковий)
  // - generateRecursiveBacktrackingMaze (класичний, складний)
  // - generateRoomsAndCorridorsMaze (кімнати з коридорами)
  // - generatePrimsMaze (випадкові шляхи)
  
  const maze = generatePrimsMaze(settings.mazeWidth, settings.mazeHeight);
  
  // Початкова позиція гравця (зазвичай лівий верхній кут)
  const startPosition: Position = { x: 1, y: 1 };
  
  return {
    maze,
    player: {
      position: startPosition,
      direction: 'right'
    },
    gameStatus: 'playing',
    startTime: Date.now(),
    moves: 0,
    mazeSize: {
      width: settings.mazeWidth,
      height: settings.mazeHeight
    }
  };
}

// Розрахунок нової позиції на основі напрямку
function calculateNewPosition(currentPos: Position, direction: Direction): Position {
  const directions: Record<Direction, Position> = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 }
  };
  
  const delta = directions[direction];
  return {
    x: currentPos.x + delta.x,
    y: currentPos.y + delta.y
  };
}

// Перевірка чи можна зробити хід
function isValidMove(position: Position, maze: MazeCell[][]): boolean {
  // Перевірка меж
  if (position.y < 0 || position.y >= maze.length) return false;
  if (position.x < 0 || position.x >= maze[0].length) return false;
  
  // Перевірка чи не стіна
  const cell = maze[position.y][position.x];
  return cell.type !== CellType.WALL;
}