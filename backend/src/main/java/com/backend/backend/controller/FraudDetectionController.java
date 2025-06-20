package com.backend.backend.controller;

import com.backend.backend.dto.FraudRequest;
import com.backend.backend.dto.FraudResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class FraudDetectionController {
    
    private static final Logger logger = LoggerFactory.getLogger(FraudDetectionController.class);

    private static final List<String> VALID_TYPES = Arrays.asList("CASH_OUT", "TRANSFER", "PAYMENT", "CASH_IN",
            "DEBIT");
    private static final List<String> VALID_PAIR_CODES = Arrays.asList("cc", "cm");
    private static final List<String> VALID_PARTS_OF_DAY = Arrays.asList("morning", "afternoon", "evening", "night");
    
    @Autowired
    private com.backend.backend.service.FraudDetectionService fraudDetectionService;

    @PostMapping("/fraud-detect")
    public ResponseEntity<?> detectFraud(@RequestBody FraudRequest request) {
        // Log the input request
        logger.info("Received fraud detection request: {}", request);
        
        // Validate input fields
        if (request == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Request body is null");
        }
        if (!VALID_TYPES.contains(request.getType())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid transaction type: " + request.getType());
        }
        if (!VALID_PAIR_CODES.contains(request.getTransaction_pair_code())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid transaction_pair_code: " + request.getTransaction_pair_code());
        }
        if (!VALID_PARTS_OF_DAY.contains(request.getPart_of_the_day())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid part_of_the_day: " + request.getPart_of_the_day());
        }
        if (request.getAmount() <= 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Amount must be positive: " + request.getAmount());
        }
        if (request.getDay() < 1 || request.getDay() > 31) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Day must be between 1 and 31: " + request.getDay());
        }

        try {
            // Process the fraud detection request using the service
            logger.info("Processing fraud detection request");
            FraudResponse response = fraudDetectionService.detectFraud(request);
            
            // Enhance the response with additional details for the frontend
            enhanceResponseForFrontend(response, request);
            
            // Log the response
            logger.info("Fraud detection result: isFraud={}, probability={}, status={}", 
                response.isFraud(), response.getProbability(), response.getStatus());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error during fraud detection", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error during fraud detection: " + e.getMessage());
        }
    }
    
    private void enhanceResponseForFrontend(FraudResponse response, FraudRequest request) {
        // Set transaction details
        response.setTransactionDetails(request);
        
        // Generate a transaction ID if not present
        if (response.getTransactionId() == null || response.getTransactionId().isEmpty()) {
            response.setTransactionId("TX" + Math.floor(Math.random() * 1000000));
        }
        
        // Set timestamp if not present
        if (response.getTimestamp() == null || response.getTimestamp().isEmpty()) {
            response.setTimestamp(java.time.LocalDateTime.now().toString());
        }
        
        // Ensure status is set based on fraud probability
        if (response.getStatus() == null || response.getStatus().isEmpty()) {
            if (response.isFraud()) {
                response.setStatus("fraud");
            } else if (response.getProbability() > 0.3) {
                response.setStatus("suspicious");
            } else {
                response.setStatus("normal");
            }
        }
        
        // Ensure risk score is set
        if (response.getRiskScore() == 0) {
            response.setRiskScore((int) Math.round(response.getProbability() * 100));
        }
    }
}