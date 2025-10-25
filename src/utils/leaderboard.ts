import type { LeaderboardEntry, LeaderboardData } from '../types/leaderboard';

const STORAGE_KEY = 'maze_game_leaderboard';

/**
 * Отримати всі записи з таблиці лідерів
 */
export const getLeaderboard = (): LeaderboardEntry[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    
    const parsed: LeaderboardData = JSON.parse(data);
    return parsed.entries || [];
  } catch (error) {
    console.error('Error reading leaderboard:', error);
    return [];
  }
};

/**
 * Додати новий запис до таблиці лідерів
 */
export const addLeaderboardEntry = (
  playerName: string,
  time: number,
  moves: number
): void => {
  try {
    const entries = getLeaderboard();
    
    const newEntry: LeaderboardEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      playerName: playerName.trim() || 'Анонім',
      time,
      moves,
      date: new Date().toISOString()
    };
    
    entries.push(newEntry);
    
    // Сортувати за часом (найшвидші перші)
    entries.sort((a, b) => a.time - b.time);
    
    // Зберегти тільки топ 100 (щоб не займати багато місця)
    const limitedEntries = entries.slice(0, 100);
    
    const data: LeaderboardData = {
      entries: limitedEntries
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving leaderboard entry:', error);
  }
};

/**
 * Отримати топ N записів
 */
export const getTopEntries = (limit: number = 10): LeaderboardEntry[] => {
  const entries = getLeaderboard();
  return entries.slice(0, limit);
};

/**
 * Очистити таблицю лідерів
 */
export const clearLeaderboard = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing leaderboard:', error);
  }
};

/**
 * Форматувати час у вигляді MM:SS для таблиці лідерів
 */
export const formatLeaderboardTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Форматувати дату
 */
export const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  return date.toLocaleDateString('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};
