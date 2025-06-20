package com.backend.backend.service;

import com.backend.backend.dto.FraudRequest;
import com.backend.backend.dto.FraudResponse;
import com.backend.backend.entity.Transaction;
import com.backend.backend.entity.Notification;
import com.backend.backend.repository.TransactionRepository;
import com.backend.backend.repository.NotificationRepository;
import com.backend.backend.util.PythonInvoker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class FraudDetectionService {

    @Autowired
    private PythonInvoker pythonInvoker;
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    @Autowired
    private NotificationRepository notificationRepository;

    public FraudResponse detectFraud(FraudRequest request) throws IOException, InterruptedException {
        FraudResponse response = pythonInvoker.invokePythonScript(request);
        
        Transaction transaction = createTransactionFromRequest(request, response);
        transactionRepository.save(transaction);
        
        if (response.getRiskScore() >= 70) {
            createNotification(transaction, response);
        }
        
        return response;
    }
    
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }
    
    public List<Transaction> getRecentTransactions() {
        LocalDateTime since = LocalDateTime.now().minusDays(7);
        return transactionRepository.findRecentTransactions(since);
    }
    
    public List<Transaction> getHighRiskTransactions() {
        return transactionRepository.findHighRiskTransactions(70);
    }
    
    private Transaction createTransactionFromRequest(FraudRequest request, FraudResponse response) {
        Transaction transaction = new Transaction();
        transaction.setTransactionId(UUID.randomUUID().toString());
        transaction.setAmount(BigDecimal.valueOf(request.getAmount()));
        transaction.setType(request.getType());
        transaction.setStatus(determineStatus(response.getRiskScore()));
        transaction.setRiskScore(response.getRiskScore());
        transaction.setTimestamp(LocalDateTime.now());
        transaction.setDay(request.getDay());
        transaction.setTransactionPairCode("AUTO" + System.currentTimeMillis() % 10000);
        transaction.setPartOfTheDay(determinePartOfDay());
        return transaction;
    }
    
    private Transaction.TransactionStatus determineStatus(int riskScore) {
        if (riskScore >= 80) return Transaction.TransactionStatus.fraud;
        if (riskScore >= 50) return Transaction.TransactionStatus.suspicious;
        return Transaction.TransactionStatus.normal;
    }
    
    private String determinePartOfDay() {
        int hour = LocalDateTime.now().getHour();
        if (hour >= 6 && hour < 12) return "morning";
        if (hour >= 12 && hour < 18) return "afternoon";
        if (hour >= 18 && hour < 22) return "evening";
        return "night";
    }
    
    private void createNotification(Transaction transaction, FraudResponse response) {
        Notification notification = new Notification();
        notification.setType(transaction.getStatus().name());
        notification.setMessage("High risk transaction detected: " + transaction.getTransactionId());
        notification.setTransactionId(transaction.getTransactionId());
        notification.setRiskScore(response.getRiskScore());
        notification.setIsRead(false);
        notificationRepository.save(notification);
    }
}