@echo off
echo Starting Chess Engine...
echo.

echo Step 1: Installing Python dependencies...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo Error installing Python dependencies
    pause
    exit /b 1
)

echo Step 2: Installing Node.js dependencies...
npm install
if %errorlevel% neq 0 (
    echo Error installing Node.js dependencies
    pause
    exit /b 1
)

echo Step 3: Testing backend...
python test_backend.py
if %errorlevel% neq 0 (
    echo Backend test failed
    pause
    exit /b 1
)

echo.
echo Step 4: Starting backend server...
start "Chess Engine Backend" cmd /k "python start_backend.py"

echo Step 5: Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo Step 6: Starting frontend...
start "Chess Engine Frontend" cmd /k "npm start"

echo.
echo Chess Engine is starting up!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to close this window...
pause > nul 