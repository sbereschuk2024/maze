import type { MazeCell, Position, GameState } from '../types';
import { CellType } from '../types';

/**
 * Теми дизайну для лабіринту
 */
export const MAZE_THEMES = {
  classic: {
    wall: '#2c3e50',
    path: '#ecf0f1',
    start: '#2ecc71',
    finish: '#e74c3c',
    player: '#3498db',
    gridColor: '#95a5a6',
    background: '#34495e'
  },
  dark: {
    wall: '#1a1a2e',
    path: '#16213e',
    start: '#0f3460',
    finish: '#e94560',
    player: '#00d9ff',
    gridColor: '#2d3561',
    background: '#0f0e17'
  },
  neon: {
    wall: '#0a0e27',
    path: '#1a1f3a',
    start: '#00ff88',
    finish: '#ff006e',
    player: '#00d4ff',
    gridColor: '#2d3561',
    background: '#050714'
  },
  forest: {
    wall: '#2d5016',
    path: '#8bc34a',
    start: '#ffeb3b',
    finish: '#f44336',
    player: '#03a9f4',
    gridColor: '#558b2f',
    background: '#1b5e20'
  },
  candy: {
    wall: '#ff6b9d',
    path: '#ffeaa7',
    start: '#55efc4',
    finish: '#fd79a8',
    player: '#a29bfe',
    gridColor: '#fab1a0',
    background: '#ffeaa7'
  },
  ocean: {
    wall: '#003d5b',
    path: '#30e3ca',
    start: '#4cb944',
    finish: '#ff5252',
    player: '#ffd700',
    gridColor: '#006994',
    background: '#001f3f'
  }
};

// Поточна тема (змініть тут для переключення теми)
export const CURRENT_THEME = MAZE_THEMES.classic;

/**
 * Кольори для різних типів клітинок
 */
export const CELL_COLORS = {
  [CellType.WALL]: CURRENT_THEME.wall,
  [CellType.PATH]: CURRENT_THEME.path,
  [CellType.START]: CURRENT_THEME.start,
  [CellType.FINISH]: CURRENT_THEME.finish,
  [CellType.PLAYER]: CURRENT_THEME.player
};

/**
 * Малювання клітинки лабіринту
 */
export const drawCell = (
  ctx: CanvasRenderingContext2D,
  cell: MazeCell,
  cellSize: number
): void => {
  const x = cell.position.x * cellSize;
  const y = cell.position.y * cellSize;
  
  ctx.fillStyle = CELL_COLORS[cell.type];
  ctx.fillRect(x, y, cellSize, cellSize);
  
  // Обводка для кращої видимості
  ctx.strokeStyle = CURRENT_THEME.gridColor;
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, cellSize, cellSize);
};

/**
 * Малювання всього лабіринту
 */
export const drawMaze = (
  ctx: CanvasRenderingContext2D,
  maze: MazeCell[][],
  cellSize: number
): void => {
  // Очищення canvas
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
  // Фон
  ctx.fillStyle = CURRENT_THEME.background;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
  // Малюємо всі клітинки
  maze.forEach(row => {
    row.forEach(cell => {
      drawCell(ctx, cell, cellSize);
    });
  });
};

/**
 * Малювання гравця
 */
export const drawPlayer = (
  ctx: CanvasRenderingContext2D,
  position: Position,
  cellSize: number
): void => {
  const centerX = position.x * cellSize + cellSize / 2;
  const centerY = position.y * cellSize + cellSize / 2;
  const radius = cellSize / 3;
  
  // Тіло гравця (коло)
  ctx.fillStyle = CELL_COLORS[CellType.PLAYER];
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fill();
  
  // Обводка
  ctx.strokeStyle = '#2980b9';
  ctx.lineWidth = 2;
  ctx.stroke();
};

/**
 * Малювання всієї сцени гри
 */
export const renderGame = (
  ctx: CanvasRenderingContext2D,
  gameState: GameState,
  cellSize: number
): void => {
  // Малюємо лабіринт
  drawMaze(ctx, gameState.maze, cellSize);
  
  // Малюємо гравця
  drawPlayer(ctx, gameState.player.position, cellSize);
  
  // Якщо гра на паузі, показуємо напис
  if (gameState.gameStatus === 'paused') {
    drawPauseOverlay(ctx);
  }
  
  // Якщо гра виграна, показуємо повідомлення
  if (gameState.gameStatus === 'won') {
    drawWinOverlay(ctx, gameState);
  }
};

/**
 * Малювання оверлею паузи
 */
const drawPauseOverlay = (ctx: CanvasRenderingContext2D): void => {
  // Напівпрозорий фон
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
  // Текст
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 48px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('ПАУЗА', ctx.canvas.width / 2, ctx.canvas.height / 2);
  
  ctx.font = '24px Arial';
  ctx.fillText(
    'Натисніть ESC для продовження',
    ctx.canvas.width / 2,
    ctx.canvas.height / 2 + 50
  );
};

/**
 * Малювання оверлею перемоги
 */
const drawWinOverlay = (
  ctx: CanvasRenderingContext2D,
  gameState: GameState
): void => {
  // Напівпрозорий зелений фон
  ctx.fillStyle = 'rgba(46, 204, 113, 0.8)';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
  // Текст перемоги
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 56px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🎉 ПЕРЕМОГА! 🎉', ctx.canvas.width / 2, ctx.canvas.height / 2 - 50);
  
  // Статистика
  ctx.font = '28px Arial';
  ctx.fillText(
    `Кроків: ${gameState.moves}`,
    ctx.canvas.width / 2,
    ctx.canvas.height / 2 + 20
  );
  
  ctx.font = '20px Arial';
  ctx.fillText(
    'Натисніть R для нової гри',
    ctx.canvas.width / 2,
    ctx.canvas.height / 2 + 70
  );
};

/**
 * Розрахунок оптимального розміру клітинки для canvas
 */
export const calculateCellSize = (
  canvasWidth: number,
  canvasHeight: number,
  mazeWidth: number,
  mazeHeight: number
): number => {
  const cellWidth = Math.floor(canvasWidth / mazeWidth);
  const cellHeight = Math.floor(canvasHeight / mazeHeight);
  return Math.min(cellWidth, cellHeight);
};