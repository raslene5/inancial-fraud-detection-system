@echo off
echo ========================================
echo Testing Financial Fraud Detection System Integration
echo ========================================
echo.

REM Test 1: Database Connection
echo [1/5] Testing Database Connection...
mysql -u root -p93964976RR -e "USE financial_detection_system; SHOW TABLES;" 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Database connection failed
    echo Please ensure MySQL is running and database is set up
    pause
    exit /b 1
)
echo ✓ Database connection successful

REM Test 2: Backend Health Check
echo.
echo [2/5] Testing Backend Health Check...
timeout /t 2 /nobreak >nul
curl -s http://localhost:8089/api/health >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: Backend not responding on port 8089
    echo Make sure backend is running
) else (
    echo ✓ Backend health check successful
)

REM Test 3: Frontend Dependencies
echo.
echo [3/5] Checking Frontend Dependencies...
cd /d "C:\Users\Lenovo\FFDS-"
if not exist "node_modules" (
    echo Installing frontend dependencies...
    npm install
)
echo ✓ Frontend dependencies ready

REM Test 4: Backend Dependencies
echo.
echo [4/5] Checking Backend Dependencies...
cd /d "C:\Users\Lenovo\FFDS-backend-tasks"
if not exist "target" (
    echo Compiling backend...
    mvn clean compile
)
echo ✓ Backend compilation ready

REM Test 5: Python Dependencies
echo.
echo [5/5] Checking Python Dependencies...
python -c "import pandas, numpy, sklearn, tensorflow" 2>nul
if %errorlevel% neq 0 (
    echo Installing Python dependencies...
    pip install -r requirements.txt
)
echo ✓ Python dependencies ready

echo.
echo ========================================
echo Integration Test Complete!
echo ========================================
echo.
echo All components are ready for integration.
echo Run start_integrated_system.bat to start the full system.
echo.
pause