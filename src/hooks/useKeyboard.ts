import { useEffect, useCallback, useRef } from 'react';
import type { Direction, KeyMap } from '../types';

// Мапінг клавіш на напрямки
const DEFAULT_KEY_MAP: KeyMap = {
  'ArrowUp': 'up',
  'ArrowDown': 'down',
  'ArrowLeft': 'left',
  'ArrowRight': 'right',
  'w': 'up',
  'W': 'up',
  's': 'down',
  'S': 'down',
  'a': 'left',
  'A': 'left',
  'd': 'right',
  'D': 'right'
};

interface UseKeyboardOptions {
  onMove?: (direction: Direction) => void;
  onPause?: () => void;
  onReset?: () => void;
  keyMap?: KeyMap;
  enabled?: boolean;
}

export const useKeyboard = ({
  onMove,
  onPause,
  onReset,
  keyMap = DEFAULT_KEY_MAP,
  enabled = true
}: UseKeyboardOptions) => {
  // Використовуємо ref для уникнення повторних натискань
  const pressedKeys = useRef<Set<string>>(new Set());

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    const key = event.key;

    // Уникаємо повторних натискань при утриманні клавіші
    if (pressedKeys.current.has(key)) return;
    pressedKeys.current.add(key);

    // Рух
    if (keyMap[key] && onMove) {
      event.preventDefault();
      onMove(keyMap[key] as Direction);
      return;
    }

    // Пауза (Escape або P)
    if ((key === 'Escape' || key === 'p' || key === 'P') && onPause) {
      event.preventDefault();
      onPause();
      return;
    }

    // Рестарт (R)
    if ((key === 'r' || key === 'R') && onReset) {
      event.preventDefault();
      onReset();
      return;
    }
  }, [enabled, keyMap, onMove, onPause, onReset]);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    pressedKeys.current.delete(event.key);
  }, []);

  useEffect(() => {
    if (!enabled) {
      // Очищаємо набір клавіш при вимкненні
      pressedKeys.current.clear();
      return;
    }

    const keys = pressedKeys.current;

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      keys.clear();
    };
  }, [enabled, handleKeyDown, handleKeyUp]);

  // Метод для програмного виклику руху (для touch/кнопок)
  const triggerMove = useCallback((direction: Direction) => {
    if (enabled && onMove) {
      onMove(direction);
    }
  }, [enabled, onMove]);

  return {
    triggerMove,
    pressedKeys: pressedKeys.current
  };
};