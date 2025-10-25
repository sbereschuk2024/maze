import { useCallback, useRef, useState, useEffect } from 'react';

export type SoundType = 'move' | 'wall' | 'win' | 'start' | 'pause';

interface UseSoundOptions {
  volume?: number;
  enabled?: boolean;
}

/**
 * Хук для управління звуками в грі
 */
export const useSound = (options: UseSoundOptions = {}) => {
  const { volume = 0.5, enabled = true } = options;
  const [isMuted, setIsMuted] = useState(false);
  const [currentVolume, setCurrentVolume] = useState(volume);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Створюємо AudioContext для генерації звуків
    if (typeof window !== 'undefined' && enabled) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioContextRef.current = new AudioContextClass();
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [enabled]);

  /**
   * Генерація звуку руху
   */
  const playMoveSound = useCallback(() => {
    if (!enabled || isMuted || !audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = 400; // Частота звуку
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(currentVolume * 0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.1);
  }, [enabled, isMuted, currentVolume]);

  /**
   * Звук зіткнення зі стіною
   */
  const playWallSound = useCallback(() => {
    if (!enabled || isMuted || !audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = 150; // Нижча частота
    oscillator.type = 'square';

    gainNode.gain.setValueAtTime(currentVolume * 0.5, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.15);
  }, [enabled, isMuted, currentVolume]);

  /**
   * Звук перемоги
   */
  const playWinSound = useCallback(() => {
    if (!enabled || isMuted || !audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const notes = [523.25, 587.33, 659.25, 783.99]; // До, Ре, Мі, Соль

    notes.forEach((freq, index) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = freq;
      oscillator.type = 'sine';

      const startTime = ctx.currentTime + index * 0.15;
      gainNode.gain.setValueAtTime(currentVolume * 0.4, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

      oscillator.start(startTime);
      oscillator.stop(startTime + 0.3);
    });
  }, [enabled, isMuted, currentVolume]);

  /**
   * Звук старту гри
   */
  const playStartSound = useCallback(() => {
    if (!enabled || isMuted || !audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = 440;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(currentVolume * 0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.2);
  }, [enabled, isMuted, currentVolume]);

  /**
   * Звук паузи
   */
  const playPauseSound = useCallback(() => {
    if (!enabled || isMuted || !audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = 300;
    oscillator.type = 'triangle';

    gainNode.gain.setValueAtTime(currentVolume * 0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.15);
  }, [enabled, isMuted, currentVolume]);

  /**
   * Універсальна функція для відтворення звуку
   */
  const playSound = useCallback((soundType: SoundType) => {
    switch (soundType) {
      case 'move':
        playMoveSound();
        break;
      case 'wall':
        playWallSound();
        break;
      case 'win':
        playWinSound();
        break;
      case 'start':
        playStartSound();
        break;
      case 'pause':
        playPauseSound();
        break;
    }
  }, [playMoveSound, playWallSound, playWinSound, playStartSound, playPauseSound]);

  /**
   * Перемикання звуку
   */
  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  /**
   * Зміна гучності
   */
  const setVolume = useCallback((newVolume: number) => {
    setCurrentVolume(Math.max(0, Math.min(1, newVolume)));
  }, []);

  return {
    playSound,
    playMoveSound,
    playWallSound,
    playWinSound,
    playStartSound,
    playPauseSound,
    toggleMute,
    setVolume,
    isMuted,
    volume: currentVolume
  };
};