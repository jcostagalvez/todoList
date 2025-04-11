import React, { useState } from 'react'
import "../../../utils/css/emojiSelector.css";

interface Emoji {
  emoji: string;
  label: string;
}

interface EmojiSelectorProps {
  onEmojiSelect?: (emoji: string) => void;
}

const emojis: Emoji[] = [
  { emoji: '😍', label: 'Enamorado' },
  { emoji: '🚀', label: 'Cohete' }, 
  { emoji: '💻', label: 'Ordenador' },
  { emoji: '🔥', label: 'Fuego' },
  { emoji: '👷', label: 'Trabajando' },
  { emoji: '🧨', label: 'Explosivo' }
];

export const EmojiSelector: React.FC<EmojiSelectorProps> = ({ onEmojiSelect }) => {
  const [selectedEmoji, setSelectedEmoji] = useState<string>('');

  const handleClick = (emoji: string) => {
    setSelectedEmoji(emoji);
    if (onEmojiSelect) {
      onEmojiSelect(emoji);
    }
  };

  return (
    <div className="emoji-selector-container">
      <h2>Selecciona un Emoji</h2>
      <div className="emoji-grid">
        {emojis.map(({ emoji }) => (
          <button
            key={emoji}
            className={`emoji-button ${selectedEmoji === emoji ? 'selected' : ''}`}
            onClick={() => handleClick(emoji)}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};