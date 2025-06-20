# 🏗️ System Architecture Documentation

## Overview
The Financial Fraud Detection System follows a modern 3-tier architecture with microservices principles, combining traditional web technologies with advanced machine learning capabilities.

## Architecture Layers

### 1. Presentation Layer (Frontend)
```
React Application (Port 3000)
├── Components/
│   ├── Dashboard Components
│   ├── Chart Components (Chart.js, Nivo)
│   ├── Form Components (Material-UI)
│   └── Animation Components (Framer Motion)
├── Services/
│   ├── FraudService.js (API calls)
│   └── NotificationService.js
└── Themes/
    └── Material-UI Theme Configuration
```

**Key Technologies:**
- React 18.2.0 with Hooks
- Material-UI 5.10.5 for professional UI
- Chart.js 3.9.1 + Nivo for data visualization
- Framer Motion 10.16.4 for animations
- React Router DOM 6.3.0 for navigation

### 2. Application Layer (Backend)
```
Spring Boot Application (Port 8089)
├── Controllers/
│   ├── FraudDetectionController
│   ├── DashboardController
│   ├── FraudHistoryController
│   └── HealthCheckController
├── Services/
│   ├── FraudDetectionService
│   └── DatabaseService
├── Entities/
│   ├── Transaction
│   ├── Notification
│   ├── RiskFactor
│   └── DailyStatistics
├── Repositories/
│   └── JPA Repositories
└── Utils/
    └── PythonInvoker (ML Integration)
```

**Key Technologies:**
- Spring Boot 3.4.6
- Spring Data JPA
- Spring Security
- Java 17
- Maven build system

### 3. Data Layer (Database)
```
MySQL Database (Port 3306)
├── Tables/
│   ├── transactions (main fraud data)
│   ├── notifications (alerts)
│   ├── risk_factors (analysis factors)
│   └── daily_statistics (aggregated data)
├── Indexes/
│   ├── Primary keys
│   ├── Foreign keys
│   └── Performance indexes
└── Triggers/
    └── Auto-update statistics
```

### 4. Machine Learning Layer
```
Python ML Engine
├── Models/
│   ├── random_forest_model.pkl (Primary)
│   ├── xgboost_model.pkl (Secondary)
│   ├── cnn_model.h5 (Deep Learning)
│   ├── scaler_rf.pkl (RF Preprocessing)
│   ├── scaler.pkl (XGB Preprocessing)
│   └── pca_model.pkl (Dimensionality Reduction)
├── Processing/
│   ├── Feature Engineering
│   ├── One-hot Encoding
│   └── Data Scaling
└── Ensemble/
    └── Weighted Voting Algorithm
```

## Hybrid ML Architecture (RF + XGBoost → CNN)

### Stage 1: Traditional ML Models
```
Input Features → [Random Forest] → RF Probability
                ↓
Input Features → [XGBoost] → XGB Probability
```

### Stage 2: Deep Learning Refinement
```
[Original Features + RF Prob + XGB Prob] → [CNN] → Final Prediction
```

### Ensemble Weighting
- **Random Forest**: 70% (Primary model)
- **XGBoost**: 20% (Secondary model)
- **CNN**: 10% (Refinement model)

## Data Flow Architecture

### 1. Fraud Detection Request Flow
```
Frontend Form → REST API → Java Service → Python ML → Database → Response
     ↓              ↓           ↓            ↓          ↓         ↓
  User Input → JSON Request → Processing → Prediction → Storage → UI Update
```

### 2. Dashboard Data Flow
```
Database → JPA Repository → Service Layer → REST Controller → JSON Response → React Components
    ↓           ↓              ↓              ↓               ↓              ↓
Statistics → Entity Objects → Business Logic → HTTP Response → State Update → Chart Rendering
```

## Security Architecture

### Authentication & Authorization
- Spring Security configuration
- CORS enabled for frontend communication
- Input validation and sanitization

### Data Security
- SQL injection prevention (JPA/Hibernate)

## Performance Architecture

### Caching Strategy
- Frontend component memoization

### Optimization Features
- Database indexes on frequently queried columns
- Efficient SQL queries with JPA

## Scalability Considerations
- Stateless backend services
- Database connection pooling

## Integration Points

### Frontend ↔ Backend
- RESTful API communication
- JSON data exchange
- Error handling and user feedback

### Backend ↔ Database
- JPA/Hibernate ORM
- Connection pooling
- Transaction management
- Automatic schema updates

### Backend ↔ ML Engine
- Process-based Python execution
- JSON input/output format
- Error handling and fallbacks
- Logging and monitoring

## Deployment Architecture

### Development Environment
```
Local Machine
├── Frontend (npm start)
├── Backend (mvn spring-boot:run)
├── Database (MySQL local)
└── ML Models (local files)
```

### Production Ready Features
- Logging and monitoring
- Health check endpoints
- Error recovery mechanisms

## Technology Justification

### Why React?
- Component-based architecture
- Rich ecosystem for UI components
- Excellent charting libraries
- Strong community support

### Why Spring Boot?
- Rapid development
- Built-in security features
- Excellent database integration
- Production-ready features

### Why MySQL?
- ACID compliance
- Excellent performance
- Strong consistency
- Rich feature set

### Why Python for ML?
- Extensive ML libraries
- Easy model serialization
- Scientific computing ecosystem
- Integration flexibility

## Architecture Benefits

### Maintainability
- Clear separation of concerns
- Modular design
- Standardized patterns
- Comprehensive documentation

### Reliability
- Error handling at all layers
- Fallback mechanisms
- Data validation
- Logging and monitoring

### Performance
- Optimized database queries

### Scalability
- Stateless design
- Database optimization

---

This architecture ensures a robust, scalable, and maintainable fraud detection system that can handle production workloads while maintaining high performance and reliability.