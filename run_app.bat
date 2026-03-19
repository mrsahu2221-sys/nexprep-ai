@echo off
SET "PATH=%PATH%;C:\Program Files\nodejs"
echo [SYSTEM] Starting NexPrep AI...
cd backend
start /B node server.js
cd ../frontend
npm run dev
