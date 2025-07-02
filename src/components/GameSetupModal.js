import React, { useState } from 'react';
import './GameSetupModal.css';

const AI_DIFFICULTIES = [
  { label: 'Easy', value: 'easy' },
  { label: 'Medium', value: 'medium' },
  { label: 'Hard', value: 'hard' },
  { label: 'Extreme', value: 'expert' },
];

const GameSetupModal = ({ onStart }) => {
  const [opponent, setOpponent] = useState('ai');
  const [side, setSide] = useState('white');
  const [difficulty, setDifficulty] = useState('medium');

  const handleStart = () => {
    onStart({
      side: opponent === 'ai' ? side : null,
      opponent,
      difficulty: opponent === 'ai' ? difficulty : undefined,
    });
  };

  return (
    <div className="game-setup-modal-backdrop">
      <div className="game-setup-modal">
        <h2>Start New Game</h2>
        <div className="setup-section">
          <label>Choose game mode:</label>
          <div className="setup-options">
            <button className={opponent === 'ai' ? 'active' : ''} onClick={() => setOpponent('ai')}>
              <span style={{display: 'flex', alignItems: 'center', marginRight: 6}}>
                {/* New Robot/AI SVG (black) */}
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="4" y="7" width="14" height="8" rx="3" fill="#222" stroke="#222" strokeWidth="1.5"/>
                  <rect x="9" y="2" width="4" height="4" rx="2" fill="#222"/>
                  <rect x="7" y="15" width="2" height="2" rx="1" fill="#222"/>
                  <rect x="13" y="15" width="2" height="2" rx="1" fill="#222"/>
                  <circle cx="8.5" cy="11" r="1" fill="#fff"/>
                  <circle cx="13.5" cy="11" r="1" fill="#fff"/>
                  <rect x="10" y="10" width="2" height="1" rx="0.5" fill="#fff"/>
                </svg>
              </span>
              Play with AI
            </button>
            <button className={opponent === 'friend' ? 'active' : ''} onClick={() => setOpponent('friend')}>
              <span style={{display: 'flex', alignItems: 'center', marginRight: 6}}>
                {/* Friends/People SVG (black) */}
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="7" cy="10" r="3" fill="#222"/>
                  <circle cx="15" cy="10" r="3" fill="#fff" stroke="#222" strokeWidth="1.5"/>
                  <rect x="2" y="15" width="10" height="4" rx="2" fill="#fff" stroke="#222" strokeWidth="1.5"/>
                  <rect x="10" y="15" width="10" height="4" rx="2" fill="#fff" stroke="#222" strokeWidth="1.5"/>
                </svg>
              </span>
              Play with a Friend
            </button>
          </div>
        </div>
        {opponent === 'ai' && (
          <>
            <div className="setup-section">
              <label>Play as:</label>
              <div className="setup-options">
                <button className={side === 'white' ? 'active' : ''} onClick={() => setSide('white')}>
                  <span className="side-btn-icon">
                    <img src="/pieces/wP.png" alt="White Pawn" style={{width: 22, height: 22}} />
                  </span>
                  White
                </button>
                <button className={side === 'black' ? 'active' : ''} onClick={() => setSide('black')}>
                  <span className="side-btn-icon">
                    <img src="/pieces/bP.png" alt="Black Pawn" style={{width: 22, height: 22}} />
                  </span>
                  Black
                </button>
                <button className={side === 'random' ? 'active' : ''} onClick={() => setSide('random')}>
                  <span className="side-btn-icon" style={{display: 'flex', alignItems: 'center', gap: '0.1em'}}>
                    <img src="/pieces/wP.png" alt="White Pawn" style={{width: 20, height: 20, marginRight: '-4px'}} />
                    <img src="/pieces/bP.png" alt="Black Pawn" style={{width: 20, height: 20, marginLeft: '-4px'}} />
                  </span>
                  Random
                </button>
              </div>
            </div>
            <div className="setup-section">
              <label>AI Difficulty:</label>
              <div className="setup-options ai-difficulty-grid">
                {AI_DIFFICULTIES.map(opt => (
                  <button
                    key={opt.value}
                    className={difficulty === opt.value ? 'active' : ''}
                    onClick={() => setDifficulty(opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
        <button className="start-btn primary-btn" onClick={handleStart}>
          Start Game
        </button>
      </div>
    </div>
  );
};

export default GameSetupModal; 