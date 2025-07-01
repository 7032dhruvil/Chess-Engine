# Chess Engine

A modern, feature-rich chess engine with a beautiful web interface, built with Python backend and React frontend.

## 🎯 Features

- **Complete Chess Logic**: Full move validation, check detection, and game state management
- **AI Opponent**: Intelligent computer player with configurable difficulty levels
- **Beautiful UI**: Modern, responsive web interface with smooth animations
- **Game History**: Track moves, game analysis, and replay functionality
- **Multiplayer Ready**: Architecture supports both local and online play
- **Cross-platform**: Works on desktop and mobile browsers

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/chess-engine.git
   cd chess-engine
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Install Node.js dependencies**
   ```bash
   npm install
   ```

4. **Start the development server**
   ```bash
   # Terminal 1: Start Python backend
   python app.py
   
   # Terminal 2: Start React frontend
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000` to play chess!

## 🏗️ Project Structure

```
chess-engine/
├── backend/                 # Python chess engine
│   ├── chess_engine.py     # Core chess logic
│   ├── ai_player.py        # AI implementation
│   ├── game_state.py       # Game state management
│   └── app.py              # Flask API server
├── frontend/               # React web application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Utility functions
│   │   └── styles/         # CSS/styling
│   ├── public/             # Static assets
│   └── package.json        # Node.js dependencies
├── tests/                  # Test suite
├── docs/                   # Documentation
├── requirements.txt        # Python dependencies
├── package.json           # Node.js dependencies
└── README.md              # This file
```

## 🎮 How to Play

1. **Start a New Game**: Click "New Game" to begin
2. **Choose Opponent**: Play against AI or another player
3. **Make Moves**: Click and drag pieces to move them
4. **Game Controls**: Use the sidebar for game options and analysis

## 🔧 Development

### Backend Development
```bash
cd backend
python -m pytest tests/  # Run tests
python app.py            # Start development server
```

### Frontend Development
```bash
cd frontend
npm run dev              # Start development server
npm run build            # Build for production
npm test                 # Run tests
```

## 🧪 Testing

```bash
# Run all tests
python -m pytest tests/
npm test

# Run with coverage
python -m pytest --cov=backend tests/
npm run test:coverage
```

## 📦 Building for Production

```bash
# Build frontend
cd frontend
npm run build

# Start production server
cd ..
python app.py --production
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Chess piece designs and game logic inspiration
- React and Python communities for excellent tooling
- Contributors and testers

## 📞 Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check the [documentation](docs/)
- Join our community discussions

---

**Happy Chess Playing! ♟️** 