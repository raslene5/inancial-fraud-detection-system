package com.backend.backend.controller;

import com.backend.backend.dto.FraudResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class FraudHistoryController {

    // In-memory storage for fraud history (would be replaced with a database in production)
    private static final List<FraudResponse> fraudHistory = new CopyOnWriteArrayList<>();

    @PostMapping("/fraud-history")
    public ResponseEntity<FraudResponse> addToHistory(@RequestBody FraudResponse transaction) {
        // Only add fraud or suspicious transactions to history
        if ("fraud".equals(transaction.getStatus()) || "suspicious".equals(transaction.getStatus())) {
            fraudHistory.add(transaction);
            return ResponseEntity.ok(transaction);
        }
        return ResponseEntity.ok(transaction);
    }

    @GetMapping("/fraud-history")
    public ResponseEntity<List<FraudResponse>> getHistory() {
        if (fraudHistory.isEmpty()) {
            // Return sample data if no history exists
            return ResponseEntity.ok(generateSampleData());
        }
        return ResponseEntity.ok(fraudHistory);
    }

    @GetMapping("/fraud-statistics")
    public ResponseEntity<Object> getStatistics() {
        List<FraudResponse> history = fraudHistory.isEmpty() ? generateSampleData() : fraudHistory;
        
        final int totalTransactionsVal = history.size();
        final int fraudCountVal = countFraudTransactions(history);
        final int suspiciousCountVal = countSuspiciousTransactions(history);
        final double fraudAmountVal = calculateFraudAmount(history);
        
        // Create statistics object
        var stats = new Object() {
            public final int totalTransactions = totalTransactionsVal;
            public final int fraudCount = fraudCountVal;
            public final int suspiciousCount = suspiciousCountVal;
            public final double fraudAmount = fraudAmountVal;
            
            // Chart data
            public final Object statusData = new Object() {
                public final String[] labels = {"Normal", "Suspicious", "Fraud"};
                public final int[] values = {
                    totalTransactionsVal - fraudCountVal - suspiciousCountVal,
                    suspiciousCountVal,
                    fraudCountVal
                };
            };
            
            // Sample timeline data
            public final Object timelineData = generateTimelineData();
            
            // Sample type data
            public final Object typeData = new Object() {
                public final String[] labels = {"Credit Card", "Wire Transfer", "Mobile Payment", "Online Banking", "ATM"};
                public final int[] values = {42, 18, 15, 12, 8};
            };
        };
        
        return ResponseEntity.ok(stats);
    }
    
    private int countFraudTransactions(List<FraudResponse> transactions) {
        int count = 0;
        for (FraudResponse transaction : transactions) {
            if ("fraud".equals(transaction.getStatus())) {
                count++;
            }
        }
        return count;
    }
    
    private int countSuspiciousTransactions(List<FraudResponse> transactions) {
        int count = 0;
        for (FraudResponse transaction : transactions) {
            if ("suspicious".equals(transaction.getStatus())) {
                count++;
            }
        }
        return count;
    }
    
    private double calculateFraudAmount(List<FraudResponse> transactions) {
        double amount = 0.0;
        for (FraudResponse transaction : transactions) {
            if ("fraud".equals(transaction.getStatus())) {
                amount += transaction.getAmount();
            }
        }
        return amount;
    }
    
    private Object generateTimelineData() {
        final LocalDateTime today = LocalDateTime.now();
        final List<String> labelsVal = new ArrayList<>();
        final List<Integer> fraudValuesVal = new ArrayList<>();
        final List<Integer> suspiciousValuesVal = new ArrayList<>();
        
        // Generate data for the last 7 days
        for (int i = 6; i >= 0; i--) {
            LocalDateTime date = today.minusDays(i);
            String dayKey = date.format(DateTimeFormatter.ofPattern("yyyy-M-d"));
            labelsVal.add(dayKey);
            
            // Generate some random but realistic-looking data
            fraudValuesVal.add(1 + (int)(Math.random() * 5)); // 1-5 fraud transactions
            suspiciousValuesVal.add(3 + (int)(Math.random() * 8)); // 3-10 suspicious transactions
        }
        
        return new Object() {
            public final List<String> labels = labelsVal;
            public final List<Integer> values = fraudValuesVal;
            public final List<Integer> secondaryValues = suspiciousValuesVal;
        };
    }
    
    private List<FraudResponse> generateSampleData() {
        List<FraudResponse> sampleData = new ArrayList<>();
        String[] types = {"PAYMENT", "TRANSFER", "CASH_OUT", "CASH_IN", "DEBIT"};
        String[] pairCodes = {"cc", "cm"};
        String[] dayParts = {"morning", "afternoon", "evening", "night"};
        String[] statuses = {"normal", "suspicious", "fraud"};
        
        // Generate 10 sample transactions
        for (int i = 0; i < 10; i++) {
            FraudResponse transaction = new FraudResponse();
            transaction.setTransactionId("TX" + (10000 + i));
            transaction.setTimestamp(LocalDateTime.now().minusDays(i % 7).format(DateTimeFormatter.ISO_DATE_TIME));
            transaction.setAmount(100 + Math.random() * 1000);
            transaction.setType(types[i % types.length]);
            transaction.setStatus(statuses[i % statuses.length]);
            transaction.setRiskScore(transaction.getStatus().equals("fraud") ? 80 + i : 
                                    transaction.getStatus().equals("suspicious") ? 50 + i : 20 + i);
            transaction.setDay(1 + (i % 28));
            transaction.setTransaction_pair_code(pairCodes[i % pairCodes.length]);
            transaction.setPart_of_the_day(dayParts[i % dayParts.length]);
            
            List<String> factors = new ArrayList<>();
            if (transaction.getStatus().equals("fraud") || transaction.getStatus().equals("suspicious")) {
                factors.add("High transaction amount");
                if (transaction.getStatus().equals("fraud")) {
                    factors.add("Unusual transaction pattern");
                }
                if (transaction.getPart_of_the_day().equals("night")) {
                    factors.add("Unusual transaction time");
                }
            }
            transaction.setFactors(factors);
            
            sampleData.add(transaction);
        }
        
        Collections.sort(sampleData, (a, b) -> b.getTimestamp().compareTo(a.getTimestamp()));
        return sampleData;
    }
}