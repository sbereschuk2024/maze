# 🔊 Гід по звукових ефектах

## ✅ Що вже працює

Звуки автоматично додано до гри! У вас є:

1. **🎵 Звук руху** - при кожному кроці гравця
2. **🏆 Звук перемоги** - мелодія при досягненні фінішу
3. **⏸️ Звук паузи** - при натисканні ESC
4. **🔄 Звук рестарту** - при початку нової гри
5. **🔇/🔊 Кнопка вимкнення звуку** - фіолетова кнопка в UI

## 🎮 Керування звуком

- **Кнопка "🔊 Звук"** - перемикає звук (🔇 коли вимкнено)
- Звуки генеруються браузером через Web Audio API
- Не потрібні зовнішні аудіофайли!

## 🔧 Налаштування звуків

### Зміна гучності

Відкрийте `src/components/Game/MazeGame.tsx` (рядок ~27):

```typescript
const { playSound, toggleMute, isMuted } = useSound({
  volume: 0.3,  // Змініть від 0.0 (тихо) до 1.0 (голосно)
  enabled: true
});
```

### Вимкнути звуки за замовчуванням

```typescript
const { playSound, toggleMute, isMuted } = useSound({
  volume: 0.3,
  enabled: false  // Звуки вимкнені
});
```

## 🎵 Кастомізація звуків

Відкрийте `src/hooks/useSound.ts` для зміни звуків:

### 1. Звук руху (рядок ~43)

```typescript
const playMoveSound = useCallback(() => {
  // ...
  oscillator.frequency.value = 400; // Змініть частоту (200-800 Hz)
  oscillator.type = 'sine';         // Тип: 'sine', 'square', 'triangle', 'sawtooth'
  // ...
```

**Типи хвиль:**
- `sine` - м'який, чистий звук
- `square` - різкий, електронний
- `triangle` - середній між sine і square
- `sawtooth` - насичений, багатий тембр

### 2. Звук перемоги (рядок ~83)

```typescript
const playWinSound = useCallback(() => {
  // Ноти мелодії (До, Ре, Мі, Соль)
  const notes = [523.25, 587.33, 659.25, 783.99];
  
  // Можна змінити на інші ноти:
  // До = 261.63, Ре = 293.66, Мі = 329.63
  // Фа = 349.23, Соль = 392.00, Ля = 440.00, Сі = 493.88
```

### 3. Додати новий звук

Додайте нову функцію в `useSound.ts`:

```typescript
const playNewSound = useCallback(() => {
  if (!enabled || isMuted || !audioContextRef.current) return;

  const ctx = audioContextRef.current;
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.frequency.value = 600;  // Ваша частота
  oscillator.type = 'sine';           // Ваш тип

  gainNode.gain.setValueAtTime(currentVolume * 0.3, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.2);
}, [enabled, isMuted, currentVolume]);

// Додайте до return:
return {
  // ... інші звуки
  playNewSound
};
```

## 🎼 Використання зовнішніх аудіофайлів

Якщо хочете використовувати справжні аудіофайли (MP3, WAV):

1. **Додайте файли в `public/sounds/`:**
   ```
   public/
   └── sounds/
       ├── move.mp3
       ├── win.mp3
       ├── pause.mp3
       └── start.mp3
   ```

2. **Створіть новий хук `useAudioFiles.ts`:**

```typescript
import { useCallback, useRef, useState } from 'react';

export const useAudioFiles = (volume: number = 0.5) => {
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});
  const [isMuted, setIsMuted] = useState(false);

  const loadSound = useCallback((name: string, path: string) => {
    const audio = new Audio(path);
    audio.volume = volume;
    audioRefs.current[name] = audio;
  }, [volume]);

  const playSound = useCallback((name: string) => {
    if (isMuted) return;
    const audio = audioRefs.current[name];
    if (audio) {
      audio.currentTime = 0;
      audio.play();
    }
  }, [isMuted]);

  // Завантажити всі звуки
  useEffect(() => {
    loadSound('move', '/sounds/move.mp3');
    loadSound('win', '/sounds/win.mp3');
    loadSound('pause', '/sounds/pause.mp3');
    loadSound('start', '/sounds/start.mp3');
  }, [loadSound]);

  return { playSound, toggleMute: () => setIsMuted(p => !p), isMuted };
};
```

## 🎯 Рекомендації

### Для кращого досвіду:

1. **Не робіть звуки надто гучними** - 0.3 оптимально
2. **Звук руху має бути коротким** (0.1-0.15 сек)
3. **Звук перемоги може бути довшим** (1-2 сек)
4. **Додайте затухання** (exponentialRampToValueAtTime)

### Частоти для різних звуків:

- **Позитивні дії** (рух, збір предметів): 400-600 Hz, sine
- **Негативні дії** (помилки, зіткнення): 100-200 Hz, square
- **Перемога**: мелодія з нот 500-800 Hz, sine
- **UI звуки** (кнопки, меню): 300-400 Hz, triangle

## 🐛 Відлагодження

### Звуки не відтворюються?

1. **Перевірте консоль браузера** - можуть бути помилки
2. **Переконайтеся що звук увімкнений** в браузері
3. **Деякі браузери блокують автовідтворення** - потрібна взаємодія користувача
4. **Safari може вимагати префікс** - вже додано `webkitAudioContext`

### Звуки відтворюються з затримкою?

- Використовуйте Web Audio API (вже реалізовано)
- Уникайте `new Audio()` для частих звуків
- Переконайтеся що `audioContext` створений один раз

## 📚 Додаткові ресурси

- [Web Audio API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Частоти музичних нот](https://pages.mtu.edu/~suits/notefreqs.html)
- [Безкоштовні звукові ефекти](https://freesound.org)

## 🎵 Приклади мелодій

### Мелодія перемоги (Super Mario):
```typescript
const notes = [659.25, 659.25, 0, 659.25, 0, 523.25, 659.25, 0, 783.99];
// Мі, Мі, пауза, Мі, пауза, До, Мі, пауза, Соль
```

### Мелодія старту (Space Invaders):
```typescript
const notes = [220, 196, 185, 165];
// Ля, Соль, Фа#, Мі
```
