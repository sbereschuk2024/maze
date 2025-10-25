import React, { useRef, useEffect, useState } from 'react';
import type { CanvasContext, Size } from '../../types';

interface GameCanvasProps {
  width?: number;
  height?: number;
  onCanvasReady?: (canvasContext: CanvasContext) => void;
  onResize?: (size: Size) => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  width = 800,
  height = 600,
  onCanvasReady,
  onResize
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState<Size>({ width, height });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Налаштування canvas
    ctx.imageSmoothingEnabled = false; // Для pixel art стилю
    
    const canvasContext: CanvasContext = {
      canvas,
      ctx,
      size: canvasSize
    };

    onCanvasReady?.(canvasContext);
  }, [canvasSize, onCanvasReady]);

  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;
      if (!container) return;

      // Отримуємо доступну ширину контейнера
      const containerWidth = container.clientWidth;
      const padding = 20; // Мінімальні відступи
      const availableWidth = containerWidth - padding;
      
      // Зберігаємо співвідношення сторін
      const aspectRatio = height / width;
      
      // Використовуємо всю доступну ширину (але не більше оригінального розміру)
      const newWidth = Math.min(availableWidth, width);
      const newHeight = Math.floor(newWidth * aspectRatio);
      
      // Перевіряємо, щоб висота не виходила за межі екрану
      const maxHeight = window.innerHeight * 0.65; // 65% висоти екрану
      
      if (newHeight > maxHeight) {
        const adjustedHeight = maxHeight;
        const adjustedWidth = Math.floor(adjustedHeight / aspectRatio);
        setCanvasSize({ width: adjustedWidth, height: adjustedHeight });
        onResize?.({ width: adjustedWidth, height: adjustedHeight });
      } else {
        setCanvasSize({ width: newWidth, height: newHeight });
        onResize?.({ width: newWidth, height: newHeight });
      }
    };

    window.addEventListener('resize', handleResize);
    // Затримка для коректного розрахунку розмірів
    setTimeout(handleResize, 100);

    return () => window.removeEventListener('resize', handleResize);
  }, [width, height, onResize]);

  return (
    <div 
      ref={containerRef}
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 10px'
      }}
    >
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        style={{
          border: '2px solid #333',
          borderRadius: '8px',
          display: 'block',
          width: '100%',
          height: 'auto',
          maxWidth: `${canvasSize.width}px`,
          touchAction: 'none' // Вимкнути стандартні жести на мобільних
        }}
      />
    </div>
  );
};