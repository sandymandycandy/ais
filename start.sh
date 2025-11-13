#!/bin/bash

# 🚀 Quick Start Script for Student Hub Platform

echo "📚 Student Hub Platform - Quick Start"
echo "======================================"
echo ""

# Check if MongoDB is running
echo "🔍 Checking MongoDB connection..."
if mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
    echo "✅ MongoDB is running"
else
    echo "⚠️  MongoDB is not running"
    echo ""
    echo "Choose an option:"
    echo "1. Start MongoDB with Docker (recommended)"
    echo "2. I'll start MongoDB manually"
    echo ""
    read -p "Enter your choice (1 or 2): " choice

    if [ "$choice" = "1" ]; then
        echo ""
        echo "🐳 Starting MongoDB with Docker..."
        docker run -d \
          --name mongodb \
          -p 27017:27017 \
          -e MONGO_INITDB_ROOT_USERNAME=admin \
          -e MONGO_INITDB_ROOT_PASSWORD=password123 \
          -v mongodb_data:/data/db \
          mongo:6.0

        echo "⏳ Waiting for MongoDB to start..."
        sleep 5

        # Update .env file
        if grep -q "MONGODB_URI=mongodb://localhost" .env; then
            sed -i 's|MONGODB_URI=mongodb://localhost:27017/student-hub|MONGODB_URI=mongodb://admin:password123@localhost:27017/student-hub?authSource=admin|g' .env
            echo "✅ Updated .env file with Docker MongoDB URI"
        fi

        echo "✅ MongoDB started successfully!"
    else
        echo ""
        echo "Please start MongoDB manually:"
        echo "  - With systemd: sudo systemctl start mongod"
        echo "  - With Homebrew: brew services start mongodb-community"
        echo "  - Or see MONGODB_SETUP.md for detailed instructions"
        echo ""
        read -p "Press Enter when MongoDB is running..."
    fi
fi

echo ""
echo "📦 Installing dependencies..."
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "🚀 Starting Student Hub Platform..."
echo ""
echo "Opening two terminals:"
echo "  Terminal 1: Backend server (http://localhost:5000)"
echo "  Terminal 2: Frontend server (http://localhost:5173)"
echo ""
echo "Press Ctrl+C in each terminal to stop the servers"
echo ""

# Start both servers in background
npm run server &
BACKEND_PID=$!

sleep 3

npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Servers started!"
echo ""
echo "📱 Access the application:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:5000/api"
echo "   Health:   http://localhost:5000/api/health"
echo ""
echo "🛑 To stop servers: Press Ctrl+C and run 'npm run stop'"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
