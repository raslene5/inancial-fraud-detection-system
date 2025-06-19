# System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        React Frontend                           │
├─────────────┬─────────────────────────────┬───────────────────┬─┘
│ Components  │        Services              │     State        │
├─────────────┼─────────────────────────────┼───────────────────┤
│ Dashboard   │                             │                   │
│ TransForm   │     FraudService.js         │  Local Storage    │
│ FraudChart  │     - predictFraud()        │  - Fraud History  │
│ Analysis    │     - saveFraudTransaction()│  - Statistics     │
│ Result      │     - getFraudHistory()     │                   │
└─────────────┴─────────────────────────────┴───────────────────┘
         │                    ▲
         │ HTTP POST          │ JSON Response
         │ /api/fraud-detect  │
         ▼                    │
┌─────────────────────────────────────────────────────────────────┐
│                      Spring Boot Backend                        │
├─────────────┬─────────────────────────────┬───────────────────┬─┘
│ Controllers │        Services             │     Models        │
├─────────────┼─────────────────────────────┼───────────────────┤
│ FraudDetect │     PythonInvoker           │  FraudRequest    │
│ Controller  │     - invokePythonScript()  │  FraudResponse   │
│             │     - generateRiskFactors() │                   │
└─────────────┴─────────────────────────────┴───────────────────┘
         │                    ▲
         │ Process           │ JSON Response
         │ Execution         │
         ▼                    │
┌─────────────────────────────────────────────────────────────────┐
│                       Python ML Model                           │
├─────────────────────────────────────────────────────────────────┤
│ predict.py                                                      │
│ - Random Forest Model                                           │
│ - Feature Processing                                            │
│ - Risk Factor Generation                                        │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

1. User submits a transaction through the React frontend form
2. Frontend sends the transaction data to the backend API
3. Backend controller validates the input and passes it to the service
4. PythonInvoker executes the predict.py script with the transaction data
5. Python script processes the data using the ML model and returns a prediction
6. Backend enhances the response with additional information
7. Frontend receives the response and displays the results
8. If fraud is detected, the transaction is saved to local storage

## Key Components

### Frontend

- **TransactionForm**: Collects transaction data from the user
- **AnalysisResult**: Displays the fraud detection results
- **FraudService**: Handles API communication with the backend
- **Dashboard**: Shows statistics and visualizations

### Backend

- **FraudDetectionController**: Exposes the REST API endpoint
- **PythonInvoker**: Executes the Python ML model
- **FraudRequest/Response**: Data transfer objects

### ML Model

- **predict.py**: Contains the Random Forest model for fraud detection
- **Models Directory**: Contains the trained ML models and scalers