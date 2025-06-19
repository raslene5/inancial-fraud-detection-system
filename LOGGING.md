# Logging Guide

This document explains how to check and interpret the logs in the Financial Fraud Detection System.

## Backend Logs

The backend logs are stored in the following locations:

1. **Console Output**: All logs are displayed in the console where the Spring Boot application is running.
2. **Log File**: Logs are also written to `logs/fraud-detection.log` in the application directory.

## Log Types

The system logs the following information:

1. **API Requests**: All incoming API requests are logged with their full details.
2. **Python Script Input/Output**: The data sent to and received from the Python ML model.
3. **Error Information**: Detailed error messages and stack traces when issues occur.

## Testing the Logging

To verify that logging is working correctly:

1. Start the backend server:
   ```
   cd FFDS-backend-tasks
   mvn spring-boot:run
   ```

2. Run the logging test script:
   ```
   cd FFDS-
   node test_logging.js
   ```

3. Check the console output or log file for entries like:
   ```
   Received fraud detection request: FraudRequest{amount=1500.0, day=15, type='CASH_OUT', transaction_pair_code='cm', part_of_the_day='night'}
   Python script input: {"amount":1500.0,"day":15,"type":"CASH_OUT","transaction_pair_code":"cm","part_of_the_day":"night"}
   Python stderr: Python received input: {"amount":1500.0,"day":15,"type":"CASH_OUT","transaction_pair_code":"cm","part_of_the_day":"night"}
   Python stderr: Python prediction result: {"isFraud":true,"probability":0.85,"status":"fraud","riskScore":85,...}
   Python script output: {"isFraud":true,"probability":0.85,"status":"fraud","riskScore":85,...}
   ```

## Log Levels

The system uses the following log levels:

- **INFO**: Normal operational information
- **DEBUG**: Detailed information for debugging
- **WARN**: Warning messages that don't affect operation
- **ERROR**: Error messages for issues that need attention

## Configuring Logging

You can adjust the logging configuration in `application.properties`:

```properties
# Logging Configuration
logging.level.root=INFO
logging.level.com.backend.backend=DEBUG
logging.level.com.backend.backend.controller=INFO
logging.level.com.backend.backend.util=INFO
logging.pattern.console=%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n
logging.file.name=logs/fraud-detection.log
```

To increase logging detail, change the log levels to DEBUG or TRACE.