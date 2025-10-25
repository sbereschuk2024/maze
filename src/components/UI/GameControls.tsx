import React from 'react';
import type { Direction } from '../../types';
import './GameControls.css';

interface GameControlsProps {
  onPause?: () => void;
  onReset?: () => void;
  onMove?: (direction: Direction) => void;
  isPaused?: boolean;
  onToggleSound?: () => void;
  isMuted?: boolean;
  onToggleMusic?: () => void;
  isMusicMuted?: boolean;
}

export const GameControls: React.FC<GameControlsProps> = ({
  onPause,
  onReset,
  onMove,
  isPaused = false,
  onToggleSound,
  isMuted = false,
  onToggleMusic,
  isMusicMuted = false
}) => {
  return (
    <div className="game-controls">

      {onMove && (
        <div className="direction-controls">
          <div className="direction-row">
            <button
              className="direction-btn"
              onClick={() => onMove('up')}
              title="Вгору (W або ↑)"
            >
              ⬆️
            </button>
          </div>
          
          <div className="direction-row">
            <button
              className="direction-btn"
              onClick={() => onMove('left')}
              title="Вліво (A або ←)"
            >
              ⬅️
            </button>
            
            <button
              className="direction-btn"
              onClick={() => onMove('down')}
              title="Вниз (S або ↓)"
            >
              ⬇️
            </button>
            
            <button
              className="direction-btn"
              onClick={() => onMove('right')}
              title="Вправо (D або →)"
            >
              ➡️
            </button>
          </div>
        </div>
      )}
      <div className="control-buttons">
        <button
          className="control-btn pause-btn"
          onClick={onPause}
          title="Пауза (ESC)"
        >
          {isPaused ? '▶️ Продовжити' : '⏸️ Пауза'}
        </button>
        
        <button
          className="control-btn reset-btn"
          onClick={onReset}
          title="Рестарт (R)"
        >
          🔄 Рестарт
        </button>

        {onToggleSound && (
          <button
            className="control-btn sound-btn"
            onClick={onToggleSound}
            title={isMuted ? 'Увімкнути звук' : 'Вимкнути звук'}
          >
            {isMuted ? '🔇 Звук' : '🔊 Звук'}
          </button>
        )}

        {onToggleMusic && (
          <button
            className="control-btn music-btn"
            onClick={onToggleMusic}
            title={isMusicMuted ? 'Увімкнути музику' : 'Вимкнути музику'}
          >
            {isMusicMuted ? '🎵 Музика' : '🎶 Музика'}
          </button>
        )}
      </div>
    </div>
  );
};