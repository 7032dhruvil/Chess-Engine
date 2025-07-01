#!/usr/bin/env python3
"""
Simple test script for Chess Engine Backend
"""

import sys
import os

# Add the backend directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

def test_chess_engine():
    """Test basic chess engine functionality."""
    try:
        from chess_engine import ChessEngine
        
        print("Testing Chess Engine...")
        
        # Create engine instance
        engine = ChessEngine()
        print("✓ Chess engine created successfully")
        
        # Test initial board state
        board_state = engine.get_board_state()
        print(f"✓ Initial board state: {board_state['game_state']}")
        print(f"✓ Current player: {board_state['current_player']}")
        print(f"✓ Legal moves: {len(board_state['legal_moves'])} available")
        
        # Test a simple move
        if board_state['legal_moves']:
            test_move = board_state['legal_moves'][0]
            result = engine.make_move(test_move)
            if result['success']:
                print(f"✓ Test move {test_move} successful")
            else:
                print(f"✗ Test move {test_move} failed: {result['error']}")
        
        # Test AI move
        ai_result = engine.get_ai_move('easy')
        if ai_result['success']:
            print(f"✓ AI move successful: {ai_result['move']}")
        else:
            print(f"✗ AI move failed: {ai_result['error']}")
        
        # Test reset
        reset_result = engine.reset_game()
        if reset_result['success']:
            print("✓ Game reset successful")
        
        print("\n🎉 All tests passed! Backend is working correctly.")
        return True
        
    except ImportError as e:
        print(f"✗ Import error: {e}")
        print("Make sure you have installed the required dependencies:")
        print("pip install -r requirements.txt")
        return False
    except Exception as e:
        print(f"✗ Test failed: {e}")
        return False

if __name__ == '__main__':
    success = test_chess_engine()
    sys.exit(0 if success else 1) 