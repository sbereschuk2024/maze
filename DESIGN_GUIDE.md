# 🎨 Гід по кастомізації дизайну лабіринту

## 📋 Швидке переключення тем

Відкрийте файл `src/utils/canvasHelpers.ts` і знайдіть рядок:

```typescript
export const CURRENT_THEME = MAZE_THEMES.classic;
```

Замініть `classic` на одну з доступних тем:

### Доступні теми:

1. **classic** (за замовчуванням) 🎨
   - Синьо-сірий класичний стиль
   - Чіткі кольори, добра контрастність

2. **dark** 🌑
   - Темна елегантна тема
   - Глибокі сині відтінки
   - Неонові акценти

3. **neon** 💫
   - Футуристичний неоновий стиль
   - Яскраві кольори на темному фоні
   - Кіберпанк естетика

4. **forest** 🌲
   - Природна зелена тема
   - Лісові відтінки
   - М'які контрасти

5. **candy** 🍬
   - Яскрава солодка тема
   - Пастельні кольори
   - Веселий дизайн

6. **ocean** 🌊
   - Морська тема
   - Блакитно-бірюзові відтінки
   - Спокійні кольори

## 🎨 Як створити свою тему

1. Відкрийте `src/utils/canvasHelpers.ts`
2. Знайдіть об'єкт `MAZE_THEMES`
3. Додайте нову тему:

```typescript
export const MAZE_THEMES = {
  // ... існуючі теми ...
  
  myCustomTheme: {
    wall: '#вашКолір',        // Колір стін
    path: '#вашКолір',        // Колір доріжок
    start: '#вашКолір',       // Колір старту (зелений)
    finish: '#вашКолір',      // Колір фінішу (червоний)
    player: '#вашКолір',      // Колір гравця (синій)
    gridColor: '#вашКолір',   // Колір сітки
    background: '#вашКолір'   // Колір фону
  }
};
```

4. Активуйте тему:

```typescript
export const CURRENT_THEME = MAZE_THEMES.myCustomTheme;
```

## 🖌️ Додаткові налаштування стилю

### Змінити товщину ліній сітки

У функції `drawCell` (рядок ~90):

```typescript
ctx.lineWidth = 1;  // Змініть на 0 для видалення сітки, або 2-3 для товщих ліній
```

### Заокруглені кути

Додайте перед `fillRect`:

```typescript
ctx.beginPath();
ctx.roundRect(x, y, cellSize, cellSize, 5); // 5 - радіус заокруглення
ctx.fill();
```

### Градієнти замість однотонних кольорів

```typescript
const gradient = ctx.createLinearGradient(x, y, x + cellSize, y + cellSize);
gradient.addColorStop(0, '#колір1');
gradient.addColorStop(1, '#колір2');
ctx.fillStyle = gradient;
```

### Змінити форму гравця

У функції `drawPlayer` (рядок ~120):

Замість кола, можна малювати квадрат, трикутник або інші форми:

```typescript
// Квадрат
ctx.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);

// Трикутник
ctx.beginPath();
ctx.moveTo(centerX, centerY - radius);
ctx.lineTo(centerX - radius, centerY + radius);
ctx.lineTo(centerX + radius, centerY + radius);
ctx.closePath();
ctx.fill();
```

## 💡 Корисні поради

- **Використовуйте онлайн інструменти для підбору кольорів:**
  - [Coolors.co](https://coolors.co)
  - [Adobe Color](https://color.adobe.com)
  
- **Перевіряйте контрастність** між стінами та доріжками

- **Тестуйте на мобільних пристроях** - деякі кольори можуть виглядати інакше

- **Зберігайте гарну видимість гравця** - він має бути чітко видимим

## 🔄 Зміни застосовуються автоматично

Після збереження файлу, Vite автоматично перезавантажить сторінку з новим дизайном!
