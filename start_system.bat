@echo off
echo Starting Financial Fraud Detection System...

echo.
echo [1/2] Starting Backend (Spring Boot)...
start "Backend Server" cmd /k "cd ..\FFDS-backend-tasks && mvn spring-boot:run"

echo Waiting for backend to initialize...
timeout /t 15 /nobreak

echo.
echo [2/2] Starting Frontend (React)...
start "Frontend Server" cmd /k "npm start"

echo.
echo System startup initiated!
echo.
echo Services:
echo - Frontend: http://localhost:3000
echo - Backend API: http://localhost:8089/api
echo - Health Check: http://localhost:8089/api/health
echo.
echo Check the command windows for any errors.
pause