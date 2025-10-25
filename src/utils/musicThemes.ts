/**
 * Колекція музичних тем у стилі ігор 90-х
 * Кожна тема має мелодію та бас-лінію
 */

interface Note {
  freq: number;
  duration: number;
}

export interface MusicTheme {
  name: string;
  description: string;
  melody: Note[];
  bassLine: Note[];
}

/**
 * 1. ADVENTURE THEME - Пригодницька тема (як у Super Mario)
 * Весела та енергійна мелодія
 */
const adventureTheme: MusicTheme = {
  name: 'Adventure',
  description: '🎮 Пригодницька тема - весела та енергійна (як Super Mario)',
  melody: [
    { freq: 659.25, duration: 0.15 }, // E5
    { freq: 659.25, duration: 0.15 }, // E5
    { freq: 659.25, duration: 0.3 },  // E5 (довша)
    { freq: 523.25, duration: 0.15 }, // C5
    { freq: 659.25, duration: 0.3 },  // E5
    { freq: 783.99, duration: 0.4 },  // G5
    { freq: 392.00, duration: 0.4 },  // G4
  ],
  bassLine: [
    { freq: 130.81, duration: 0.6 },  // C3
    { freq: 196.00, duration: 0.6 },  // G3
    { freq: 164.81, duration: 0.6 },  // E3
  ]
};

/**
 * 2. MYSTERIOUS DUNGEON - Таємничий підземний лабіринт
 * Темна та напружена атмосфера
 */
const mysteriousTheme: MusicTheme = {
  name: 'Mysterious',
  description: '🌑 Таємнича тема - темна атмосфера підземелля',
  melody: [
    { freq: 293.66, duration: 0.4 }, // D4
    { freq: 293.66, duration: 0.2 }, // D4
    { freq: 349.23, duration: 0.4 }, // F4
    { freq: 293.66, duration: 0.4 }, // D4
    { freq: 261.63, duration: 0.4 }, // C4
    { freq: 293.66, duration: 0.6 }, // D4
    { freq: 246.94, duration: 0.4 }, // B3
    { freq: 220.00, duration: 0.6 }, // A3
  ],
  bassLine: [
    { freq: 146.83, duration: 1.2 }, // D3
    { freq: 130.81, duration: 1.2 }, // C3
    { freq: 110.00, duration: 1.2 }, // A2
  ]
};

/**
 * 3. RETRO ARCADE - Класична аркадна тема
 * Швидка та ритмічна (як Pac-Man або Tetris)
 */
const retroArcadeTheme: MusicTheme = {
  name: 'Retro Arcade',
  description: '🕹️ Ретро аркада - швидка та ритмічна (як Tetris)',
  melody: [
    { freq: 659.25, duration: 0.25 }, // E5
    { freq: 493.88, duration: 0.25 }, // B4
    { freq: 523.25, duration: 0.25 }, // C5
    { freq: 587.33, duration: 0.5 },  // D5
    { freq: 523.25, duration: 0.25 }, // C5
    { freq: 493.88, duration: 0.25 }, // B4
    { freq: 440.00, duration: 0.5 },  // A4
    { freq: 440.00, duration: 0.25 }, // A4
    { freq: 523.25, duration: 0.25 }, // C5
    { freq: 659.25, duration: 0.5 },  // E5
    { freq: 587.33, duration: 0.25 }, // D5
    { freq: 523.25, duration: 0.25 }, // C5
    { freq: 493.88, duration: 0.75 }, // B4
  ],
  bassLine: [
    { freq: 164.81, duration: 1.0 },  // E3
    { freq: 220.00, duration: 1.0 },  // A3
    { freq: 164.81, duration: 1.0 },  // E3
    { freq: 146.83, duration: 1.0 },  // D3
  ]
};

/**
 * 4. EPIC QUEST - Епічний квест
 * Героїчна та мотивуюча мелодія
 */
const epicQuestTheme: MusicTheme = {
  name: 'Epic Quest',
  description: '⚔️ Епічний квест - героїчна та мотивуюча',
  melody: [
    { freq: 523.25, duration: 0.3 },  // C5
    { freq: 659.25, duration: 0.3 },  // E5
    { freq: 783.99, duration: 0.6 },  // G5
    { freq: 659.25, duration: 0.3 },  // E5
    { freq: 783.99, duration: 0.3 },  // G5
    { freq: 880.00, duration: 0.6 },  // A5
    { freq: 783.99, duration: 0.3 },  // G5
    { freq: 659.25, duration: 0.3 },  // E5
    { freq: 523.25, duration: 0.6 },  // C5
  ],
  bassLine: [
    { freq: 130.81, duration: 0.9 },  // C3
    { freq: 174.61, duration: 0.9 },  // F3
    { freq: 196.00, duration: 0.9 },  // G3
    { freq: 130.81, duration: 0.9 },  // C3
  ]
};

/**
 * 5. CHILL EXPLORATION - Спокійне дослідження
 * Розслаблююча та мелодійна тема
 */
const chillTheme: MusicTheme = {
  name: 'Chill',
  description: '🌿 Спокійна тема - розслаблююча та мелодійна',
  melody: [
    { freq: 523.25, duration: 0.4 },  // C5
    { freq: 587.33, duration: 0.4 },  // D5
    { freq: 523.25, duration: 0.4 },  // C5
    { freq: 440.00, duration: 0.8 },  // A4
    { freq: 493.88, duration: 0.4 },  // B4
    { freq: 523.25, duration: 0.4 },  // C5
    { freq: 587.33, duration: 0.8 },  // D5
    { freq: 523.25, duration: 0.8 },  // C5
  ],
  bassLine: [
    { freq: 130.81, duration: 1.6 },  // C3
    { freq: 220.00, duration: 1.6 },  // A3
    { freq: 146.83, duration: 1.6 },  // D3
  ]
};

/**
 * 6. SPEED RUN - Швидке проходження
 * Дуже швидка та інтенсивна
 */
const speedRunTheme: MusicTheme = {
  name: 'Speed Run',
  description: '⚡ Швидка тема - інтенсивна та драйвова',
  melody: [
    { freq: 783.99, duration: 0.15 }, // G5
    { freq: 659.25, duration: 0.15 }, // E5
    { freq: 783.99, duration: 0.15 }, // G5
    { freq: 880.00, duration: 0.3 },  // A5
    { freq: 783.99, duration: 0.15 }, // G5
    { freq: 659.25, duration: 0.15 }, // E5
    { freq: 523.25, duration: 0.3 },  // C5
    { freq: 659.25, duration: 0.15 }, // E5
    { freq: 783.99, duration: 0.15 }, // G5
    { freq: 880.00, duration: 0.3 },  // A5
    { freq: 1046.50, duration: 0.45 }, // C6
  ],
  bassLine: [
    { freq: 130.81, duration: 0.45 }, // C3
    { freq: 164.81, duration: 0.45 }, // E3
    { freq: 196.00, duration: 0.45 }, // G3
    { freq: 220.00, duration: 0.45 }, // A3
  ]
};

/**
 * 7. BOSS BATTLE - Битва з босом
 * Напружена та агресивна
 */
const bossBattleTheme: MusicTheme = {
  name: 'Boss Battle',
  description: '💀 Битва з босом - напружена та агресивна',
  melody: [
    { freq: 220.00, duration: 0.2 },  // A3
    { freq: 220.00, duration: 0.2 },  // A3
    { freq: 220.00, duration: 0.2 },  // A3
    { freq: 220.00, duration: 0.4 },  // A3
    { freq: 246.94, duration: 0.2 },  // B3
    { freq: 220.00, duration: 0.2 },  // A3
    { freq: 196.00, duration: 0.2 },  // G3
    { freq: 174.61, duration: 0.4 },  // F3
    { freq: 196.00, duration: 0.4 },  // G3
  ],
  bassLine: [
    { freq: 110.00, duration: 0.6 },  // A2
    { freq: 98.00, duration: 0.6 },   // G2
    { freq: 87.31, duration: 0.6 },   // F2
  ]
};

/**
 * Всі доступні теми
 */
export const MUSIC_THEMES = {
  adventure: adventureTheme,
  mysterious: mysteriousTheme,
  retroArcade: retroArcadeTheme,
  epicQuest: epicQuestTheme,
  chill: chillTheme,
  speedRun: speedRunTheme,
  bossBattle: bossBattleTheme
};

/**
 * Поточна активна тема (змініть тут для вибору іншої мелодії)
 */
export const CURRENT_MUSIC_THEME: MusicTheme = MUSIC_THEMES.epicQuest;

// Список всіх тем для швидкого перегляду
export const THEME_LIST = Object.values(MUSIC_THEMES);
