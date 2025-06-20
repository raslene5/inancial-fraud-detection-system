-- Insert sample transactions
INSERT INTO transactions (transaction_id, amount, type, status, risk_score, timestamp, day, transaction_pair_code, part_of_the_day) 
VALUES 
('TXN001', 1500.00, 'TRANSFER', 'normal', 25, '2024-01-01 09:15:00', 1, 'ABC123', 'morning'),
('TXN002', 50000.00, 'CASH_OUT', 'suspicious', 85, '2024-01-01 23:45:00', 1, 'DEF456', 'night'),
('TXN003', 100.00, 'PAYMENT', 'fraud', 95, '2024-01-02 15:30:00', 2, 'GHI789', 'afternoon'),
('TXN004', 2500.00, 'TRANSFER', 'normal', 30, '2024-01-02 10:20:00', 2, 'JKL012', 'morning'),
('TXN005', 75000.00, 'CASH_OUT', 'fraud', 92, '2024-01-03 02:15:00', 3, 'MNO345', 'night');

-- Insert sample risk factors
INSERT INTO risk_factors (transaction_id, factor) VALUES
('TXN002', 'High transaction amount'),
('TXN002', 'Unusual transaction time'),
('TXN003', 'Suspicious merchant'),
('TXN003', 'Multiple failed attempts'),
('TXN005', 'High transaction amount'),
('TXN005', 'Unusual location');

-- Insert sample notifications
INSERT INTO notifications (type, message, transaction_id, risk_score, is_read) VALUES
('suspicious', 'High risk transaction detected: TXN002', 'TXN002', 85, false),
('fraud', 'Fraudulent transaction detected: TXN003', 'TXN003', 95, false),
('fraud', 'Fraudulent transaction detected: TXN005', 'TXN005', 92, true);