// Список заборонених слів (можна розширювати)
const profanityList = [
  // Українські
  'блять', 'бляд', 'хуй', 'хуя', 'піда', 'сука', 'пизд', 'єбат', 'їбат', 'ебат',
  'гандон', 'мудак', 'дебіл', 'ідіот', 'лайно', 'срака', 'жопа', 'довб', 'курв',
  'шлюх', 'падл', 'сволоч', 'муділ', 'чмир', 'чмо', 'йобан', 'йоба',
  
  // Російські (транслітерація)
  'сука', 'блядь', 'хуй', 'пизда', 'ебать', 'мудак', 'гандон', 'идиот',
  'сволочь', 'курва', 'шлюха', 'падла', 'дурак',
  
  // Англійські
  'fuck', 'shit', 'bitch', 'ass', 'damn', 'crap', 'dick', 'cock', 'pussy',
  'bastard', 'asshole', 'retard', 'idiot', 'stupid', 'dumb', 'moron',
  
  // Варіації з цифрами та символами (латиниця + кирилиця)
  'f*ck', 'sh*t', 'b*tch', 'a$$', '@ss', 'fck', 'fuk', 'fcuk',
  'xuj', 'hui', 'blyat', 'suka', 'pizda', 'ebat'
];

/**
 * Нормалізує текст для перевірки (прибирає пробіли, спецсимволи, приводить до нижнього регістру)
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\wа-яїієґ]/gi, '') // Прибираємо всі спецсимволи, зберігаємо кирилицю
    .replace(/[0o]/g, 'o') // Заміна цифр на літери
    .replace(/[1l!|іі]/g, 'i') // і та ї також можуть бути заміною
    .replace(/[3eеє]/g, 'e') // українські е та є
    .replace(/[4a@а]/g, 'a') // українська а
    .replace(/[5s$]/g, 's')
    .replace(/[7t]/g, 't')
    .replace(/[8b]/g, 'b')
    .replace(/[уu]/g, 'u') // українська у
    .replace(/[хx]/g, 'x') // українська х
    .replace(/[сc]/g, 'c'); // українська с
}

/**
 * Перевіряє чи містить текст погані слова
 */
export function containsProfanity(text: string): boolean {
  const normalized = normalizeText(text);
  
  return profanityList.some(badWord => {
    const normalizedBadWord = normalizeText(badWord);
    return normalized.includes(normalizedBadWord);
  });
}

/**
 * Перевіряє валідність імені гравця
 */
export function validatePlayerName(name: string): {
  isValid: boolean;
  error?: string;
} {
  // Перевірка на порожнє ім'я
  if (!name || name.trim().length === 0) {
    return {
      isValid: false,
      error: "Ім'я не може бути порожнім"
    };
  }

  // Перевірка мінімальної довжини
  if (name.trim().length < 2) {
    return {
      isValid: false,
      error: "Ім'я має містити мінімум 2 символи"
    };
  }

  // Перевірка максимальної довжини
  if (name.length > 20) {
    return {
      isValid: false,
      error: "Ім'я має містити максимум 20 символів"
    };
  }

  // Перевірка на погані слова
  if (containsProfanity(name)) {
    return {
      isValid: false,
      error: "Ім'я містить недопустимі слова. Будь ласка, оберіть інше ім'я"
    };
  }

  // Перевірка на тільки пробіли/спецсимволи
  if (!/[a-zа-яїієґ0-9]/i.test(name)) {
    return {
      isValid: false,
      error: "Ім'я має містити хоча б одну літеру або цифру"
    };
  }

  return { isValid: true };
}

/**
 * Очищає ім'я від зайвих пробілів
 */
export function sanitizeName(name: string): string {
  return name.trim().replace(/\s+/g, ' ');
}
