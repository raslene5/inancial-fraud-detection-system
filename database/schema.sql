-- Financial Fraud Detection System Database Schema
-- MySQL 8.0+ Compatible

CREATE DATABASE IF NOT EXISTS fraud_detection;
USE fraud_detection;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    user_id BIGINT,
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    transaction_type VARCHAR(50) NOT NULL,
    merchant_name VARCHAR(255),
    merchant_category VARCHAR(100),
    location VARCHAR(255),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_transaction_id (transaction_id),
    INDEX idx_user_id (user_id),
    INDEX idx_timestamp (timestamp),
    INDEX idx_amount (amount)
);

-- Fraud predictions table
CREATE TABLE IF NOT EXISTS fraud_predictions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    transaction_id BIGINT NOT NULL,
    prediction_result ENUM('normal', 'suspicious', 'fraud') NOT NULL,
    confidence_score DECIMAL(5,4) NOT NULL,
    risk_score DECIMAL(5,2) NOT NULL,
    model_version VARCHAR(20) DEFAULT '1.0',
    prediction_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    risk_factors JSON,
    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
    INDEX idx_transaction_id (transaction_id),
    INDEX idx_prediction_result (prediction_result),
    INDEX idx_risk_score (risk_score),
    INDEX idx_prediction_timestamp (prediction_timestamp)
);

-- Fraud alerts table
CREATE TABLE IF NOT EXISTS fraud_alerts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    transaction_id BIGINT NOT NULL,
    alert_type ENUM('fraud', 'suspicious', 'high_risk') NOT NULL,
    severity ENUM('low', 'medium', 'high', 'critical') NOT NULL,
    message TEXT NOT NULL,
    status ENUM('open', 'investigating', 'resolved', 'false_positive') DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    resolved_by BIGINT NULL,
    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
    FOREIGN KEY (resolved_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_transaction_id (transaction_id),
    INDEX idx_alert_type (alert_type),
    INDEX idx_severity (severity),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- Insert sample data
INSERT INTO users (username, email, password_hash, first_name, last_name) VALUES
('admin', 'admin@frauddetection.com', '$2a$10$example_hash', 'System', 'Administrator'),
('analyst', 'analyst@frauddetection.com', '$2a$10$example_hash', 'Fraud', 'Analyst');

-- Sample transactions
INSERT INTO transactions (transaction_id, user_id, amount, transaction_type, merchant_name, location) VALUES
('TXN001', 1, 150.00, 'purchase', 'Amazon', 'Online'),
('TXN002', 1, 2500.00, 'purchase', 'Electronics Store', 'New York'),
('TXN003', 2, 50.00, 'withdrawal', 'ATM', 'Los Angeles'),
('TXN004', 2, 10000.00, 'transfer', 'Bank Transfer', 'International');

-- Sample fraud predictions
INSERT INTO fraud_predictions (transaction_id, prediction_result, confidence_score, risk_score, risk_factors) VALUES
(1, 'normal', 0.9500, 15.50, '["normal_amount", "known_merchant"]'),
(2, 'suspicious', 0.7500, 65.00, '["high_amount", "electronics"]'),
(3, 'normal', 0.9200, 20.00, '["normal_withdrawal"]'),
(4, 'fraud', 0.9800, 95.50, '["high_amount", "international", "unusual_pattern"]');

-- Sample fraud alerts
INSERT INTO fraud_alerts (transaction_id, alert_type, severity, message) VALUES
(2, 'suspicious', 'medium', 'High-value electronics purchase detected'),
(4, 'fraud', 'critical', 'Potential fraudulent international transfer detected');

-- Create indexes for performance
CREATE INDEX idx_transactions_amount_timestamp ON transactions(amount, timestamp);
CREATE INDEX idx_fraud_predictions_result_score ON fraud_predictions(prediction_result, risk_score);
CREATE INDEX idx_fraud_alerts_type_severity ON fraud_alerts(alert_type, severity);

-- Create views for common queries
CREATE VIEW fraud_summary AS
SELECT 
    DATE(fp.prediction_timestamp) as date,
    fp.prediction_result,
    COUNT(*) as count,
    AVG(fp.risk_score) as avg_risk_score,
    SUM(t.amount) as total_amount
FROM fraud_predictions fp
JOIN transactions t ON fp.transaction_id = t.id
GROUP BY DATE(fp.prediction_timestamp), fp.prediction_result;

CREATE VIEW high_risk_transactions AS
SELECT 
    t.transaction_id,
    t.amount,
    t.merchant_name,
    t.location,
    t.timestamp,
    fp.prediction_result,
    fp.risk_score,
    fp.confidence_score
FROM transactions t
JOIN fraud_predictions fp ON t.id = fp.transaction_id
WHERE fp.risk_score > 70.0
ORDER BY fp.risk_score DESC;