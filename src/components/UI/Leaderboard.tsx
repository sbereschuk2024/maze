import React from 'react';
import { getTopEntries, formatLeaderboardTime, formatDate } from '../../utils/leaderboard';
import type { LeaderboardEntry } from '../../types/leaderboard';
import './Leaderboard.css';

interface LeaderboardProps {
  limit?: number;
  currentPlayerTime?: number;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ 
  limit = 10,
  currentPlayerTime 
}) => {
  const entries = getTopEntries(limit);

  if (entries.length === 0) {
    return (
      <div className="leaderboard-container">
        <h2 className="leaderboard-title">🏆 Таблиця лідерів</h2>
        <div className="leaderboard-empty">
          <p>Поки немає записів</p>
          <p>Станьте першим! 🌟</p>
        </div>
      </div>
    );
  }

  const getMedalEmoji = (position: number): string => {
    switch (position) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return `${position + 1}.`;
    }
  };

  const isCurrentPlayer = (entry: LeaderboardEntry): boolean => {
    if (!currentPlayerTime) return false;
    return Math.abs(entry.time - currentPlayerTime) < 0.1;
  };

  return (
    <div className="leaderboard-container">
      <h2 className="leaderboard-title">🏆 Топ {limit} гравців</h2>
      <div className="leaderboard-table">
        <div className="leaderboard-header">
          <div className="leaderboard-cell leaderboard-rank">#</div>
          <div className="leaderboard-cell leaderboard-name">Ім'я</div>
          <div className="leaderboard-cell leaderboard-time">Час</div>
          <div className="leaderboard-cell leaderboard-moves">Ходи</div>
          <div className="leaderboard-cell leaderboard-date">Дата</div>
        </div>
        {entries.map((entry, index) => (
          <div 
            key={entry.id} 
            className={`leaderboard-row ${isCurrentPlayer(entry) ? 'leaderboard-current' : ''} ${index < 3 ? 'leaderboard-top3' : ''}`}
          >
            <div className="leaderboard-cell leaderboard-rank">
              <span className="rank-medal">{getMedalEmoji(index)}</span>
            </div>
            <div className="leaderboard-cell leaderboard-name">
              {entry.playerName}
              {isCurrentPlayer(entry) && <span className="current-badge">ВИ</span>}
            </div>
            <div className="leaderboard-cell leaderboard-time">
              ⏱️ {formatLeaderboardTime(entry.time)}
            </div>
            <div className="leaderboard-cell leaderboard-moves">
              👣 {entry.moves}
            </div>
            <div className="leaderboard-cell leaderboard-date">
              📅 {formatDate(entry.date)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
