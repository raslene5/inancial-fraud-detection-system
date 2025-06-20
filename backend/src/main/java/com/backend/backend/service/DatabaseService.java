package com.backend.backend.service;

import com.backend.backend.entity.DailyStatistics;
import com.backend.backend.entity.Notification;
import com.backend.backend.entity.Transaction;
import com.backend.backend.repository.DailyStatisticsRepository;
import com.backend.backend.repository.NotificationRepository;
import com.backend.backend.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
public class DatabaseService {

    @Autowired
    private TransactionRepository transactionRepository;
    
    @Autowired
    private DailyStatisticsRepository dailyStatisticsRepository;
    
    @Autowired
    private NotificationRepository notificationRepository;

    public Map<String, Object> getDashboardData() {
        Map<String, Object> data = new HashMap<>();
        
        data.put("totalTransactions", transactionRepository.count());
        data.put("fraudCount", transactionRepository.countByStatus(Transaction.TransactionStatus.fraud));
        data.put("suspiciousCount", transactionRepository.countByStatus(Transaction.TransactionStatus.suspicious));
        data.put("normalCount", transactionRepository.countByStatus(Transaction.TransactionStatus.normal));
        data.put("unreadNotifications", notificationRepository.countUnreadNotifications());
        data.put("recentTransactions", transactionRepository.findRecentTransactions(java.time.LocalDateTime.now().minusDays(7)));
        data.put("dailyStats", dailyStatisticsRepository.findLast7Days());
        
        return data;
    }
    
    public List<DailyStatistics> getFraudTimeline() {
        return dailyStatisticsRepository.findLast30Days();
    }
    
    public List<Notification> getNotifications() {
        return notificationRepository.findAllOrderByCreatedAtDesc();
    }
    
    public void markNotificationAsRead(Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(notification -> {
            notification.setIsRead(true);
            notificationRepository.save(notification);
        });
    }
}