import { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import { CURRENT_MUSIC_THEME, type MusicTheme } from '../utils/musicThemes';

interface BackgroundMusicOptions {
  volume?: number;
  enabled?: boolean;
  theme?: MusicTheme; // Додаємо можливість вибору теми
}

/**
 * Хук для фонової музики у стилі ігор 90-х (8-bit)
 */
export const useBackgroundMusic = (options: BackgroundMusicOptions = {}) => {
  const { volume = 0.3, enabled = true, theme = CURRENT_MUSIC_THEME } = options;
  const audioContextRef = useRef<AudioContext | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const isPlayingRef = useRef(false); // Додаємо ref для актуального значення
  const [isMuted, setIsMuted] = useState(false);
  const isMutedRef = useRef(false); // Додаємо ref для актуального значення
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);
  const timeoutRef = useRef<number | null>(null); // Для очищення таймера

  // Використовуємо мелодію та бас з вибраної теми
  const melody = useMemo(() => theme.melody, [theme]);
  const bassLine = useMemo(() => theme.bassLine, [theme]);

  const stopMusic = useCallback(() => {
    // Очистити таймер повтору
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    oscillatorsRef.current.forEach(osc => {
      try {
        osc.stop();
      } catch {
        // Ігноруємо помилки при зупинці вже зупинених осциляторів
      }
    });
    oscillatorsRef.current = [];
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && enabled) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioContextRef.current = new AudioContextClass();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
      gainNodeRef.current.gain.value = volume;
    }

    return () => {
      stopMusic();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [enabled, volume, stopMusic]);

  const playMelody = useCallback(() => {
    if (!audioContextRef.current || !gainNodeRef.current || isMutedRef.current) return;

    const ctx = audioContextRef.current;
    const gainNode = gainNodeRef.current;
    let currentTime = ctx.currentTime;

    // Грати мелодію
    melody.forEach(note => {
      const oscillator = ctx.createOscillator();
      const noteGain = ctx.createGain();

      oscillator.connect(noteGain);
      noteGain.connect(gainNode);

      oscillator.frequency.value = note.freq;
      oscillator.type = 'square'; // 8-bit звук

      // Envelope для більш природного звучання
      noteGain.gain.setValueAtTime(0.15, currentTime);
      noteGain.gain.exponentialRampToValueAtTime(0.01, currentTime + note.duration);

      oscillator.start(currentTime);
      oscillator.stop(currentTime + note.duration);

      oscillatorsRef.current.push(oscillator);
      currentTime += note.duration;
    });

    // Грати бас-лінію (паралельно з мелодією)
    let bassTime = ctx.currentTime;
    bassLine.forEach(note => {
      const oscillator = ctx.createOscillator();
      const noteGain = ctx.createGain();

      oscillator.connect(noteGain);
      noteGain.connect(gainNode);

      oscillator.frequency.value = note.freq;
      oscillator.type = 'triangle'; // М'якший звук для басу

      noteGain.gain.setValueAtTime(0.1, bassTime);
      noteGain.gain.exponentialRampToValueAtTime(0.01, bassTime + note.duration);

      oscillator.start(bassTime);
      oscillator.stop(bassTime + note.duration);

      oscillatorsRef.current.push(oscillator);
      bassTime += note.duration;
    });

    // Розрахувати тривалість мелодії
    const melodyDuration = melody.reduce((acc, note) => acc + note.duration, 0);

    // Повторити мелодію через певний час (використовуємо ref для актуального значення)
    timeoutRef.current = setTimeout(() => {
      if (isPlayingRef.current && !isMutedRef.current) {
        playMelody();
      }
    }, melodyDuration * 1000);
  }, [melody, bassLine]);

  const startMusic = useCallback(() => {
    if (!audioContextRef.current) return;

    // Відновити AudioContext якщо він був зупинений
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }

    setIsPlaying(true);
    isPlayingRef.current = true; // Оновлюємо ref
    playMelody();
  }, [playMelody]);

  const pauseMusic = useCallback(() => {
    setIsPlaying(false);
    isPlayingRef.current = false; // Оновлюємо ref
    stopMusic();
  }, [stopMusic]);

  const toggleMusic = useCallback(() => {
    if (isPlaying) {
      pauseMusic();
    } else {
      startMusic();
    }
  }, [isPlaying, startMusic, pauseMusic]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const newMuted = !prev;
      isMutedRef.current = newMuted; // Оновлюємо ref
      if (newMuted) {
        stopMusic();
      } else if (isPlayingRef.current) {
        playMelody();
      }
      return newMuted;
    });
  }, [stopMusic, playMelody]);

  const setVolume = useCallback((newVolume: number) => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = Math.max(0, Math.min(1, newVolume));
    }
  }, []);

  return {
    startMusic,
    pauseMusic,
    toggleMusic,
    toggleMute,
    setVolume,
    isPlaying,
    isMuted
  };
};
