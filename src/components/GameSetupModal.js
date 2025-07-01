import React, { useState } from 'react';
import './GameSetupModal.css';

const GameSetupModal = ({ onStart }) => {
  const [opponent, setOpponent] = useState('ai');
  const [side, setSide] = useState('white');

  const handleStart = () => {
    onStart({
      side: opponent === 'ai' ? side : null,
      opponent,
    });
  };

  return (
    <div className="game-setup-modal-backdrop">
      <div className="game-setup-modal">
        <h2>Start New Game</h2>
        <div className="setup-section">
          <label>Choose game mode:</label>
          <div className="setup-options">
            <button className={opponent === 'ai' ? 'active' : ''} onClick={() => setOpponent('ai')}>Play vs AI</button>
            <button className={opponent === 'friend' ? 'active' : ''} onClick={() => setOpponent('friend')}>Play with a Friend</button>
          </div>
        </div>
        {opponent === 'ai' && (
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
        )}
        <button className="start-btn primary-btn" onClick={handleStart}>
          Start Game
        </button>
      </div>
    </div>
  );
};

export default GameSetupModal; 