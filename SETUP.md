# Chess Engine Setup Guide

## Quick Start

### Windows Users
1. Double-click `start.bat` to automatically install dependencies and start both servers
2. Or follow the manual steps below

### Unix/Linux/Mac Users
1. Make the script executable: `chmod +x start.sh`
2. Run: `./start.sh`
3. Or follow the manual steps below

## Manual Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Step 1: Install Python Dependencies
```bash
pip install -r requirements.txt
```

### Step 2: Install Node.js Dependencies
```bash
npm install
```

### Step 3: Test Backend
```bash
python test_backend.py
```

### Step 4: Start Backend Server
```bash
# Option 1: Use the startup script
python start_backend.py

# Option 2: Run directly
cd backend
python app.py
```

### Step 5: Start Frontend (in a new terminal)
```bash
npm start
```

## Accessing the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000

## Troubleshooting

### Common Issues

1. **Port already in use**
   - Backend: Change port in `backend/app.py` or set `PORT` environment variable
   - Frontend: Change port in `package.json` or set `PORT` environment variable

2. **Python dependencies not found**
   - Ensure you're using Python 3.8+
   - Try: `pip3 install -r requirements.txt`

3. **Node modules not found**
   - Delete `node_modules` folder and run `npm install` again

4. **Backend import errors**
   - Ensure you're in the project root directory
   - Check that all Python files are in the correct locations

### Testing Individual Components

**Test Backend Only:**
```bash
python test_backend.py
```

**Test Frontend Only:**
```bash
npm test
```

**Test API Endpoints:**
```bash
curl http://localhost:5000/api/board
```

## Development

### Backend Development
- Main logic: `backend/chess_engine.py`
- API server: `backend/app.py`
- Add tests in `tests/` directory

### Frontend Development
- Main app: `src/App.js`
- Components: `src/components/`
- API client: `src/utils/api.js`

### Adding New Features
1. Backend: Add methods to `ChessEngine` class
2. API: Add endpoints in `app.py`
3. Frontend: Add components and update API calls

## Deployment

### Production Build
```bash
# Build frontend
npm run build

# Start production backend
python backend/app.py --production
```

### Environment Variables
- `FLASK_ENV`: Set to `production` for production mode
- `PORT`: Backend port (default: 5000)
- `REACT_APP_API_URL`: Frontend API URL (default: http://localhost:5000)

## Project Structure
```
chess-engine/
├── backend/                 # Python chess engine
│   ├── chess_engine.py     # Core chess logic
│   ├── app.py              # Flask API server
│   └── __init__.py         # Package init
├── src/                    # React frontend
│   ├── components/         # React components
│   ├── utils/              # Utilities
│   └── App.js              # Main app
├── public/                 # Static assets
├── requirements.txt        # Python dependencies
├── package.json           # Node.js dependencies
├── start.bat              # Windows startup script
├── start.sh               # Unix startup script
├── test_backend.py        # Backend tests
└── README.md              # Project documentation
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Run the test scripts to verify components
3. Check the console for error messages
4. Open an issue on GitHub with details 