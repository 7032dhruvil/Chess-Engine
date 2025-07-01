"""
Chess Engine - Core chess logic and game management
"""

import chess
import chess.engine
from typing import List, Tuple, Optional, Dict, Any
import json
import time


class ChessEngine:
    """Main chess engine class handling game logic and state management."""
    
    def __init__(self):
        self.board = chess.Board()
        self.move_history = []
        self.game_state = "playing"  # playing, checkmate, stalemate, draw
        self.current_player = chess.WHITE
        self.engine = None
        self._initialize_engine()
    
    def _initialize_engine(self):
        """Initialize the chess engine for AI moves."""
        try:
            # Try to use Stockfish if available
            self.engine = chess.engine.SimpleEngine.popen_uci("stockfish")
        except:
            # Fallback to simple engine
            self.engine = None
    
    def get_board_state(self) -> Dict[str, Any]:
        """Get current board state as dictionary."""
        outcome = self.board.outcome()
        return {
            "fen": self.board.fen(),
            "legal_moves": [move.uci() for move in self.board.legal_moves],
            "is_check": self.board.is_check(),
            "is_checkmate": self.board.is_checkmate(),
            "is_stalemate": self.board.is_stalemate(),
            "is_draw": outcome is not None and outcome.termination.name == "DRAW",
            "current_player": "white" if self.current_player == chess.WHITE else "black",
            "move_history": self.move_history,
            "game_state": self._get_game_state()
        }
    
    def _get_game_state(self) -> str:
        """Determine current game state."""
        outcome = self.board.outcome()
        if self.board.is_checkmate():
            return "checkmate"
        elif self.board.is_stalemate():
            return "stalemate"
        elif outcome is not None and outcome.termination.name == "DRAW":
            return "draw"
        elif self.board.is_check():
            return "check"
        else:
            return "playing"
    
    def make_move(self, move_uci: str) -> Dict[str, Any]:
        """Make a move on the board."""
        try:
            move = chess.Move.from_uci(move_uci)
            
            if move not in self.board.legal_moves:
                return {
                    "success": False,
                    "error": "Illegal move",
                    "board_state": self.get_board_state()
                }
            
            # Make the move
            self.board.push(move)
            self.move_history.append({
                "move": move_uci,
                "player": "white" if self.current_player == chess.WHITE else "black",
                "timestamp": time.time()
            })
            
            # Switch players
            self.current_player = not self.current_player
            
            return {
                "success": True,
                "board_state": self.get_board_state(),
                "move": move_uci
            }
            
        except ValueError as e:
            return {
                "success": False,
                "error": f"Invalid move format: {str(e)}",
                "board_state": self.get_board_state()
            }
    
    def get_ai_move(self, difficulty: str = "medium") -> Dict[str, Any]:
        """Get AI move based on difficulty level."""
        if not self.engine:
            return self._get_simple_ai_move(difficulty)
        
        try:
            # Set time limit based on difficulty
            time_limit = {
                "easy": 0.1,
                "medium": 0.5,
                "hard": 1.0,
                "expert": 2.0
            }.get(difficulty, 0.5)
            
            result = self.engine.play(
                self.board,
                chess.engine.Limit(time=time_limit),
                info=chess.engine.INFO_SCORE
            )
            
            if result.move is not None:
                move_uci = result.move.uci()
                return self.make_move(move_uci)
            else:
                return {
                    "success": False,
                    "error": "AI could not find a move.",
                    "board_state": self.get_board_state()
                }
            
        except Exception as e:
            # Fallback to simple AI
            return self._get_simple_ai_move(difficulty)
    
    def _get_simple_ai_move(self, difficulty: str) -> Dict[str, Any]:
        """Simple AI implementation using basic evaluation."""
        legal_moves = list(self.board.legal_moves)
        
        if not legal_moves:
            return {
                "success": False,
                "error": "No legal moves available",
                "board_state": self.get_board_state()
            }
        
        # Simple move selection based on difficulty
        if difficulty == "easy":
            # Random move
            import random
            move = random.choice(legal_moves)
        else:
            # Basic evaluation - prefer captures and checks
            best_move = legal_moves[0]
            best_score = -9999
            
            for move in legal_moves:
                score = self._evaluate_move(move)
                if score > best_score:
                    best_score = score
                    best_move = move
            
            move = best_move
        
        return self.make_move(move.uci())
    
    def _evaluate_move(self, move: chess.Move) -> int:
        """Basic move evaluation for simple AI."""
        score = 0
        
        # Make temporary move to evaluate
        self.board.push(move)
        
        # Check if move gives check
        if self.board.is_check():
            score += 50
        
        # Check if move is a capture
        if self.board.is_capture(move):
            score += 10
        
        # Check if move controls center
        center_squares = [chess.E4, chess.E5, chess.D4, chess.D5]
        if move.to_square in center_squares:
            score += 5
        
        # Undo the move
        self.board.pop()
        
        return score
    
    def reset_game(self) -> Dict[str, Any]:
        """Reset the game to initial state."""
        self.board = chess.Board()
        self.move_history = []
        self.current_player = chess.WHITE
        self.game_state = "playing"
        
        return {
            "success": True,
            "board_state": self.get_board_state()
        }
    
    def get_move_suggestions(self, limit: int = 5) -> List[str]:
        """Get move suggestions for current position."""
        legal_moves = list(self.board.legal_moves)
        
        if not legal_moves:
            return []
        
        # Simple suggestion based on basic evaluation
        scored_moves = []
        for move in legal_moves:
            score = self._evaluate_move(move)
            scored_moves.append((move, score))
        
        # Sort by score and return top moves
        scored_moves.sort(key=lambda x: x[1], reverse=True)
        return [move.uci() for move, _ in scored_moves[:limit]]
    
    def get_game_analysis(self) -> Dict[str, Any]:
        """Get basic game analysis."""
        return {
            "total_moves": len(self.move_history),
            "white_moves": len([m for m in self.move_history if m["player"] == "white"]),
            "black_moves": len([m for m in self.move_history if m["player"] == "black"]),
            "game_state": self._get_game_state(),
            "current_position": self.board.fen()
        }
    
    def __del__(self):
        """Cleanup engine on deletion."""
        if self.engine:
            try:
                self.engine.quit()
            except:
                pass 