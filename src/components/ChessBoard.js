import React, { useState, useEffect } from 'react';
import ChessSquare from './ChessSquare';
import './ChessBoard.css';

const ChessBoard = ({ 
  gameState, 
  selectedSquare, 
  validMoves, 
  onSquareClick, 
  isLoading,
  userColor,
  isPlayerTurn
}) => {
  const [showCheckNotification, setShowCheckNotification] = useState(false);
  const [lastGameState, setLastGameState] = useState(null);

  // Handle check notification
  useEffect(() => {
    if (gameState?.game_state === 'check') {
      setShowCheckNotification(true);
    } else {
      setShowCheckNotification(false);
    }
    setLastGameState(gameState?.game_state);
  }, [gameState?.game_state]);

  if (!gameState) return null;

  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  // Always show board from user's perspective (white at bottom, black at top)
  const ranks = userColor === 'white' ? ['8', '7', '6', '5', '4', '3', '2', '1'] : ['1', '2', '3', '4', '5', '6', '7', '8'];
  
  // Parse FEN to get piece positions
  const fen = gameState.fen;
  const [position] = fen.split(' ');
  const rows = position.split('/');
  
  const getPieceAt = (file, rank) => {
    // Convert display rank to FEN rank
    const fenRank = userColor === 'white' ? rank : String(9 - parseInt(rank));
    const rowIndex = 8 - parseInt(fenRank); // Convert rank to row index (rank 8 = row 0, rank 1 = row 7)
    const colIndex = files.indexOf(file);
    if (rowIndex < 0 || rowIndex >= 8 || colIndex < 0 || colIndex >= 8) {
      return null;
    }
    const row = rows[rowIndex];
    let pieceIndex = 0;
    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      if (char >= '1' && char <= '8') {
        pieceIndex += parseInt(char);
      } else {
        if (pieceIndex === colIndex) {
          return char;
        }
        pieceIndex++;
      }
    }
    return null;
  };

  const isLightSquare = (file, rank) => {
    const fileIndex = files.indexOf(file);
    const rankIndex = parseInt(rank);
    return (fileIndex + rankIndex) % 2 === 0;
  };

  const getSquareColor = (file, rank) => {
    const square = `${file}${rank}`;
    const isLight = isLightSquare(file, rank);
    if (selectedSquare === square) {
      return isLight ? 'selected-light' : 'selected-dark';
    }
    if (validMoves.includes(square)) {
      return isLight ? 'valid-light' : 'valid-dark';
    }
    return isLight ? 'light' : 'dark';
  };

  // Map FEN piece to image file
  const pieceToImage = (piece) => {
    if (!piece) return null;
    const color = piece === piece.toUpperCase() ? 'w' : 'b';
    const type = piece.toUpperCase();
    return `/pieces/${color}${type}.png`;
  };

  const pieceNames = {
    'K': 'White King', 'Q': 'White Queen', 'R': 'White Rook', 
    'B': 'White Bishop', 'N': 'White Knight', 'P': 'White Pawn',
    'k': 'Black King', 'q': 'Black Queen', 'r': 'Black Rook', 
    'b': 'Black Bishop', 'n': 'Black Knight', 'p': 'Black Pawn'
  };

  // Convert display square to FEN square
  const displayToFen = (displaySquare) => {
    if (userColor === 'white') return displaySquare;
    const file = displaySquare[0];
    const rank = displaySquare[1];
    const flippedRank = String(9 - parseInt(rank));
    return `${file}${flippedRank}`;
  };

  // Convert FEN square to display square
  const fenToDisplay = (fenSquare) => {
    if (userColor === 'white') return fenSquare;
    const file = fenSquare[0];
    const rank = fenSquare[1];
    const flippedRank = String(9 - parseInt(rank));
    return `${file}${flippedRank}`;
  };

  // Only allow moving user's pieces on their turn
  const canMovePiece = (piece) => {
    if (!piece || !isPlayerTurn) return false;
    if (userColor === 'white') return piece === piece.toUpperCase();
    if (userColor === 'black') return piece === piece.toLowerCase();
    return false;
  };

  return (
    <div className="chess-board-container">
      <div className="chess-board">
        {/* File labels (top) */}
        <div className="board-labels files-top">
          <div className="board-label file-label-empty" />
          {files.map(file => (
            <div key={file} className="board-label file-label">{file}</div>
          ))}
          <div className="board-label file-label-empty" />
        </div>
        <div className="board-main">
          {/* Rank labels (left) */}
          <div className="board-labels ranks-left">
            {ranks.map(rank => (
              <div key={rank} className="board-label rank-label">{rank}</div>
            ))}
          </div>
          {/* Chess board */}
          <div className="board-grid">
            {ranks.map(rank =>
              files.map(file => {
                const displaySquare = `${file}${rank}`;
                const fenSquare = displayToFen(displaySquare);
                const piece = getPieceAt(file, rank);
                const squareColor = getSquareColor(file, rank);
                const pieceImg = pieceToImage(piece);
                const canMove = canMovePiece(piece);
                return (
                  <ChessSquare
                    key={displaySquare}
                    square={displaySquare}
                    piece={piece}
                    pieceImg={pieceImg}
                    pieceName={piece ? pieceNames[piece] : null}
                    squareColor={squareColor}
                    onClick={() => onSquareClick(fenSquare)}
                    isSelected={isPlayerTurn && selectedSquare === displaySquare}
                    isValidMove={isPlayerTurn && validMoves.includes(displaySquare)}
                    disabled={isLoading}
                  />
                );
              })
            )}
          </div>
          {/* Rank labels (right) */}
          <div className="board-labels ranks-right">
            {ranks.map(rank => (
              <div key={rank} className="board-label rank-label">{rank}</div>
            ))}
          </div>
        </div>
        {/* File labels (bottom) */}
        <div className="board-labels files-bottom">
          <div className="board-label file-label-empty" />
          {files.map(file => (
            <div key={file} className="board-label file-label">{file}</div>
          ))}
          <div className="board-label file-label-empty" />
        </div>
      </div>
      
      {/* Temporary check notification */}
      {showCheckNotification && (
        <div className="check-notification">
          <div className="check-notification-content">
            <h3>♔ Check!</h3>
          </div>
        </div>
      )}
      
      {/* Game status overlay - only for game-ending states */}
      {gameState.game_state !== 'playing' && gameState.game_state !== 'check' && (
        <div className="game-status-overlay">
          <div className="game-status-content">
            <h3>{getGameStatusText(gameState.game_state)}</h3>
            {gameState.game_state === 'checkmate' && (
              <p>Winner: {gameState.current_player === 'white' ? 'Black' : 'White'}</p>
            )}
          </div>
        </div>
      )}
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="spinner"></div>
            <p>Thinking...</p>
          </div>
        </div>
      )}
    </div>
  );
};

const getGameStatusText = (gameState) => {
  switch (gameState) {
    case 'checkmate':
      return 'Checkmate!';
    case 'stalemate':
      return 'Stalemate!';
    case 'draw':
      return 'Draw!';
    case 'check':
      return 'Check!';
    default:
      return '';
  }
};

export default ChessBoard; 