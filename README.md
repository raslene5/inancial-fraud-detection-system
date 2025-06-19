# Financial Fraud Detection System

A comprehensive system for detecting and analyzing fraudulent financial transactions using machine learning models.

## System Architecture

The system consists of two main components:

1. **Frontend**: React-based UI for transaction submission, visualization, and analysis
2. **Backend**: Spring Boot Java application with Python ML integration

## Prerequisites

- Node.js 14+ and npm
- Java 11+
- Maven
- Python 3.7+
- Required Python packages: numpy, joblib, scikit-learn

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd FFDS-backend-tasks
   ```

2. Install Python dependencies:
   ```
   pip install numpy joblib scikit-learn
   ```

3. Build and run the Spring Boot application:
   ```
   mvn spring-boot:run
   ```
   The backend will start on port 8089.

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd FFDS-
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```
   The frontend will start on port 3000.

## Testing the System

### Integration Tests

Run the integration test script to verify that all components are working together:

```
cd FFDS-
node integration_test.js
```

This will test:
- Backend health endpoint
- Fraud detection API with various test cases

### Manual Testing

1. Start both the backend and frontend using the provided `start_system.bat` script
2. Open the frontend in your browser at http://localhost:3000
3. Use the transaction form to submit test transactions
4. Verify that the results are displayed correctly

## System Components

### Frontend Components

- **Dashboard**: Main overview with statistics and charts
- **TransactionForm**: Form for submitting transactions for analysis
- **FraudChart**: Visualization of fraud statistics
- **RecentFraudList**: List of recent fraudulent transactions

### Backend Components

- **FraudDetectionController**: REST API endpoint for fraud detection
- **HealthCheckController**: Endpoint for system health monitoring
- **PythonInvoker**: Service for invoking the Python ML model
- **predict.py**: Python script containing the ML model for fraud detection

## API Documentation

### Health Check API

**Endpoint**: `GET /api/health`

**Response**:
```json
{
  "status": "UP",
  "timestamp": "2023-05-15T10:30:00",
  "service": "Fraud Detection API",
  "version": "1.0.0"
}
```

### Fraud Detection API

**Endpoint**: `POST /api/fraud-detect`

**Request Body**:
```json
{
  "amount": 1000,
  "day": 15,
  "type": "PAYMENT",
  "transaction_pair_code": "cc",
  "part_of_the_day": "morning"
}
```

**Response**:
```json
{
  "isFraud": false,
  "probability": 0.15,
  "status": "normal",
  "riskScore": 15,
  "transactionId": "TX12345678",
  "timestamp": "2023-05-15T10:30:00",
  "amount": 1000,
  "type": "PAYMENT",
  "day": 15,
  "transaction_pair_code": "cc",
  "part_of_the_day": "morning",
  "factors": []
}
```

## Error Handling

The system includes comprehensive error handling:

1. **Backend Errors**: Detailed error messages with stack traces
2. **API Communication Errors**: Fallback responses when the API is unavailable
3. **Frontend Error Display**: User-friendly error messages and status indicators

## Troubleshooting

- **Backend not starting**: Check Java and Python installations
- **API connection issues**: Verify the backend is running on port 8089
- **Model loading errors**: Ensure all required Python packages are installed
- **Frontend display issues**: Check browser console for JavaScript errors