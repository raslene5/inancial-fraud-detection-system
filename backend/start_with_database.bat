@echo off
echo Starting Financial Fraud Detection System with MySQL Database...

echo.
echo Step 1: Make sure MySQL is running and database is created
echo Please ensure:
echo - MySQL server is running on localhost:3306
echo - Database 'financial_detection_system' exists
echo - Your MySQL root password is set correctly in application.properties
echo.

pause

echo.
echo Step 2: Building the application...
call mvn clean compile

echo.
echo Step 3: Starting Spring Boot application...
call mvn spring-boot:run

pause