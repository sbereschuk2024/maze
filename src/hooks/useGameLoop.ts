import { useEffect, useRef, useCallback } from 'react';

interface UseGameLoopOptions {
  onUpdate?: (deltaTime: number) => void;
  fps?: number;
  enabled?: boolean;
}

export const useGameLoop = ({
  onUpdate,
  fps = 60,
  enabled = true
}: UseGameLoopOptions) => {
  const requestRef = useRef<number | undefined>(undefined);
  const previousTimeRef = useRef<number | undefined>(undefined);
  const fpsInterval = 1000 / fps;

  const animate = useCallback((time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      
      // Обмеження FPS
      if (deltaTime >= fpsInterval) {
        onUpdate?.(deltaTime);
        previousTimeRef.current = time;
      }
    } else {
      previousTimeRef.current = time;
    }
    
    requestRef.current = requestAnimationFrame(animate);
  }, [onUpdate, fpsInterval]);

  useEffect(() => {
    if (enabled && onUpdate) {
      requestRef.current = requestAnimationFrame(animate);
      
      return () => {
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
        }
      };
    }
  }, [enabled, animate, onUpdate]);

  return {
    isRunning: enabled && !!requestRef.current
  };
};