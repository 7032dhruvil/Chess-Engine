#!/bin/bash

echo "Starting Chess Engine..."
echo

echo "Step 1: Installing Python dependencies..."
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "Error installing Python dependencies"
    exit 1
fi

echo "Step 2: Installing Node.js dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "Error installing Node.js dependencies"
    exit 1
fi

echo "Step 3: Testing backend..."
python test_backend.py
if [ $? -ne 0 ]; then
    echo "Backend test failed"
    exit 1
fi

echo
echo "Step 4: Starting backend server..."
python start_backend.py &
BACKEND_PID=$!

echo "Step 5: Waiting for backend to start..."
sleep 3

echo "Step 6: Starting frontend..."
npm start &
FRONTEND_PID=$!

echo
echo "Chess Engine is starting up!"
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo
echo "Press Ctrl+C to stop both servers..."

# Function to cleanup on exit
cleanup() {
    echo "Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait 