import React, { useState } from 'react';
import './PlayerNameInput.css';

interface PlayerNameInputProps {
  onSubmit: (name: string) => void;
}

export const PlayerNameInput: React.FC<PlayerNameInputProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (trimmedName) {
      onSubmit(trimmedName);
    } else {
      onSubmit('Анонім');
    }
  };

  return (
    <div className="player-name-container">
      <h2 className="player-name-title">👤 Введіть своє ім'я</h2>
      <form onSubmit={handleSubmit} className="player-name-form">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ваше ім'я..."
          maxLength={20}
          className="player-name-input"
          autoFocus
        />
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
