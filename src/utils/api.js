import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

class ChessAPIClient {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
        return config;
      },
      (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => {
        return response.data;
      },
      (error) => {
        console.error('Response error:', error);
        if (error.response) {
          // Server responded with error status
          throw new Error(error.response.data?.error || `HTTP ${error.response.status}`);
        } else if (error.request) {
          // Request was made but no response received
          throw new Error('No response from server. Please check your connection.');
        } else {
          // Something else happened
          throw new Error('An unexpected error occurred.');
        }
      }
    );
  }

  // Get current board state
  async getBoardState() {
    try {
      return await this.api.get('/api/board');
    } catch (error) {
      throw new Error(`Failed to get board state: ${error.message}`);
    }
  }

  // Make a move
  async makeMove(move) {
    try {
      return await this.api.post('/api/move', { move });
    } catch (error) {
      throw new Error(`Failed to make move: ${error.message}`);
    }
  }

  // Get AI move
  async getAiMove(difficulty = 'medium') {
    try {
      return await this.api.post('/api/ai-move', { difficulty });
    } catch (error) {
      throw new Error(`Failed to get AI move: ${error.message}`);
    }
  }

  // Reset game
  async resetGame() {
    try {
      return await this.api.post('/api/reset');
    } catch (error) {
      throw new Error(`Failed to reset game: ${error.message}`);
    }
  }

  // Get move suggestions
  async getMoveSuggestions(limit = 5) {
    try {
      return await this.api.get(`/api/suggestions?limit=${limit}`);
    } catch (error) {
      throw new Error(`Failed to get move suggestions: ${error.message}`);
    }
  }

  // Get game analysis
  async getGameAnalysis() {
    try {
      return await this.api.get('/api/analysis');
    } catch (error) {
      throw new Error(`Failed to get game analysis: ${error.message}`);
    }
  }

  // Health check
  async healthCheck() {
    try {
      return await this.api.get('/api/health');
    } catch (error) {
      throw new Error(`Health check failed: ${error.message}`);
    }
  }
}

export const ChessAPI = new ChessAPIClient(); 