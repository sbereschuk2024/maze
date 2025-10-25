/**
 * Типи для таблиці лідерів
 */

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  time: number; // Час у секундах
  date: string; // Дата проходження
  mazeSize?: string; // Розмір лабіринту (опціонально)
}

export interface LeaderboardData {
  entries: LeaderboardEntry[];
}
