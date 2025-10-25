import React, { useEffect, useState } from 'react';
import type { GameState } from '../../types';
import { formatTime } from '../../utils';
import './GameStats.css';

interface GameStatsProps {
  gameState: GameState;
}

export const GameStats: React.FC<GameStatsProps> = ({ gameState }) => {
  const [currentTime, setCurrentTime] = useState(0);

  // Оновлення часу кожну секунду для гри що триває
  useEffect(() => {
    if (gameState.gameStatus === 'playing') {
      const interval = setInterval(() => {
        setCurrentTime(Date.now() - gameState.startTime);
      }, 100);

      return () => clearInterval(interval);
    } else if (gameState.gameStatus === 'won' && gameState.endTime) {
      setCurrentTime(gameState.endTime - gameState.startTime);
    }
  }, [gameState.gameStatus, gameState.startTime, gameState.endTime]);

  return (
    <div className="game-stats">
      <div className="stat-item">
        <span className="stat-label">⏱️ Час:</span>
        <span className="stat-value">{formatTime(currentTime)}</span>
      </div>
      
      <div className="stat-item">
        <span className="stat-label">👣 Кроки:</span>
        <span className="stat-value">{gameState.moves}</span>
      </div>
      
      <div className="stat-item">
        <span className="stat-label">📊 Статус:</span>
        <span className={`stat-value status-${gameState.gameStatus}`}>
          {gameState.gameStatus === 'playing' && '🎮 Гра'}
          {gameState.gameStatus === 'paused' && '⏸️ Пауза'}
          {gameState.gameStatus === 'won' && '🏆 Перемога'}
        </span>
      </div>

      <div className="stat-item">
        <span className="stat-label">📐 Розмір:</span>
        <span className="stat-value">
          {gameState.mazeSize.width} × {gameState.mazeSize.height}
        </span>
      </div>
    </div>
  );
};