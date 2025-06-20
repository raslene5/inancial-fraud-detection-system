# 📦 Complete Installation Guide

## Prerequisites Verification

### Required Software
- **Java**: Version 17 or higher
- **Node.js**: Version 16 or higher
- **Python**: Version 3.11 (recommended)
- **MySQL**: Version 8.0 or higher
- **Maven**: Version 3.6 or higher
- **Git**: For version control

## Quick Installation (Automated)

### Step 1: System Verification
```bash
# Run system verification script
verify_system.bat
```

This script checks:
- Java installation and version
- Node.js and npm availability
- Python installation
- MySQL server status
- Maven configuration

### Step 2: Complete Setup
```bash
# Run complete system setup
setup_complete_system.bat
```

This script:
- Creates MySQL database and schema
- Installs Python dependencies
- Installs Node.js dependencies
- Builds the backend application
- Verifies all components

### Step 3: Start System
```bash
# Start integrated system
start_integrated_system_secure.bat
```

This script:
- Prompts for MySQL password securely
- Starts backend server (Port 8089)
- Starts frontend server (Port 3000)
- Provides system URLs and status

## Manual Installation

### 1. Database Setup

#### Create Database
```sql
-- Connect to MySQL as root
mysql -u root -p

-- Create database
CREATE DATABASE IF NOT EXISTS financial_detection_system;
USE financial_detection_system;

-- Run schema creation
SOURCE database_schema.sql;

-- Verify tables
SHOW TABLES;
```

#### Load Sample Data (Optional)
```sql
SOURCE sample_data.sql;
```

### 2. Backend Setup

#### Navigate to Backend Directory
```bash
cd FFDS-backend-tasks
```

#### Install Dependencies
```bash
# Clean and install Maven dependencies
mvn clean install

# Skip tests for faster installation
mvn clean install -DskipTests
```

#### Configure Database Connection
```properties
# Edit src/main/resources/application-local.properties
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

#### Start Backend
```bash
mvn spring-boot:run
```

### 3. Frontend Setup

#### Navigate to Frontend Directory
```bash
cd FFDS-
```

#### Install Dependencies
```bash
# Install Node.js dependencies
npm install

# Alternative: Use yarn
yarn install
```

#### Start Frontend
```bash
npm start
```

### 4. Python ML Setup

#### Install Python Dependencies
```bash
# Install required packages
pip install numpy pandas scikit-learn xgboost tensorflow joblib

# Or install from requirements file
pip install -r requirements.txt
```

#### Verify ML Models
```bash
# Check if model files exist
ls src/main/resources/models/
```

Expected files:
- `random_forest_model.pkl`
- `xgboost_model.pkl`
- `cnn_model.h5`
- `scaler_rf.pkl`
- `scaler.pkl`
- `pca_model.pkl`

## Detailed Component Installation

### Java Installation
```bash
# Check Java version
java -version

# Should show Java 17 or higher
# If not installed, download from:
# https://adoptium.net/temurin/releases/
```

### Node.js Installation
```bash
# Check Node.js version
node --version
npm --version

# Should show Node 16+ and npm 8+
# If not installed, download from:
# https://nodejs.org/
```

### Python Installation
```bash
# Check Python version
python --version

# Should show Python 3.11+
# If not installed, download from:
# https://www.python.org/downloads/
```

### MySQL Installation
```bash
# Check MySQL status
mysql --version

# Start MySQL service (Windows)
net start mysql

# Start MySQL service (macOS/Linux)
sudo systemctl start mysql
```

### Maven Installation
```bash
# Check Maven version
mvn --version

# Should show Maven 3.6+
# If not installed, download from:
# https://maven.apache.org/download.cgi
```

## Configuration Files

### Backend Configuration
```properties
# application.properties
server.port=8089
spring.application.name=financial-fraud-detection-system

# Database configuration
spring.datasource.url=jdbc:mysql://localhost:3306/financial_detection_system
spring.datasource.username=root
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
```

### Frontend Configuration
```json
{
  "name": "financial-fraud-detection-system",
  "version": "0.1.0",
  "private": true,
  "proxy": "http://localhost:8089",
  "dependencies": {
    "react": "^18.2.0",
    "@mui/material": "^5.10.5",
    "chart.js": "^3.9.1",
    "framer-motion": "^10.16.4"
  }
}
```

## Environment Variables

### Required Environment Variables
```bash
# Database password (set at runtime)
DB_PASSWORD=your_mysql_password

# Optional: Python path
PYTHON_PATH=/usr/bin/python3

# Optional: Java home
JAVA_HOME=/path/to/java
```

## Port Configuration

### Default Ports
- **Frontend**: 3000
- **Backend**: 8089
- **Database**: 3306
- **Live Reload**: 35729

### Changing Ports
```properties
# Backend port change
server.port=8090

# Frontend port change (package.json)
"start": "PORT=3001 react-scripts start"
```

## Verification Steps

### 1. Backend Verification
```bash
# Health check
curl http://localhost:8089/api/health

# Expected response: {"status":"UP"}
```

### 2. Frontend Verification
```bash
# Open browser
http://localhost:3000

# Should show dashboard interface
```

### 3. Database Verification
```sql
-- Check tables
USE financial_detection_system;
SHOW TABLES;

-- Should show: transactions, notifications, risk_factors, daily_statistics
```

### 4. ML Integration Verification
```bash
# Test fraud detection
curl -X POST http://localhost:8089/api/fraud-detect \
  -H "Content-Type: application/json" \
  -d '{"amount":1500,"day":15,"type":"TRANSFER","transaction_pair_code":"cc","part_of_the_day":"night"}'
```

## Troubleshooting Installation

### Common Issues

#### Port Already in Use
```bash
# Find process using port
netstat -ano | findstr :8089

# Kill process (Windows)
taskkill /PID <process_id> /F

# Kill process (macOS/Linux)
kill -9 <process_id>
```

#### Database Connection Failed
```bash
# Check MySQL service
net start mysql

# Test connection
mysql -u root -p -e "SELECT 1;"
```

#### Python Dependencies Missing
```bash
# Install missing packages
pip install --upgrade pip
pip install numpy pandas scikit-learn xgboost tensorflow joblib
```

#### Maven Build Failed
```bash
# Clean and rebuild
mvn clean
mvn install -DskipTests
```

#### Node.js Dependencies Issues
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## Performance Optimization

### JVM Settings
```bash
# Increase heap size for backend
export MAVEN_OPTS="-Xmx2g -Xms1g"
```

### Database Optimization
```sql
-- Optimize MySQL settings
SET GLOBAL innodb_buffer_pool_size = 1073741824; -- 1GB
```

### Node.js Optimization
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
```

## Security Configuration

### Database Security
```sql
-- Create dedicated user (recommended)
CREATE USER 'fraud_app'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON financial_detection_system.* TO 'fraud_app'@'localhost';
FLUSH PRIVILEGES;
```

### Application Security
```properties
# Enable security features
spring.security.enabled=true
server.error.include-stacktrace=never
```

## Backup and Recovery

### Database Backup
```bash
# Create backup
mysqldump -u root -p financial_detection_system > backup.sql

# Restore backup
mysql -u root -p financial_detection_system < backup.sql
```

### Application Backup
```bash
# Backup configuration files
cp -r src/main/resources/application*.properties backup/
cp -r src/main/resources/models/ backup/
```

## Next Steps

After successful installation:
1. Access the dashboard at http://localhost:3000
2. Test fraud detection with sample data
3. Review system logs for any issues
4. Configure monitoring and alerts
5. Set up regular database backups

---

The system is now ready for use! All components should be running smoothly and communicating properly.