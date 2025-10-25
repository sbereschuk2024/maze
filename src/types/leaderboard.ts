/**
 * Типи для таблиці лідерів
 */

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  time: number; // Час у секундах
  moves: number; // Кількість ходів
  date: string; // Дата проходження
}

export interface LeaderboardData {
  entries: LeaderboardEntry[];
}
