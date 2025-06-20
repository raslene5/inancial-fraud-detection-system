@echo off
echo Starting Financial Fraud Detection System with Secure Database Connection...
echo.

REM Prompt for MySQL password securely
set /p DB_PASSWORD="Enter your MySQL root password: "

echo.
echo Step 1: Testing database connection...
mysql -u root -p%DB_PASSWORD% -e "SELECT 1;" 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Cannot connect to MySQL with provided credentials
    echo Please check your MySQL server is running and password is correct
    pause
    exit /b 1
)

echo Database connection successful!
echo.

echo Step 2: Checking if database exists...
mysql -u root -p%DB_PASSWORD% -e "USE financial_detection_system;" 2>nul
if %errorlevel% neq 0 (
    echo Creating database...
    mysql -u root -p%DB_PASSWORD% -e "CREATE DATABASE IF NOT EXISTS financial_detection_system;"
    echo Database created successfully!
)

echo.
echo Step 3: Building the application...
call mvn clean compile

echo.
echo Step 4: Starting Spring Boot application with secure password...
set DB_PASSWORD=%DB_PASSWORD%
call mvn spring-boot:run

pause