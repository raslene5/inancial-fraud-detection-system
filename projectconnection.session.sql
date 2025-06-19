CREATE DATABASE IF NOT EXISTS financial_detection_system;
USE  financial_detection_system;
CREATE TABLE transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  transaction_id VARCHAR(50) NOT NULL UNIQUE,
  amount DECIMAL(15,2) NOT NULL,
  type VARCHAR(30) NOT NULL,
  status ENUM('normal', 'suspicious', 'fraud') NOT NULL,
  risk_score INT NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  day INT NOT NULL,
  transaction_pair_code VARCHAR(10) NOT NULL,
  part_of_the_day VARCHAR(20) NOT NULL
);

-- Create risk_factors table
CREATE TABLE risk_factors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  transaction_id VARCHAR(50) NOT NULL,
  factor VARCHAR(100) NOT NULL,
  FOREIGN KEY (transaction_id) REFERENCES transactions(transaction_id)
);

-- Create daily_statistics table
CREATE TABLE daily_statistics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  normal_count INT DEFAULT 0,
  suspicious_count INT DEFAULT 0,
  fraud_count INT DEFAULT 0,
  total_amount DECIMAL(15,2) DEFAULT 0,
  fraud_amount DECIMAL(15,2) DEFAULT 0
);

-- Create notifications table
CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  transaction_id VARCHAR(50) NOT NULL,
  risk_score INT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (transaction_id) REFERENCES transactions(transaction_id)
);

-- Create reports table
CREATE TABLE reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  file_path VARCHAR(255) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_timestamp ON transactions(timestamp);
CREATE INDEX idx_transactions_risk_score ON transactions(risk_score);
CREATE INDEX idx_daily_statistics_date ON daily_statistics(date);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- Create a stored procedure to update daily statistics
DELIMITER //
CREATE PROCEDURE update_daily_statistics(IN transaction_date DATE)
BEGIN
  DECLARE normal_cnt INT;
  DECLARE suspicious_cnt INT;
  DECLARE fraud_cnt INT;
  DECLARE total_amt DECIMAL(15,2);
  DECLARE fraud_amt DECIMAL(15,2);
  
  -- Get counts for each status
  SELECT 
    COUNT(CASE WHEN status = 'normal' THEN 1 END),
    COUNT(CASE WHEN status = 'suspicious' THEN 1 END),
    COUNT(CASE WHEN status = 'fraud' THEN 1 END),
    SUM(amount),
    SUM(CASE WHEN status = 'fraud' THEN amount ELSE 0 END)
  INTO 
    normal_cnt, suspicious_cnt, fraud_cnt, total_amt, fraud_amt
  FROM transactions
  WHERE DATE(timestamp) = transaction_date;
  
  -- Insert or update daily statistics
  INSERT INTO daily_statistics (date, normal_count, suspicious_count, fraud_count, total_amount, fraud_amount)
  VALUES (transaction_date, normal_cnt, suspicious_cnt, fraud_cnt, IFNULL(total_amt, 0), IFNULL(fraud_amt, 0))
  ON DUPLICATE KEY UPDATE
    normal_count = normal_cnt,
    suspicious_count = suspicious_cnt,
    fraud_count = fraud_cnt,
    total_amount = IFNULL(total_amt, 0),
    fraud_amount = IFNULL(fraud_amt, 0);
END //
DELIMITER ;

-- Create a trigger to update statistics after transaction insert
DELIMITER //
CREATE TRIGGER after_transaction_insert
AFTER INSERT ON transactions
FOR EACH ROW
BEGIN
  CALL update_daily_statistics(DATE(NEW.timestamp));
END //
DELIMITER ;

-- Create a trigger to update statistics after transaction update
DELIMITER //
CREATE TRIGGER after_transaction_update
AFTER UPDATE ON transactions
FOR EACH ROW
BEGIN
  IF OLD.status != NEW.status OR OLD.amount != NEW.amount THEN
    CALL update_daily_statistics(DATE(NEW.timestamp));
    
    -- If the old date is different, update that day's statistics too
    IF DATE(OLD.timestamp) != DATE(NEW.timestamp) THEN
      CALL update_daily_statistics(DATE(OLD.timestamp));
    END IF;
  END IF;
END //
DELIMITER ;

-- Create a trigger to update statistics after transaction delete
DELIMITER //
CREATE TRIGGER after_transaction_delete
AFTER DELETE ON transactions
FOR EACH ROW
BEGIN
  CALL update_daily_statistics(DATE(OLD.timestamp));
END //
DELIMITER ;

-- Create a view for fraud timeline data (last 30 days)
CREATE VIEW fraud_timeline AS
SELECT 
  date,
  fraud_count AS fraud_values,
  suspicious_count AS suspicious_values
FROM daily_statistics
WHERE date >= CURDATE() - INTERVAL 30 DAY
ORDER BY date;