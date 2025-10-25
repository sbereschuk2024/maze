# 🗺️ Гід по алгоритмах генерації лабіринтів

## 🚀 Швидка зміна алгоритму

Відкрийте файл `src/hooks/useGameState.ts` і знайдіть функцію `createInitialGameState` (приблизно рядок 100).

Змініть рядок:
```typescript
const maze = generateRecursiveBacktrackingMaze(settings.mazeWidth, settings.mazeHeight);
```

## 📋 Доступні алгоритми

### 1. **generateRandomMaze** 🎲
```typescript
const maze = generateRandomMaze(settings.mazeWidth, settings.mazeHeight);
```
**Характеристика:**
- ✅ Найпростіший
- ✅ Швидкий
- ⚠️ Випадкові стіни (20% шанс)
- ⚠️ Може бути нерозв'язний
- 🎮 **Складність:** ЛЕГКО

**Коли використовувати:** Для тестування, швидкого прототипування

---

### 2. **generateRecursiveBacktrackingMaze** 🌀 (РЕКОМЕНДОВАНО)
```typescript
const maze = generateRecursiveBacktrackingMaze(settings.mazeWidth, settings.mazeHeight);
```
**Характеристика:**
- ✅ Класичний алгоритм
- ✅ Завжди розв'язний
- ✅ Довгі коридори
- ✅ Високої якості
- 🎮 **Складність:** СЕРЕДНЬО-ВАЖКО

**Коли використовувати:** Для класичних лабіринтів з одним шляхом

**Як працює:** 
1. Починає з випадкової точки
2. Випадково вибирає напрямок
3. Прокладає шлях
4. Якщо зайшов у глухий кут - повертається назад
5. Продовжує поки весь лабіринт не згенерований

---

### 3. **generateRoomsAndCorridorsMaze** 🏛️
```typescript
const maze = generateRoomsAndCorridorsMaze(settings.mazeWidth, settings.mazeHeight);
```
**Характеристика:**
- ✅ Створює кімнати (3-6 клітинок)
- ✅ З'єднує їх коридорами
- ✅ Цікавий геймплей
- ✅ Багато відкритого простору
- 🎮 **Складність:** ЛЕГКО-СЕРЕДНЬО

**Коли використовувати:** Для RPG-стилю, dungeon crawlers

**Параметри:**
- Кількість кімнат залежить від розміру лабіринту
- Формула: `(width × height) / 80`

---

### 4. **generatePrimsMaze** 🌳
```typescript
const maze = generatePrimsMaze(settings.mazeWidth, settings.mazeHeight);
```
**Характеристика:**
- ✅ Випадкове мінімальне дерево
- ✅ Завжди розв'язний
- ✅ Більш "органічний" вигляд
- ✅ Коротші шляхи ніж Recursive Backtracking
- 🎮 **Складність:** СЕРЕДНЬО

**Коли використовувати:** Для більш хаотичних лабіринтів

**Як працює:**
1. Починає з випадкової клітинки
2. Додає сусідні стіни до списку
3. Випадково вибирає стіну зі списку
4. Якщо за стіною невідвіданий шлях - видаляє стіну
5. Продовжує поки є стіни у списку

---

## 🎯 Порівняння алгоритмів

| Алгоритм | Складність | Швидкість | Якість | Типові шляхи |
|----------|------------|-----------|--------|--------------|
| Random | ⭐ | ⚡⚡⚡ | ⭐⭐ | Випадкові |
| Recursive Backtracking | ⭐⭐⭐⭐ | ⚡⚡ | ⭐⭐⭐⭐⭐ | Довгі |
| Rooms & Corridors | ⭐⭐ | ⚡⚡⚡ | ⭐⭐⭐ | Прямі |
| Prims | ⭐⭐⭐ | ⚡⚡ | ⭐⭐⭐⭐ | Середні |

## ⚙️ Налаштування складності

У файлі `src/hooks/useGameState.ts` змініть розмір лабіринту:

```typescript
const { gameState, movePlayer, togglePause, resetGame } = useGameState({
  mazeWidth: 20,   // Ширина (10-40)
  mazeHeight: 15   // Висота (10-30)
});
```

**Рекомендації:**
- **Легко:** 10×10 до 15×12
- **Середньо:** 20×15 до 25×20
- **Важко:** 30×25 до 40×30

## 🔧 Створення власного алгоритму

1. Відкрийте `src/utils/mazeGenerators.ts`
2. Додайте нову функцію:

```typescript
export function generateMyCustomMaze(width: number, height: number): MazeCell[][] {
  const maze: MazeCell[][] = [];
  
  // 1. Ініціалізація (стіни або шляхи)
  for (let y = 0; y < height; y++) {
    const row: MazeCell[] = [];
    for (let x = 0; x < width; x++) {
      row.push({ 
        type: CellType.WALL,  // або CellType.PATH
        position: { x, y } 
      });
    }
    maze.push(row);
  }
  
  // 2. Ваша логіка генерації
  // ...
  
  // 3. Встановити старт і фініш
  maze[1][1].type = CellType.START;
  maze[height - 2][width - 2].type = CellType.FINISH;
  
  return maze;
}
```

3. Додайте експорт в `src/hooks/useGameState.ts`
4. Використайте в `createInitialGameState`

## 💡 Поради

- **Для новачків:** Використовуйте Random або Rooms & Corridors
- **Для досвідчених:** Recursive Backtracking
- **Для максимальної складності:** Збільште розмір + Recursive Backtracking
- **Для швидких ігор:** Rooms & Corridors з малим розміром

## 🐛 Відлагодження

Якщо лабіринт не генерується правильно:

1. Перевірте що старт і фініш встановлені
2. Переконайтеся що є шлях між ними
3. Перевірте межі масиву (0 до width-1, 0 до height-1)
4. Зверніть увагу на стіни по периметру

## 📊 Приклади налаштувань

**Швидка гра (2-3 хв):**
```typescript
mazeWidth: 15, mazeHeight: 12
// Алгоритм: generateRoomsAndCorridorsMaze
```

**Класична гра (5-7 хв):**
```typescript
mazeWidth: 25, mazeHeight: 20
// Алгоритм: generateRecursiveBacktrackingMaze
```

**Хардкор (10+ хв):**
```typescript
mazeWidth: 40, mazeHeight: 30
// Алгоритм: generateRecursiveBacktrackingMaze
```
