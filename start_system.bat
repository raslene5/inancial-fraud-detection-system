@echo off
echo Starting Financial Fraud Detection System...

echo Starting Backend...
start cmd /k "cd FFDS-backend-tasks && mvn spring-boot:run"

echo Waiting for backend to initialize...
timeout /t 10 /nobreak

echo Starting Frontend...
start cmd /k "npm start"

echo System startup initiated. Please check the command windows for any errors.
echo Frontend will be available at: http://localhost:3000
echo Backend API will be available at: http://localhost:8089/api/fraud-detect