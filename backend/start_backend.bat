@echo off
echo Starting Backend Server...
echo.

REM Get MySQL password
set /p DB_PASSWORD="Enter your MySQL root password: "

REM Test database connection
mysql -u root -p%DB_PASSWORD% -e "USE financial_detection_system;" 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Cannot access database. Please run setup_complete_system.bat first
    pause
    exit /b 1
)

echo Database connection verified!
echo Starting Spring Boot application...
echo.

REM Set environment variable and start application
set DB_PASSWORD=%DB_PASSWORD%
call mvn spring-boot:run