import React, { useState, useEffect } from 'react';
import ChessBoard from './components/ChessBoard';
import GameControls from './components/GameControls';
import GameSetupModal from './components/GameSetupModal';
import { ChessAPI } from './utils/api';
import toast from 'react-hot-toast';
import './App.css';
import logo from './logo.png';

function App() {
  const [gameState, setGameState] = useState(null);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [gameMode, setGameMode] = useState('ai');
  const [aiDifficulty, setAiDifficulty] = useState('medium');
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [showSetup, setShowSetup] = useState(true);
  const [userColor, setUserColor] = useState('white');
  const [opponentType, setOpponentType] = useState('ai');
  const [gameResult, setGameResult] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  useEffect(() => {
    if (!showSetup) {
      startNewGame();
    }
  }, [showSetup, userColor, opponentType]);

  const startNewGame = async () => {
    try {
      setIsLoading(true);
      await ChessAPI.resetGame();
      const response = await ChessAPI.getBoardState();
      if (response.success) {
        setGameState(response.data);
        setSelectedSquare(null);
        setValidMoves([]);
        setGameResult(null);
        
        if (gameMode === 'friend') {
          setIsPlayerTurn(true);
        } else if (userColor === 'white') {
          setIsPlayerTurn(true);
        } else {
          setIsPlayerTurn(false);
          setTimeout(() => makeAiMove(), 500);
        }
      }
    } catch (error) {
      toast.error('Failed to initialize game');
      console.error('Error initializing game:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartGame = ({ side, opponent }) => {
    let color = side;
    if (opponent === 'friend') {
      color = 'white';
    } else if (side === 'random') {
      color = Math.random() < 0.5 ? 'white' : 'black';
    }
    setUserColor(color);
    setOpponentType(opponent);
    setGameMode(opponent === 'ai' ? 'ai' : 'friend');
    setShowSetup(false);
    setSelectedSquare(null);
    setValidMoves([]);
    setGameResult(null);
  };

  const handleSquareClick = async (square) => {
    if (!gameState || (gameState.game_state !== 'playing' && gameState.game_state !== 'check') || gameResult) {
      return;
    }
    
    const displaySquare = square;
    const piece = getPieceAtSquare(square, gameState.fen);
    
    const canMovePiece = () => {
      if (!piece) return false;
      if (gameMode === 'friend') {
        if (gameState.current_player === 'white') return piece === piece.toUpperCase();
        if (gameState.current_player === 'black') return piece === piece.toLowerCase();
        return false;
      } else {
        if (userColor === 'white') return piece === piece.toUpperCase();
        if (userColor === 'black') return piece === piece.toLowerCase();
        return false;
      }
    };
    
    if (!selectedSquare) {
      if (!canMovePiece()) {
        return;
      }
      setSelectedSquare(displaySquare);
      const moves = gameState.legal_moves.filter(move => move.startsWith(square));
      const displayMoves = moves.map(move => move.slice(2, 4));
      setValidMoves(displayMoves);
    } else {
      const fenFrom = selectedSquare;
      const fenTo = displaySquare;
      const move = `${fenFrom}${fenTo}`;
      
      await makeMove(move);
      setSelectedSquare(null);
      setValidMoves([]);
    }
  };

  const makeMove = async (move) => {
    try {
      setIsLoading(true);
      const response = await ChessAPI.makeMove(move);
      setSelectedSquare(null);
      setValidMoves([]);
      if (response.success) {
        setGameState(response.data.board_state);
        
        const state = response.data.board_state.game_state;
        if (state === 'checkmate') {
          setGameResult({
            winner: isPlayerTurn ? userColor : (userColor === 'white' ? 'black' : 'white'),
            reason: 'checkmate',
          });
        } else if (state === 'stalemate') {
          setGameResult({ winner: 'draw', reason: 'stalemate' });
        } else if (state === 'draw') {
          setGameResult({ winner: 'draw', reason: 'draw' });
        }
        
        if (gameMode === 'friend') {
          setIsPlayerTurn(true);
        } else if (gameMode === 'ai') {
          setIsPlayerTurn(false);
          if (response.data.board_state.game_state === 'playing' || response.data.board_state.game_state === 'check') {
            setTimeout(() => makeAiMove(), 500);
          }
        } else {
          setIsPlayerTurn((prev) => !prev);
        }
        toast.success('Move made successfully');
      } else {
        toast.error(response.error || 'Invalid move');
      }
    } catch (error) {
      toast.error('Failed to make move');
      console.error('Error making move:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const makeAiMove = async () => {
    try {
      setIsLoading(true);
      const response = await ChessAPI.getAiMove(aiDifficulty);
      setSelectedSquare(null);
      setValidMoves([]);
      if (response.success) {
        setGameState(response.data.board_state);
        
        const state = response.data.board_state.game_state;
        if (state === 'checkmate') {
          setGameResult({
            winner: isPlayerTurn ? userColor : (userColor === 'white' ? 'black' : 'white'),
            reason: 'checkmate',
          });
        } else if (state === 'stalemate') {
          setGameResult({ winner: 'draw', reason: 'stalemate' });
        } else if (state === 'draw') {
          setGameResult({ winner: 'draw', reason: 'draw' });
        }
        setIsPlayerTurn(true);
        toast.success('AI move completed');
      } else {
        toast.error('AI move failed');
        setIsPlayerTurn(true);
      }
    } catch (error) {
      toast.error('AI move failed');
      setIsPlayerTurn(true);
      console.error('Error making AI move:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetGame = async () => {
    setShowSetup(true);
    setSelectedSquare(null);
    setValidMoves([]);
    setGameResult(null);
  };

  const handleResign = () => {
    if (gameResult || !gameState || gameState.game_state !== 'playing') return;
    setGameResult({
      winner: userColor === 'white' ? 'black' : 'white',
      reason: 'resign',
    });
    toast('You resigned.');
  };

  const getMoveSuggestions = async () => {
    try {
      const response = await ChessAPI.getMoveSuggestions();
      if (response.success) {
        toast.success(`Suggestions: ${response.data.suggestions.join(', ')}`);
      }
    } catch (error) {
      toast.error('Failed to get suggestions');
    }
  };

  function getPieceAtSquare(square, fen) {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const [position] = fen.split(' ');
    const rows = position.split('/');
    const file = square[0];
    const rank = square[1];
    
    const rowIndex = 8 - parseInt(rank);
    const colIndex = files.indexOf(file);
    
    if (rowIndex < 0 || rowIndex >= 8 || colIndex < 0 || colIndex >= 8) return null;
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
  }

  useEffect(() => {
    if (!isPlayerTurn || (gameState && gameState.current_player !== userColor)) {
      setSelectedSquare(null);
      setValidMoves([]);
    }
  }, [isPlayerTurn, gameState?.current_player, userColor]);

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (feedback.trim().length === 0) return;
    setFeedbackSuccess(true);
    setFeedback("");
    setTimeout(() => setFeedbackSuccess(false), 2500);
  };

  if (isLoading && !gameState) {
    return (
      <div className="app-loading">
        <div className="spinner"></div>
        <p>Loading chess game...</p>
      </div>
    );
  }

  return (
    <div className="app">
      {showSetup && <GameSetupModal onStart={handleStartGame} />}
      <header className="app-header-modern">
        <div className="header-center">
          <div className="header-logo-title">
            <img src={logo} alt="Chess Engine Logo" className="site-logo" />
            <h1 className="app-title">Chess Engine</h1>
          </div>
          <p className="app-subtitle">Modern chess with intelligent AI</p>
        </div>
      </header>
      <main className="app-main">
        <div className="container">
          <div className="main-columns">
            <div className="main-left-panel">
              <div className="panel-section">
                <GameControls
                  onReset={resetGame}
                  onResign={handleResign}
                  onSuggestions={getMoveSuggestions}
                  gameMode={gameMode}
                  setGameMode={setGameMode}
                  aiDifficulty={aiDifficulty}
                  setAiDifficulty={setAiDifficulty}
                  isLoading={isLoading}
                  gameState={gameState}
                  gameResult={gameResult}
                />
              </div>
            </div>
            <div className="main-board-panel">
              <ChessBoard
                gameState={gameState}
                selectedSquare={selectedSquare}
                validMoves={validMoves}
                onSquareClick={handleSquareClick}
                isLoading={isLoading}
                userColor={userColor}
                isPlayerTurn={isPlayerTurn}
              />
            </div>
          </div>
        </div>
        <div className="modern-move-history-section">
          <h3 className="move-history-title">Move History</h3>
          <div className="modern-move-history-list">
            {gameState?.move_history?.length > 0 ? (
              gameState.move_history.map((move, idx) => (
                <div className="move-history-horizontal-item" key={idx}>
                  <div className="move-number">{Math.floor(idx / 2) + 1}{idx % 2 === 0 ? "." : "..."}</div>
                  <div>{move.move}</div>
                </div>
              ))
            ) : (
              <div className="move-history-empty">No moves yet</div>
            )}
          </div>
        </div>
        <div className="feedback-section">
          <div className="feedback-header">
            <span className="feedback-icon" aria-label="Feedback">
              <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="38" height="38" rx="19" fill="#e0e7ef"/>
                <path d="M12 15.5C12 14.1193 13.1193 13 14.5 13H23.5C24.8807 13 26 14.1193 26 15.5V22.5C26 23.8807 24.8807 25 23.5 25H16L12 27V15.5Z" stroke="#2563eb" strokeWidth="2"/>
              </svg>
            </span>
            <h3>We Value Your Feedback</h3>
          </div>
          <div className="feedback-subtext">
            Help us improve Chess Engine! Share your thoughts, suggestions, or report any issues you encounter. We read every message and use your feedback to make the app better for everyone.
          </div>
          <div className="feedback-quote">
            <span>"Your feedback helps us build a better chess experience for everyone."</span>
          </div>
          <form onSubmit={handleFeedbackSubmit} style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <textarea
              placeholder="Let us know your thoughts, suggestions, or issues..."
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              aria-label="Feedback textarea"
              required
            />
            <button type="submit" disabled={feedback.trim().length === 0}>Submit Feedback</button>
          </form>
          {feedbackSuccess && <div className="feedback-success">Thank you for your feedback!</div>}
        </div>
      </main>
      <footer className="app-footer">
        <div className="container">
          <p>&copy; 2024 Chess Engine. Built with React & Python.</p>
        </div>
      </footer>
    </div>
  );
}

export default App; 