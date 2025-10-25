# 📤 Як завантажити проект на GitHub

## Крок 1: Створити репозиторій на GitHub

1. Зайдіть на [github.com](https://github.com)
2. Натисніть **"+"** → **"New repository"**
3. Заповніть:
   - Repository name: `labirynt` (або інша назва)
   - Description: "Ретро-гра лабіринт з музикою у стилі 90-х"
   - Public або Private (на ваш вибір)
   - ❌ **НЕ створюйте** README, .gitignore, license (вони вже є в проекті)
4. Натисніть **"Create repository"**

## Крок 2: Ініціалізувати Git локально

Відкрийте PowerShell у папці проекту (`D:\game\labirynt`) та виконайте:

```powershell
# Перевірити чи є git
git --version

# Якщо git не встановлений, завантажте з https://git-scm.com/download/win
```

## Крок 3: Налаштувати Git (якщо ще не налаштовано)

```powershell
git config --global user.name "Ваше Ім'я"
git config --global user.email "your.email@example.com"
```

## Крок 4: Завантажити проект на GitHub

```powershell
# Ініціалізувати git репозиторій
git init

# Додати всі файли
git add .

# Створити перший коміт
git commit -m "Initial commit: Maze game with 90s style music"

# Додати remote репозиторій (замініть YOUR_USERNAME на ваш логін GitHub)
git remote add origin https://github.com/YOUR_USERNAME/labirynt.git

# Перейменувати гілку на main (якщо потрібно)
git branch -M main

# Завантажити на GitHub
git push -u origin main
```

## Альтернатива: Завантаження через GitHub Desktop

1. Завантажте [GitHub Desktop](https://desktop.github.com/)
2. Відкрийте GitHub Desktop
3. File → Add Local Repository → Оберіть папку `D:\game\labirynt`
4. Publish repository → Оберіть назву та публічність
5. Натисніть **Publish repository**

## Крок 5: Перевірити

Відкрийте `https://github.com/YOUR_USERNAME/labirynt` - ваш проект має бути там!

## 📝 Подальші зміни

Після кожної зміни в коді:

```powershell
# Подивитись що змінилось
git status

# Додати змінені файли
git add .

# Створити коміт зі змінами
git commit -m "Опис ваших змін"

# Завантажити на GitHub
git push
```

## 🌐 Опублікувати гру онлайн (GitHub Pages)

```powershell
# Встановити gh-pages
npm install --save-dev gh-pages

# Додати в package.json scripts:
# "predeploy": "npm run build",
# "deploy": "gh-pages -d dist"

# Опублікувати
npm run deploy
```

Після цього гра буде доступна за адресою:
`https://YOUR_USERNAME.github.io/labirynt/`

## ❓ Проблеми?

### Помилка "failed to push"
```powershell
git pull origin main --rebase
git push
```

### Забули додати .gitignore
```powershell
# Видалити node_modules з відстеження
git rm -r --cached node_modules
git commit -m "Remove node_modules"
git push
```

### Великий розмір репозиторію
Переконайтеся що `.gitignore` містить:
```
node_modules
dist
*.log
```

---

Успіхів! 🚀
