import type { MazeCell, Position } from '../types';
import { CellType } from '../types';

/**
 * Алгоритми генерації лабіринтів
 */

// ============================================
// 1. ПРОСТИЙ ВИПАДКОВИЙ (поточний)
// ============================================
export function generateRandomMaze(width: number, height: number): MazeCell[][] {
  const maze: MazeCell[][] = [];
  
  for (let y = 0; y < height; y++) {
    const row: MazeCell[] = [];
    for (let x = 0; x < width; x++) {
      const position: Position = { x, y };
      let type: typeof CellType[keyof typeof CellType];
      
      // Стіни по периметру
      if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
        type = CellType.WALL;
      }
      // Старт
      else if (x === 1 && y === 1) {
        type = CellType.START;
      }
      // Фініш
      else if (x === width - 2 && y === height - 2) {
        type = CellType.FINISH;
      }
      // Випадкові стіни (20% шанс)
      else if (Math.random() < 0.2 && !(x === 1 || y === 1)) {
        type = CellType.WALL;
      }
      // Шлях
      else {
        type = CellType.PATH;
      }
      
      row.push({ type, position });
    }
    maze.push(row);
  }
  
  return maze;
}

// ============================================
// 2. RECURSIVE BACKTRACKING - класичний алгоритм
// ============================================
export function generateRecursiveBacktrackingMaze(width: number, height: number): MazeCell[][] {
  // Ініціалізація - все стіни
  const maze: MazeCell[][] = [];
  for (let y = 0; y < height; y++) {
    const row: MazeCell[] = [];
    for (let x = 0; x < width; x++) {
      row.push({ 
        type: CellType.WALL, 
        position: { x, y },
        visited: false 
      });
    }
    maze.push(row);
  }

  const stack: Position[] = [];
  const startPos = { x: 1, y: 1 };
  
  maze[startPos.y][startPos.x].type = CellType.PATH;
  maze[startPos.y][startPos.x].visited = true;
  stack.push(startPos);

  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const neighbors = getUnvisitedNeighbors(current, maze, width, height);

    if (neighbors.length > 0) {
      const next = neighbors[Math.floor(Math.random() * neighbors.length)];
      
      // Прокласти шлях між поточною та наступною клітинкою
      const wallX = Math.floor((current.x + next.x) / 2);
      const wallY = Math.floor((current.y + next.y) / 2);
      
      maze[next.y][next.x].type = CellType.PATH;
      maze[next.y][next.x].visited = true;
      maze[wallY][wallX].type = CellType.PATH;
      
      stack.push(next);
    } else {
      stack.pop();
    }
  }

  // Встановити старт і фініш
  maze[1][1].type = CellType.START;
  maze[height - 2][width - 2].type = CellType.FINISH;

  return maze;
}

// ============================================
// 3. ROOMS & CORRIDORS - кімнати з коридорами
// ============================================
export function generateRoomsAndCorridorsMaze(width: number, height: number): MazeCell[][] {
  // Ініціалізація - все стіни
  const maze: MazeCell[][] = [];
  for (let y = 0; y < height; y++) {
    const row: MazeCell[] = [];
    for (let x = 0; x < width; x++) {
      row.push({ type: CellType.WALL, position: { x, y } });
    }
    maze.push(row);
  }

  // Створити кімнати
  const rooms: Array<{x: number, y: number, width: number, height: number}> = [];
  const numRooms = Math.floor((width * height) / 80); // Кількість кімнат

  for (let i = 0; i < numRooms; i++) {
    const roomWidth = 3 + Math.floor(Math.random() * 4);
    const roomHeight = 3 + Math.floor(Math.random() * 4);
    const roomX = 1 + Math.floor(Math.random() * (width - roomWidth - 2));
    const roomY = 1 + Math.floor(Math.random() * (height - roomHeight - 2));

    rooms.push({ x: roomX, y: roomY, width: roomWidth, height: roomHeight });

    // Заповнити кімнату шляхом
    for (let y = roomY; y < roomY + roomHeight; y++) {
      for (let x = roomX; x < roomX + roomWidth; x++) {
        if (y < height && x < width) {
          maze[y][x].type = CellType.PATH;
        }
      }
    }
  }

  // З'єднати кімнати коридорами
  for (let i = 0; i < rooms.length - 1; i++) {
    const room1 = rooms[i];
    const room2 = rooms[i + 1];
    
    const centerX1 = room1.x + Math.floor(room1.width / 2);
    const centerY1 = room1.y + Math.floor(room1.height / 2);
    const centerX2 = room2.x + Math.floor(room2.width / 2);
    const centerY2 = room2.y + Math.floor(room2.height / 2);

    // Горизонтальний коридор
    for (let x = Math.min(centerX1, centerX2); x <= Math.max(centerX1, centerX2); x++) {
      maze[centerY1][x].type = CellType.PATH;
    }
    
    // Вертикальний коридор
    for (let y = Math.min(centerY1, centerY2); y <= Math.max(centerY1, centerY2); y++) {
      maze[y][centerX2].type = CellType.PATH;
    }
  }

  // Встановити старт і фініш
  if (rooms.length > 0) {
    const firstRoom = rooms[0];
    const lastRoom = rooms[rooms.length - 1];
    
    maze[firstRoom.y + 1][firstRoom.x + 1].type = CellType.START;
    maze[lastRoom.y + 1][lastRoom.x + 1].type = CellType.FINISH;
  }

  return maze;
}

// ============================================
// 4. PRIMS ALGORITHM - випадковий мінімальний ліс
// ============================================
export function generatePrimsMaze(width: number, height: number): MazeCell[][] {
  const maze: MazeCell[][] = [];
  for (let y = 0; y < height; y++) {
    const row: MazeCell[] = [];
    for (let x = 0; x < width; x++) {
      row.push({ type: CellType.WALL, position: { x, y } });
    }
    maze.push(row);
  }

  const walls: Position[] = [];
  const startPos = { x: 1, y: 1 };
  
  maze[startPos.y][startPos.x].type = CellType.PATH;
  addWallsToList(startPos, walls, maze, width, height);

  while (walls.length > 0) {
    const randomIndex = Math.floor(Math.random() * walls.length);
    const wall = walls.splice(randomIndex, 1)[0];

    if (maze[wall.y][wall.x].type === CellType.WALL) {
      const neighbors = getPathNeighbors(wall, maze);
      
      if (neighbors.length === 1) {
        maze[wall.y][wall.x].type = CellType.PATH;
        addWallsToList(wall, walls, maze, width, height);
      }
    }
  }

  maze[1][1].type = CellType.START;
  maze[height - 2][width - 2].type = CellType.FINISH;

  return maze;
}

// ============================================
// ДОПОМІЖНІ ФУНКЦІЇ
// ============================================

function getUnvisitedNeighbors(pos: Position, maze: MazeCell[][], width: number, height: number): Position[] {
  const neighbors: Position[] = [];
  const directions = [
    { x: 0, y: -2 },
    { x: 2, y: 0 },
    { x: 0, y: 2 },
    { x: -2, y: 0 }
  ];

  directions.forEach(dir => {
    const newX = pos.x + dir.x;
    const newY = pos.y + dir.y;

    if (newX > 0 && newX < width - 1 && newY > 0 && newY < height - 1) {
      if (!maze[newY][newX].visited) {
        neighbors.push({ x: newX, y: newY });
      }
    }
  });

  return neighbors;
}

function addWallsToList(pos: Position, walls: Position[], maze: MazeCell[][], width: number, height: number): void {
  const directions = [
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 }
  ];

  directions.forEach(dir => {
    const newX = pos.x + dir.x;
    const newY = pos.y + dir.y;

    if (newX > 0 && newX < width - 1 && newY > 0 && newY < height - 1) {
      if (maze[newY][newX].type === CellType.WALL) {
        walls.push({ x: newX, y: newY });
      }
    }
  });
}

function getPathNeighbors(pos: Position, maze: MazeCell[][]): Position[] {
  const neighbors: Position[] = [];
  const directions = [
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 }
  ];

  directions.forEach(dir => {
    const newX = pos.x + dir.x;
    const newY = pos.y + dir.y;

    if (newY >= 0 && newY < maze.length && newX >= 0 && newX < maze[0].length) {
      if (maze[newY][newX].type === CellType.PATH) {
        neighbors.push({ x: newX, y: newY });
      }
    }
  });

  return neighbors;
}