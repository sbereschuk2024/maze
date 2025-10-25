import React, { useState } from 'react';
import { validatePlayerName, sanitizeName } from '../../utils/profanityFilter';
import './PlayerNameInput.css';

interface PlayerNameInputProps {
  onSubmit: (name: string) => void;
}

export const PlayerNameInput: React.FC<PlayerNameInputProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const cleanedName = sanitizeName(name);
    
    // Якщо ім'я порожнє, використовуємо "Анонім"
    if (!cleanedName) {
      onSubmit('Анонім');
      return;
    }
    
    // Валідація імені
    const validation = validatePlayerName(cleanedName);
    
    if (!validation.isValid) {
      setError(validation.error || 'Некоректне ім\'я');
      return;
    }
    
    // Якщо все ок, відправляємо
    setError(null);
    onSubmit(cleanedName);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    // Очищаємо помилку при зміні
    if (error) {
      setError(null);
    }
  };

  return (
    <div className="player-name-container">
      <h2 className="player-name-title">👤 Введіть своє ім'я</h2>
      <form onSubmit={handleSubmit} className="player-name-form">
        <input
          type="text"
          value={name}
          onChange={handleChange}
          placeholder="Ваше ім'я..."
          maxLength={20}
          className={`player-name-input ${error ? 'error' : ''}`}
          autoFocus
        />
        {error && (
          <div className="player-name-error">
            ⚠️ {error}
          </div>
        )}
        <button type="submit" className="player-name-submit">
          ✅ Продовжити
        </button>
      </form>
      <p className="player-name-hint">
        Ваш результат буде збережено в таблиці лідерів
      </p>
    </div>
  );
};
