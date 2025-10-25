import React, { useCallback, useEffect, useRef, useState } from 'react';
import { GameCanvas } from './GameCanvas';
import { GameStats } from '../UI/GameStats';
import { GameControls } from '../UI/GameControls';
import { PlayerNameInput } from '../UI/PlayerNameInput';
import { Leaderboard } from '../UI/Leaderboard';
import { useGameState, useKeyboard, useGameLoop, useSound, useBackgroundMusic } from '../../hooks';
import { renderGame, calculateCellSize } from '../../utils';
import { addLeaderboardEntry } from '../../utils/leaderboard';
import type { CanvasContext, Size } from '../../types';

interface MazeGameProps {
  width?: number;
  height?: number;
}

export const MazeGame: React.FC<MazeGameProps> = ({ 
  width = 800, 
  height = 500 
}) => {
  const { gameState, movePlayer, togglePause, resetGame } = useGameState({
    mazeWidth: 24,
    mazeHeight: 18
  });

  const canvasCtxRef = useRef<CanvasContext | null>(null);
  const prevGameStatusRef = useRef(gameState.gameStatus);
  const [canvasSize, setCanvasSize] = useState<Size>({ width, height });
  const [showStartScreen, setShowStartScreen] = useState(true);
  const [showNameInput, setShowNameInput] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [savedTime, setSavedTime] = useState<number | undefined>(undefined);
  
  // Звукові ефекти
  const { playSound, toggleMute, isMuted } = useSound({
    volume: 0.8,
    enabled: true
  });

  // Фонова музика у стилі 90-х
  const { 
    startMusic, 
    pauseMusic, 
    toggleMute: toggleMusicMute, 
    isPlaying: isMusicPlaying,
    isMuted: isMusicMuted 
  } = useBackgroundMusic({
    volume: 0.25,
    enabled: true
  });

  // Обгортки для функцій зі звуками
  const handleMove = useCallback((direction: typeof gameState.player.direction) => {
    movePlayer(direction);
    playSound('move');
  }, [movePlayer, playSound, gameState]);

  const handleTogglePause = useCallback(() => {
    togglePause();
    playSound('pause');
    
    // Призупинити/відновити музику при паузі
    if (gameState.gameStatus === 'playing') {
      pauseMusic();
    } else if (gameState.gameStatus === 'paused') {
      startMusic();
    }
  }, [togglePause, playSound, gameState.gameStatus, pauseMusic, startMusic]);

  const handleReset = useCallback(() => {
    resetGame();
    playSound('start');
    // Запустити музику при рестарті
    if (!isMusicPlaying) {
      startMusic();
    }
  }, [resetGame, playSound, isMusicPlaying, startMusic]);

  // Обробка клавіатурного вводу (вимкнено поки не введено ім'я)
  useKeyboard({
    onMove: handleMove,
    onPause: handleTogglePause,
    onReset: handleReset,
    enabled: !showStartScreen && !showNameInput && gameState.gameStatus !== 'won'
  });

  // Відтворити звук перемоги та призупинити музику
  useEffect(() => {
    if (gameState.gameStatus === 'won' && prevGameStatusRef.current !== 'won') {
      playSound('win');
      pauseMusic(); // Зупинити музику при перемозі
      
      // Зберегти результат у таблицю лідерів
      if (gameState.endTime && gameState.startTime) {
        const gameTime = (gameState.endTime - gameState.startTime) / 1000;
        addLeaderboardEntry(playerName || 'Анонім', gameTime, gameState.moves);
        setSavedTime(gameTime);
      }
    }
    prevGameStatusRef.current = gameState.gameStatus;
  }, [gameState.gameStatus, gameState.endTime, gameState.startTime, gameState.moves, playSound, pauseMusic, playerName]);

  // Функція старту гри з музикою
  const handleStartGame = useCallback(() => {
    setShowStartScreen(false);
    setShowNameInput(true); // Показати введення імені
  }, []);

  // Обробка введення імені
  const handleNameSubmit = useCallback((name: string) => {
    setPlayerName(name);
    setShowNameInput(false);
    startMusic();
    playSound('start');
  }, [startMusic, playSound]);

  // Рендеринг гри при зміні стану або розміру canvas
  useEffect(() => {
    const canvasCtx = canvasCtxRef.current;
    if (!canvasCtx) return;
    
    const cellSize = calculateCellSize(
      canvasCtx.size.width,
      canvasCtx.size.height,
      gameState.mazeSize.width,
      gameState.mazeSize.height
    );
    
    renderGame(canvasCtx.ctx, gameState, cellSize);
  }, [gameState, canvasSize]);

  // Ігровий цикл для анімацій (поки не використовується, але готовий)
  useGameLoop({
    onUpdate: () => {
      // Тут можна додати анімації, якщо потрібно
    },
    enabled: gameState.gameStatus === 'playing',
    fps: 60
  });

  const handleCanvasReady = useCallback((context: CanvasContext) => {
    canvasCtxRef.current = context;
  }, []);

  const handleResize = useCallback((size: Size) => {
    if (canvasCtxRef.current) {
      canvasCtxRef.current = { ...canvasCtxRef.current, size };
      // Оновлюємо state щоб тригернути ререндер
      setCanvasSize(size);
    }
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      padding: '10px',
      width: '100%',
      maxWidth: '900px',
      margin: '0 auto'
    }}>
      {showStartScreen ? (
        // Стартовий екран
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '70vh',
          textAlign: 'center',
          gap: '30px',
          width: '100%'
        }}>
          <h1 style={{ 
            fontSize: 'clamp(2rem, 8vw, 4rem)',
            color: 'white',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            margin: 0,
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
          }}>
            🌟 Лабіринти від Захара 🌟
          </h1>

          <div style={{
            fontSize: 'clamp(1rem, 3vw, 1.5rem)',
            color: '#fff',
            backgroundColor: 'rgba(0,0,0,0.5)',
            padding: '20px',
            borderRadius: '15px',
            maxWidth: '500px'
          }}>
            <p style={{ margin: '10px 0' }}>🎮 Знайди шлях у лабіринті!</p>
            <p style={{ margin: '10px 0' }}>🎵 З музикою у стилі 90-х</p>
            <p style={{ margin: '10px 0' }}>🕹️ Ретро 8-bit звуки</p>
            <p style={{ margin: '10px 0' }}>🏆 Таблиця лідерів</p>
          </div>

          <button
            onClick={handleStartGame}
            style={{
              padding: '20px 50px',
              fontSize: 'clamp(1.2rem, 4vw, 2rem)',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
              transition: 'all 0.3s ease',
              animation: 'pulse 2s infinite'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.3)';
            }}
          >
            🎮 ПОЧАТИ ГРУ! 🎶
          </button>

          <div style={{
            fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
            color: '#ddd',
            backgroundColor: 'rgba(0,0,0,0.3)',
            padding: '15px',
            borderRadius: '10px'
          }}>
            <p>⌨️ Керування: <strong>стрілки</strong> або <strong>WASD</strong></p>
            <p>⏸️ <strong>ESC</strong> - пауза | 🔄 <strong>R</strong> - рестарт</p>
          </div>

          {/* Таблиця лідерів на стартовому екрані */}
          <Leaderboard limit={10} />
        </div>
      ) : showNameInput ? (
        // Екран введення імені
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '70vh',
          width: '100%'
        }}>
          <PlayerNameInput onSubmit={handleNameSubmit} />
        </div>
      ) : (
        // Екран гри
        <>
          <h1 style={{ 
            color: 'white',
            marginBottom: '15px', 
            fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
            textAlign: 'center'
          }}>
            🌟 Лабіринти від Захара 🌟
          </h1>
          
          <GameStats gameState={gameState} />
          
          <GameCanvas
            width={width}
            height={height}
            onCanvasReady={handleCanvasReady}
            onResize={handleResize}
          />
          
          <GameControls
            onPause={handleTogglePause}
            onReset={handleReset}
            onMove={handleMove}
            isPaused={gameState.gameStatus === 'paused'}
            onToggleSound={toggleMute}
            isMuted={isMuted}
            onToggleMusic={toggleMusicMute}
            isMusicMuted={isMusicMuted}
          />
          
          <div style={{ 
            background: 'white',
            marginTop: '15px', 
            textAlign: 'center',
            color: 'rgb(221, 221, 221)',
            maxWidth: '600px',
            padding: '15px',
            fontSize: 'clamp(0.85rem, 2.5vw, 1rem)',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '10px',
          }}>
            <p><strong>Керування:</strong></p>
            <p>⌨️ Використовуйте <strong>стрілки</strong> або <strong>WASD</strong> для руху</p>
            <p>⏸️ <strong>ESC</strong> - пауза | 🔄 <strong>R</strong> - рестарт</p>
            <p>🎯 Знайдіть зелений квадрат (старт) та дістаньтеся до червоного (фініш)!</p>
          </div>

          {/* Показати таблицю лідерів після перемоги */}
          {gameState.gameStatus === 'won' && (
            <div style={{ marginTop: '30px', width: '100%' }}>
              <div style={{
                textAlign: 'center',
                fontSize: 'clamp(1.5rem, 5vw, 3rem)',
                color: '#f39c12',
                marginBottom: '20px',
                fontWeight: 'bold',
                textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
              }}>
                🎉 ВІТАЄМО, {playerName}! 🎉
              </div>
              <Leaderboard limit={10} currentPlayerTime={savedTime} />
            </div>
          )}
        </>
      )}
    </div>
  );
};