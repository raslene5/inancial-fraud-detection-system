-- Create database
CREATE DATABASE IF NOT EXISTS financial_detection_system;
USE financial_detection_system;

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    transaction_id VARCHAR(50) UNIQUE NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    type VARCHAR(30) NOT NULL,
    status ENUM('normal', 'suspicious', 'fraud') NOT NULL,
    risk_score INT NOT NULL,
    timestamp DATETIME NOT NULL,
    day INT NOT NULL,
    transaction_pair_code VARCHAR(10) NOT NULL,
    part_of_the_day VARCHAR(20) NOT NULL,
    INDEX idx_transaction_id (transaction_id),
    INDEX idx_status (status),
    INDEX idx_timestamp (timestamp)
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    transaction_id VARCHAR(50) NOT NULL,
    risk_score INT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_transaction_id (transaction_id),
    INDEX idx_is_read (is_read)
);

-- Create risk_factors table
CREATE TABLE IF NOT EXISTS risk_factors (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    transaction_id VARCHAR(50) NOT NULL,
    factor TEXT NOT NULL,
    INDEX idx_transaction_id (transaction_id)
);

-- Create daily_statistics table
CREATE TABLE IF NOT EXISTS daily_statistics (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    date DATE UNIQUE NOT NULL,
    total_transactions INT DEFAULT 0,
    fraud_transactions INT DEFAULT 0,
    suspicious_transactions INT DEFAULT 0,
    normal_transactions INT DEFAULT 0,
    total_amount DECIMAL(15,2) DEFAULT 0,
    fraud_amount DECIMAL(15,2) DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_date (date)
);

-- Add foreign key constraints
ALTER TABLE risk_factors 
ADD CONSTRAINT fk_risk_factors_transaction 
FOREIGN KEY (transaction_id) REFERENCES transactions(transaction_id) 
ON DELETE CASCADE;

ALTER TABLE notifications 
ADD CONSTRAINT fk_notifications_transaction 
FOREIGN KEY (transaction_id) REFERENCES transactions(transaction_id) 
ON DELETE CASCADE;

-- Create triggers for automatic statistics updates
DELIMITER //

CREATE TRIGGER IF NOT EXISTS update_daily_stats_insert
AFTER INSERT ON transactions
FOR EACH ROW
BEGIN
    INSERT INTO daily_statistics (date, total_transactions, fraud_transactions, suspicious_transactions, normal_transactions, total_amount, fraud_amount)
    VALUES (DATE(NEW.timestamp), 1, 
            CASE WHEN NEW.status = 'fraud' THEN 1 ELSE 0 END,
            CASE WHEN NEW.status = 'suspicious' THEN 1 ELSE 0 END,
            CASE WHEN NEW.status = 'normal' THEN 1 ELSE 0 END,
            NEW.amount,
            CASE WHEN NEW.status = 'fraud' THEN NEW.amount ELSE 0 END)
    ON DUPLICATE KEY UPDATE
        total_transactions = total_transactions + 1,
        fraud_transactions = fraud_transactions + CASE WHEN NEW.status = 'fraud' THEN 1 ELSE 0 END,
        suspicious_transactions = suspicious_transactions + CASE WHEN NEW.status = 'suspicious' THEN 1 ELSE 0 END,
        normal_transactions = normal_transactions + CASE WHEN NEW.status = 'normal' THEN 1 ELSE 0 END,
        total_amount = total_amount + NEW.amount,
        fraud_amount = fraud_amount + CASE WHEN NEW.status = 'fraud' THEN NEW.amount ELSE 0 END,
        updated_at = CURRENT_TIMESTAMP;
END//

DELIMITER ;

-- Show tables created
SHOW TABLES;