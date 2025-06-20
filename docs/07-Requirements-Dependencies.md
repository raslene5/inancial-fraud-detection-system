# 📋 Requirements & Dependencies Documentation

## Complete System Requirements


### Software Requirements

#### Core Runtime Requirements
- **Java**: OpenJDK 17+ or Oracle JDK 17+
- **Node.js**: Version 16.0+ (LTS recommended)
- **Python**: Version 3.11+ (3.11.2544.0 verified working)
- **MySQL**: Version 8.0+ (8.0.42 verified working)
- **Maven**: Version 3.6+ for building backend

#### Operating System Support
- **Windows**: 10, 11 (Primary development platform)

## Frontend Dependencies (React)

### Package.json Dependencies
```json
{
  "name": "financial-fraud-detection-system",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@emotion/react": "^11.10.4",
    "@emotion/styled": "^11.10.4",
    "@fullcalendar/core": "^5.11.3",
    "@fullcalendar/daygrid": "^5.11.3",
    "@fullcalendar/interaction": "^5.11.3",
    "@fullcalendar/list": "^5.11.3",
    "@fullcalendar/react": "^5.11.2",
    "@fullcalendar/timegrid": "^5.11.3",
    "@mui/icons-material": "^5.10.3",
    "@mui/material": "^5.10.5",
    "@mui/x-data-grid": "^5.17.2",
    "@nivo/bar": "^0.80.0",
    "@nivo/core": "^0.79.0",
    "@nivo/geo": "^0.80.0",
    "@nivo/line": "^0.79.1",
    "@nivo/pie": "^0.80.0",
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.3.0",
    "@testing-library/user-event": "^13.5.0",
    "chart.js": "^3.9.1",
    "chartjs-plugin-datalabels": "^2.2.0",
    "formik": "^2.2.9",
    "framer-motion": "^10.16.4",
    "html2canvas": "^1.4.1",
    "jspdf": "^3.0.1",
    "jspdf-autotable": "^5.0.2",
    "react": "^18.2.0",
    "react-chartjs-2": "^4.3.1",
    "react-countup": "^6.5.3",
    "react-dom": "^18.2.0",
    "react-pro-sidebar": "^0.7.1",
    "react-router-dom": "^6.3.0",
    "react-scripts": "5.0.1",
    "web-vitals": "^2.1.4",
    "yup": "^0.32.11"
  }
}
```

### Frontend Dependency Analysis

#### UI Framework & Components
- **React 18.2.0**: Core framework with latest features
- **Material-UI 5.10.5**: Professional UI components
- **@mui/icons-material**: Material Design icons
- **@mui/x-data-grid**: Advanced data grid component
- **react-pro-sidebar**: Professional sidebar navigation

#### Data Visualization
- **Chart.js 3.9.1**: Primary charting library
- **react-chartjs-2**: React wrapper for Chart.js
- **@nivo/**: Advanced visualization components
  - bar, core, geo, line, pie charts
- **chartjs-plugin-datalabels**: Chart data labels

#### Animation & UX
- **framer-motion 10.16.4**: Advanced animations
- **react-countup**: Animated number counters
- **@emotion/react & @emotion/styled**: CSS-in-JS styling

#### Forms & Validation
- **formik 2.2.9**: Form handling and validation
- **yup 0.32.11**: Schema validation library

#### Utilities
- **html2canvas 1.4.1**: Screenshot generation
- **jspdf 3.0.1**: PDF generation
- **jspdf-autotable 5.0.2**: PDF table generation
- **web-vitals 2.1.4**: Performance monitoring

#### Testing
- **@testing-library/react**: React component testing
- **@testing-library/jest-dom**: DOM testing utilities
- **@testing-library/user-event**: User interaction testing

## Backend Dependencies (Spring Boot)

### Maven POM.xml Dependencies
```xml
<dependencies>
    <!-- Spring Boot Starters -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-integration</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    
    <!-- Validation -->
    <dependency>
        <groupId>org.hibernate.validator</groupId>
        <artifactId>hibernate-validator</artifactId>
        <version>8.0.1.Final</version>
    </dependency>
    <dependency>
        <groupId>jakarta.validation</groupId>
        <artifactId>jakarta.validation-api</artifactId>
        <version>3.0.2</version>
    </dependency>
    
    <!-- Database -->
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
        <version>8.0.33</version>
    </dependency>
    
    <!-- Development Tools -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-devtools</artifactId>
        <scope>runtime</scope>
        <optional>true</optional>
    </dependency>
    
    <!-- Utilities -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
    <dependency>
        <groupId>org.json</groupId>
        <artifactId>json</artifactId>
        <version>20231013</version>
    </dependency>
    
    <!-- Testing -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.springframework.integration</groupId>
        <artifactId>spring-integration-test</artifactId>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.springframework.security</groupId>
        <artifactId>spring-security-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

### Backend Dependency Analysis

#### Spring Boot Framework
- **spring-boot-starter-parent 3.4.6**: Latest stable Spring Boot
- **spring-boot-starter-web**: Web MVC and REST API
- **spring-boot-starter-data-jpa**: Database ORM with Hibernate
- **spring-boot-starter-security**: Authentication and authorization
- **spring-boot-starter-integration**: Enterprise integration patterns

#### Database & Persistence
- **mysql-connector-j 8.0.33**: MySQL database driver
- **hibernate-validator 8.0.1.Final**: Bean validation
- **jakarta.validation-api 3.0.2**: Validation API
- **jakarta.persistence-api 3.1.0**: JPA specification

#### Development Tools
- **spring-boot-devtools**: Hot reload and development features
- **lombok**: Code generation (getters, setters, constructors)

#### Utilities
- **org.json 20231013**: JSON processing
- **spring-integration-http**: HTTP integration support

## Python ML Dependencies

### Required Python Packages
```txt
# Core ML Libraries
numpy>=1.21.0
pandas>=1.3.0
scikit-learn>=1.0.0
xgboost>=1.5.0
tensorflow>=2.8.0

# Data Processing
joblib>=1.1.0
pickle-mixin>=1.0.2

# System Integration
sys (built-in)
json (built-in)
os (built-in)
time (built-in)
```

### Python Environment Setup
```bash
# Create virtual environment
python -m venv fraud_detection_env

# Activate environment (Windows)
fraud_detection_env\Scripts\activate

# Activate environment (macOS/Linux)
source fraud_detection_env/bin/activate

# Install dependencies
pip install numpy pandas scikit-learn xgboost tensorflow joblib
```

### ML Model Files Required
```
src/main/resources/models/
├── random_forest_model.pkl      # Random Forest classifier
├── xgboost_model.pkl           # XGBoost classifier  
├── cnn_model.h5                # TensorFlow/Keras CNN model
├── scaler_rf.pkl               # StandardScaler for RF
├── scaler.pkl                  # StandardScaler for XGBoost
└── pca_model.pkl               # PCA dimensionality reduction
```

## Database Requirements

### MySQL Configuration
```sql
-- Minimum MySQL version: 8.0
-- Required features:
-- - InnoDB storage engine
-- - Foreign key constraints
-- - Triggers
-- - JSON data type support
-- - Full-text indexing

-- Database creation
CREATE DATABASE financial_detection_system 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- User privileges
GRANT ALL PRIVILEGES ON financial_detection_system.* 
TO 'fraud_app'@'localhost' 
IDENTIFIED BY 'secure_password';
```

### Database Schema Requirements
```sql
-- Required tables with relationships
CREATE TABLE transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    transaction_id VARCHAR(50) UNIQUE NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    type VARCHAR(30) NOT NULL,
    status ENUM('normal', 'suspicious', 'fraud') NOT NULL,
    risk_score INT NOT NULL,
    timestamp DATETIME NOT NULL,
    day INT NOT NULL,
    transaction_pair_code VARCHAR(10) NOT NULL,
    part_of_the_day VARCHAR(20) NOT NULL
);

CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    transaction_id VARCHAR(50) NOT NULL,
    risk_score INT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE risk_factors (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    transaction_id VARCHAR(50) NOT NULL,
    factor TEXT NOT NULL
);

CREATE TABLE daily_statistics (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    date DATE UNIQUE NOT NULL,
    total_transactions INT DEFAULT 0,
    fraud_transactions INT DEFAULT 0,
    suspicious_transactions INT DEFAULT 0,
    normal_transactions INT DEFAULT 0,
    total_amount DECIMAL(15,2) DEFAULT 0,
    fraud_amount DECIMAL(15,2) DEFAULT 0
);
```

## Development Tools

### Required Development Tools
```bash
# Java Development
- OpenJDK 17+ or Oracle JDK 17+
- Maven 3.6+ (for building)
- IDE: IntelliJ IDEA, Eclipse, or VS Code

# Frontend Development  
- Node.js 16+ with npm
- IDE: VS Code, WebStorm, or Atom
- Browser: Chrome, Firefox (with dev tools)

# Database Development
- MySQL Workbench or phpMyAdmin
- Database client: DBeaver, Sequel Pro

# Version Control
- Git 2.30+
- GitHub Desktop (optional)

# Testing Tools
- Postman (API testing)
```

## Installation Scripts

### Windows Installation Scripts
```batch
REM verify_system.bat
@echo off
echo Verifying system requirements...

REM Check Java
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Java not found
    exit /b 1
)

REM Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found
    exit /b 1
)

REM Check Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python not found
    exit /b 1
)

REM Check MySQL
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: MySQL not found
    exit /b 1
)

echo All requirements verified successfully!
```

### Setup Script
```batch
REM setup_complete_system.bat
@echo off
echo Setting up Financial Fraud Detection System...

REM Setup database
echo Creating database...
mysql -u root -p < database_schema.sql

REM Install backend dependencies
echo Installing backend dependencies...
cd FFDS-backend-tasks
mvn clean install -DskipTests

REM Install frontend dependencies
echo Installing frontend dependencies...
cd ..\FFDS-
npm install

REM Install Python dependencies
echo Installing Python dependencies...
pip install numpy pandas scikit-learn xgboost tensorflow joblib

echo Setup completed successfully!
```

## Environment Configuration

### Environment Variables
```bash
# Database configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=financial_detection_system
DB_USERNAME=root
DB_PASSWORD=your_password

# Application configuration
SERVER_PORT=8089
FRONTEND_PORT=3000

# Python configuration
PYTHON_PATH=/usr/bin/python3
PYTHONPATH=/path/to/models

# Java configuration
JAVA_HOME=/path/to/java
MAVEN_OPTS=-Xmx2g

# Node.js configuration
NODE_OPTIONS=--max-old-space-size=4096
```

### Configuration Files
```properties
# application.properties
server.port=8089
spring.application.name=financial-fraud-detection-system

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/financial_detection_system
spring.datasource.username=root
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# Logging
logging.level.com.backend.backend=INFO
logging.file.name=logs/fraud-detection.log
```

## Version Compatibility Matrix

### Tested Combinations
| Component | Version | Status | Notes |
|-----------|---------|--------|-------|
| Java | 17.0.15 | ✅ Verified | Primary development version |
| Spring Boot | 3.4.6 | ✅ Verified | Latest stable release |
| Node.js | 16.x, 18.x | ✅ Verified | LTS versions recommended |
| React | 18.2.0 | ✅ Verified | Latest stable with hooks |
| Python | 3.11.2544.0 | ✅ Verified | Windows Store version |
| MySQL | 8.0.42 | ✅ Verified | Latest stable release |
| TensorFlow | 2.8+ | ✅ Verified | CPU version sufficient |
| Maven | 3.6+ | ✅ Verified | Build tool |


## Security Requirements

### Security Dependencies
```xml
<!-- Spring Security -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>

<!-- Validation -->
<dependency>
    <groupId>org.hibernate.validator</groupId>
    <artifactId>hibernate-validator</artifactId>
</dependency>
```

### Security Configuration
- HTTPS enabled (production)
- CORS configured for frontend
- Input validation on all endpoints
- SQL injection protection (JPA)


This comprehensive requirements documentation ensures that all dependencies and system requirements are clearly documented 