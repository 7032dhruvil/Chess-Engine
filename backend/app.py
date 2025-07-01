"""
Flask API server for Chess Engine
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from chess_engine import ChessEngine
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Global chess engine instance
chess_engine = ChessEngine()

@app.route('/')
def index():
    """Root endpoint with API information."""
    return jsonify({
        "message": "Chess Engine API",
        "version": "1.0.0",
        "endpoints": {
            "GET /api/board": "Get current board state",
            "POST /api/move": "Make a move",
            "POST /api/ai-move": "Get AI move",
            "POST /api/reset": "Reset game",
            "GET /api/suggestions": "Get move suggestions",
            "GET /api/analysis": "Get game analysis"
        }
    })

@app.route('/api/board', methods=['GET'])
def get_board():
    """Get current board state."""
    try:
        return jsonify({
            "success": True,
            "data": chess_engine.get_board_state()
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/move', methods=['POST'])
def make_move():
    """Make a move on the board."""
    try:
        data = request.get_json()
        
        if not data or 'move' not in data:
            return jsonify({
                "success": False,
                "error": "Move parameter is required"
            }), 400
        
        move_uci = data['move']
        result = chess_engine.make_move(move_uci)
        
        if result['success']:
            return jsonify({
                "success": True,
                "data": result
            })
        else:
            return jsonify({
                "success": False,
                "error": result['error'],
                "data": result['board_state']
            }), 400
            
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/ai-move', methods=['POST'])
def get_ai_move():
    """Get AI move."""
    try:
        data = request.get_json() or {}
        difficulty = data.get('difficulty', 'medium')
        
        # Validate difficulty
        valid_difficulties = ['easy', 'medium', 'hard', 'expert']
        if difficulty not in valid_difficulties:
            return jsonify({
                "success": False,
                "error": f"Invalid difficulty. Must be one of: {valid_difficulties}"
            }), 400
        
        result = chess_engine.get_ai_move(difficulty)
        
        if result['success']:
            return jsonify({
                "success": True,
                "data": result
            })
        else:
            return jsonify({
                "success": False,
                "error": result['error'],
                "data": result['board_state']
            }), 400
            
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/reset', methods=['POST'])
def reset_game():
    """Reset the game to initial state."""
    try:
        result = chess_engine.reset_game()
        return jsonify({
            "success": True,
            "data": result
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/suggestions', methods=['GET'])
def get_suggestions():
    """Get move suggestions."""
    try:
        limit = request.args.get('limit', 5, type=int)
        suggestions = chess_engine.get_move_suggestions(limit)
        
        return jsonify({
            "success": True,
            "data": {
                "suggestions": suggestions,
                "count": len(suggestions)
            }
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/analysis', methods=['GET'])
def get_analysis():
    """Get game analysis."""
    try:
        analysis = chess_engine.get_game_analysis()
        return jsonify({
            "success": True,
            "data": analysis
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        "status": "healthy",
        "service": "chess-engine-api"
    })

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors."""
    return jsonify({
        "success": False,
        "error": "Endpoint not found"
    }), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors."""
    return jsonify({
        "success": False,
        "error": "Internal server error"
    }), 500

if __name__ == '__main__':
    # Get port from environment or default to 5000
    port = int(os.environ.get('PORT', 5000))
    
    # Run in debug mode if FLASK_ENV is development
    debug = os.environ.get('FLASK_ENV') == 'development'
    
    print(f"Starting Chess Engine API on port {port}")
    print(f"Debug mode: {debug}")
    
    app.run(
        host='0.0.0.0',
        port=port,
        debug=debug
    ) 