package com.backend.backend.controller;

import com.backend.backend.service.DatabaseService;
import com.backend.backend.entity.DailyStatistics;
import com.backend.backend.entity.Notification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private DatabaseService databaseService;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> dashboardData = databaseService.getDashboardData();
        return ResponseEntity.ok(dashboardData);
    }
    
    @GetMapping("/fraud-timeline")
    public ResponseEntity<List<DailyStatistics>> getFraudTimeline() {
        List<DailyStatistics> timeline = databaseService.getFraudTimeline();
        return ResponseEntity.ok(timeline);
    }
    
    @GetMapping("/notifications")
    public ResponseEntity<List<Notification>> getNotifications() {
        List<Notification> notifications = databaseService.getNotifications();
        return ResponseEntity.ok(notifications);
    }
    
    @PutMapping("/notifications/{id}/read")
    public ResponseEntity<Void> markNotificationAsRead(@PathVariable Long id) {
        databaseService.markNotificationAsRead(id);
        return ResponseEntity.ok().build();
    }
}