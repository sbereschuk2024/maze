# 🔥 Налаштування Firebase для таблиці лідерів

## Крок 1: Створіть Firebase проект

1. Відкрийте https://console.firebase.google.com/
2. Натисніть **"Додати проект"** (Add project)
3. Введіть назву проекту: `maze-game` (або будь-яку іншу)
4. Google Analytics: можете вимкнути (не обов'язково)
5. Натисніть **"Створити проект"**

## Крок 2: Налаштуйте Realtime Database

1. У лівому меню оберіть **"Build" → "Realtime Database"**
2. Натисніть **"Створити базу даних"** (Create Database)
3. Оберіть локацію: **Europe (europe-west1)** або найближчу до вас
4. Режим безпеки: оберіть **"Start in test mode"** (поки що)
5. Натисніть **"Enable"**

## Крок 3: Налаштуйте правила безпеки

У розділі **"Rules"** замініть правила на ці:

```json
{
  "rules": {
    "leaderboard": {
      ".read": true,
      ".write": true,
      "$entryId": {
        ".validate": "newData.hasChildren(['playerName', 'time', 'date'])",
        "playerName": {
          ".validate": "newData.isString() && newData.val().length >= 2 && newData.val().length <= 20"
        },
        "time": {
          ".validate": "newData.isNumber() && newData.val() > 0"
        },
        "date": {
          ".validate": "newData.isString()"
        },
        "mazeSize": {
          ".validate": "newData.isString()"
        }
      }
    }
  }
}
```

Натисніть **"Publish"**

## Крок 4: Отримайте конфігураційні дані

1. У лівому меню натисніть ⚙️ **"Project Settings"** (біля "Project Overview")
2. Прокрутіть вниз до розділу **"Your apps"**
3. Натисніть на кнопку **`</>`** (Web)
4. Введіть назву додатку: `Maze Game`
5. **НЕ** вмикайте Firebase Hosting
6. Натисніть **"Register app"**
7. Скопіюйте код з розділу **"SDK setup and configuration"**

Ви побачите щось на кшталт:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "maze-game-xxxxx.firebaseapp.com",
  databaseURL: "https://maze-game-xxxxx-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "maze-game-xxxxx",
  storageBucket: "maze-game-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:xxxxxxxxxxxxxxxxxxxxx"
};
```

## Крок 5: Вставте конфігурацію у проект

1. Відкрийте файл: **`src/config/firebase.ts`**
2. Замініть плейсхолдери своїми даними:

```typescript
const firebaseConfig = {
  apiKey: "ВАШ_API_KEY",
  authDomain: "ВАШ_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://ВАШ_PROJECT_ID-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "ВАШ_PROJECT_ID",
  storageBucket: "ВАШ_PROJECT_ID.appspot.com",
  messagingSenderId: "ВАШ_MESSAGING_SENDER_ID",
  appId: "ВАШ_APP_ID"
};
```

3. Збережіть файл

## Крок 6: Запустіть проект

```bash
npm run dev
```

Відкрийте http://localhost:5173 та пограйте!

## Крок 7: Перевірте дані у Firebase

1. Поверніться до Firebase Console
2. Оберіть **"Realtime Database"**
3. У вкладці **"Data"** ви побачите структуру:

```
maze-game-xxxxx-default-rtdb
└── leaderboard
    ├── -NxxxxxXxxxxXxxxxXxxxx
    │   ├── playerName: "Захар"
    │   ├── time: 45.2
    │   ├── date: "2025-10-25T12:30:00.000Z"
    │   └── mazeSize: "24x18"
    └── -NxxxxxXxxxxXxxxxXxxxx
        └── ...
```

## Крок 8: Деплой на GitHub Pages

```bash
npm run deploy
```

## 🎯 Готово!

Тепер таблиця лідерів буде спільною для всіх гравців у реальному часі!

### Особливості:

- ✅ **Реальний час**: всі бачать оновлення миттєво
- ✅ **Глобальна**: доступна для всіх користувачів
- ✅ **Безкоштовна**: до 10GB трафіку/місяць
- ✅ **Автоочищення**: зберігає останні 100 результатів
- ✅ **Безпечна**: валідація даних на рівні Firebase

### Ліміти безкоштовного плану:

- 🔥 Spark Plan (безкоштовно):
  - 10GB/місяць завантаження
  - 1GB сховище
  - 100 одночасних підключень

Для невеликої гри цього більш ніж достатньо! 🚀

### Важливо для продакшену:

Коли будете готові до публікації, змініть правила безпеки на більш суворі:

```json
{
  "rules": {
    "leaderboard": {
      ".read": true,
      ".write": "auth != null || data.child('playerName').val().length <= 100"
    }
  }
}
```

Це дозволить читати всім, але писати тільки з обмеженням.
