import React from 'react';
import './GameControls.css';
import newGameIcon from '../icons/new-game.png';
import resignIcon from '../icons/resign.png';
import suggestionsIcon from '../icons/suggestions.png';

const GameControls = ({
  onReset,
  onResign,
  onSuggestions,
  gameMode,
  aiDifficulty,
  isLoading,
  gameState,
  gameResult,
}) => {
  return (
    <div className="game-controls centered-controls">
      <div className="controls-actions spaced-actions">
        <button className="controls-btn" onClick={onReset} disabled={isLoading}>
          <span className="btn-icon">
            <img src={newGameIcon} alt="New Game" className="icon-img" />
          </span>
          New Game
        </button>
        <button className="controls-btn" onClick={onResign} disabled={isLoading || !gameState || gameResult}>
          <span className="btn-icon">
            <img src={resignIcon} alt="Resign" className="icon-img" />
          </span>
          Resign
        </button>
        <button className="controls-btn" onClick={onSuggestions} disabled={isLoading || !gameState || gameResult}>
          <span className="btn-icon">
            <img src={suggestionsIcon} alt="Suggestions" className="icon-img" />
          </span>
          Suggestions
        </button>
      </div>
      <div className="game-status-card">
        <div className="controls-row current-mode-row">
          <span className="controls-label">Current Mode:</span>
          <span className="controls-value">
            {gameMode === 'ai' ? 'vs AI' : 'Friend'}
            {gameMode === 'ai' && (
              <span className="controls-difficulty"> &middot; {aiDifficulty.charAt(0).toUpperCase() + aiDifficulty.slice(1)} AI</span>
            )}
          </span>
        </div>
        <div className="controls-row controls-status">
          <span className="controls-label">Status:</span>
          <span className="controls-value">{gameState?.game_state ? gameState.game_state.charAt(0).toUpperCase() + gameState.game_state.slice(1) : '--'}</span>
        </div>
        <div className="controls-row controls-status">
          <span className="controls-label">Turn:</span>
          <span className="controls-value">{gameState?.current_player ? gameState.current_player.charAt(0).toUpperCase() + gameState.current_player.slice(1) : '--'}</span>
        </div>
      </div>
    </div>
  );
};

export default GameControls; 