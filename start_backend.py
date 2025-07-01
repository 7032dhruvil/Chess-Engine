#!/usr/bin/env python3
"""
Startup script for Chess Engine Backend
"""

import sys
import os

# Add the backend directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

try:
    from app import app
    
    if __name__ == '__main__':
        print("Starting Chess Engine Backend...")
        print("API will be available at: http://localhost:5000")
        print("Press Ctrl+C to stop the server")
        
        app.run(
            host='0.0.0.0',
            port=5000,
            debug=True
        )
        
except ImportError as e:
    print(f"Error importing modules: {e}")
    print("Make sure you have installed the required dependencies:")
    print("pip install -r requirements.txt")
    sys.exit(1)
except Exception as e:
    print(f"Error starting server: {e}")
    sys.exit(1) 