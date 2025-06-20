# Financial Fraud Detection System - Quick Start Guide

## 🚀 Quick Setup (3 Steps)

### Step 1: Verify System
```bash
verify_system.bat
```
This checks if all required software is installed.

### Step 2: Setup Database & Dependencies
```bash
setup_complete_system.bat
```
This will:
- Create the MySQL database and tables
- Install all Python and Node.js dependencies
- Build the backend application

### Step 3: Start the System
```bash
start_integrated_system_secure.bat
```
This starts both frontend and backend servers.

## 🔧 Individual Components

### Backend Only
```bash
start_backend.bat
```

### Frontend Only
```bash
cd ..\FFDS-
start_frontend.bat
```

## 🔒 Security Fix Applied

The database connection issue has been fixed with secure password handling:
- Password is prompted at runtime (not stored in files)
- Environment variables are used for secure configuration
- Sensitive files are excluded from version control

## 📊 System URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8089
- **Health Check**: http://localhost:8089/actuator/health

## 🗄️ Database Schema

The system uses MySQL with these tables:
- `transactions` - All fraud detection results
- `notifications` - High-risk transaction alerts  
- `risk_factors` - Risk factors for transactions
- `daily_statistics` - Aggregated daily stats

## 🔍 API Endpoints

- `POST /api/fraud-detect` - Detect fraud in transactions
- `GET /api/dashboard` - Get dashboard statistics
- `GET /api/fraud-timeline` - Get fraud timeline data
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/{id}/read` - Mark notification as read

## ❗ Troubleshooting

1. **Database Connection Error**: Run `verify_system.bat` to check MySQL
2. **Port Already in Use**: Close other applications using ports 3000 or 8089
3. **Build Errors**: Ensure Java 17+ and Maven are properly installed
4. **Frontend Issues**: Delete `node_modules` and run `npm install`

## 📝 Next Steps

After starting the system:
1. Open http://localhost:3000 in your browser
2. Test fraud detection with sample transactions
3. View dashboard analytics and notifications
4. Check the fraud history and reports

The system is now ready for use! 🎉