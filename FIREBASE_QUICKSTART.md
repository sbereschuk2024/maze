# ⚡ Швидкий старт Firebase

**Важливо!** Проект використовує Firebase Realtime Database для зберігання таблиці лідерів.

## 🚀 Щоб запустити проект:

### 1. Налаштуйте Firebase (5 хвилин)

Дотримуйтесь інструкцій у файлі **[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)**

### 2. Вставте свої Firebase ключі

Відкрийте файл **`src/config/firebase.ts`** і замініть:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",           // ← Вставте свій ключ
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 3. Запустіть проект

```bash
npm install
npm run dev
```

### 4. Деплой

```bash
npm run deploy
```

---

## 🎮 Без Firebase (тільки локально)

Якщо не хочете налаштовувати Firebase зараз, закоментуйте рядки у `MazeGame.tsx`:

```typescript
// import { addFirebaseLeaderboardEntry } from '../../utils/firebaseLeaderboard';
import { addLeaderboardEntry } from '../../utils/leaderboard';

// У useEffect замініть:
// addFirebaseLeaderboardEntry(...) 
// на:
addLeaderboardEntry(playerName || 'Анонім', gameTime);
```

І у `Leaderboard.tsx`:

```typescript
// import { subscribeToLeaderboard } from '../../utils/firebaseLeaderboard';
import { getTopEntries } from '../../utils/leaderboard';

// Замініть useEffect на:
const entries = getTopEntries(limit);
```

Тоді дані будуть зберігатися тільки у localStorage браузера.

---

## 📝 Примітка

Firebase потрібен тільки для **спільної глобальної** таблиці лідерів.  
Без нього гра працює на 100%, але кожен гравець бачить тільки свої результати.
