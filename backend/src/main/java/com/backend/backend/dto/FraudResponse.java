package com.backend.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public class FraudResponse {
    @JsonProperty("isFraud")
    private boolean fraud;

    private double probability;
    
    // Additional fields to match frontend expectations
    private String transactionId;
    private String timestamp;
    private double amount;
    private String type;
    private String status;
    private int riskScore;
    private List<String> factors;
    private int day;
    private String transaction_pair_code;
    private String part_of_the_day;
    
    // New fields for ensemble prediction
    private String predictionMethod;
    private Map<String, Double> modelPredictions;

    public FraudResponse() {
        this.transactionId = "TX" + UUID.randomUUID().toString().substring(0, 8);
        this.timestamp = LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME);
        this.factors = new ArrayList<>();
        this.modelPredictions = new HashMap<>();
    }

    public FraudResponse(boolean fraud, double probability) {
        this();
        this.fraud = fraud;
        this.probability = probability;
        this.riskScore = (int) Math.round(probability * 100);
        this.status = determineStatus();
    }
    
    public void setTransactionDetails(FraudRequest request) {
        this.amount = request.getAmount();
        this.type = request.getType();
        this.day = request.getDay();
        this.transaction_pair_code = request.getTransaction_pair_code();
        this.part_of_the_day = request.getPart_of_the_day();
        this.riskScore = (int) Math.round(probability * 100);
        this.status = determineStatus();
        
        // Generate risk factors based on input and model prediction
        generateRiskFactors();
    }
    
    private String determineStatus() {
        if (fraud) {
            return "fraud";
        } else if (probability > 0.3) {
            return "suspicious";
        } else {
            return "normal";
        }
    }
    
    private void generateRiskFactors() {
        factors.clear();
        
        if (amount > 1000) {
            factors.add("High transaction amount");
        }
        
        if ("night".equals(part_of_the_day)) {
            factors.add("Unusual transaction time");
        }
        
        if ("CASH_OUT".equals(type)) {
            factors.add("Cash out transaction");
        }
        
        if (probability > 0.7) {
            factors.add("High fraud probability score");
        }
        
        if (probability > 0.5) {
            factors.add("Unusual transaction pattern");
        }
        
        if ("TRANSFER".equals(type) && amount > 500) {
            factors.add("Large transfer amount");
        }
        
        if ("cm".equals(transaction_pair_code) && "night".equals(part_of_the_day)) {
            factors.add("Unusual merchant transaction time");
        }
        
        // Add ensemble-specific factors
        if ("ensemble_cnn".equals(predictionMethod)) {
            factors.add("Advanced ensemble prediction used");
        } else if ("ensemble_weighted".equals(predictionMethod)) {
            factors.add("Multi-model ensemble prediction");
        }
    }

    public boolean isFraud() {
        return fraud;
    }

    public void setFraud(boolean fraud) {
        this.fraud = fraud;
        this.status = determineStatus();
    }

    public double getProbability() {
        return probability;
    }

    public void setProbability(double probability) {
        this.probability = probability;
        this.riskScore = (int) Math.round(probability * 100);
        this.status = determineStatus();
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public int getRiskScore() {
        return riskScore;
    }

    public void setRiskScore(int riskScore) {
        this.riskScore = riskScore;
    }

    public List<String> getFactors() {
        return factors;
    }

    public void setFactors(List<String> factors) {
        this.factors = factors;
    }

    public int getDay() {
        return day;
    }

    public void setDay(int day) {
        this.day = day;
    }

    public String getTransaction_pair_code() {
        return transaction_pair_code;
    }

    public void setTransaction_pair_code(String transaction_pair_code) {
        this.transaction_pair_code = transaction_pair_code;
    }

    public String getPart_of_the_day() {
        return part_of_the_day;
    }

    public void setPart_of_the_day(String part_of_the_day) {
        this.part_of_the_day = part_of_the_day;
    }

    public String getPredictionMethod() {
        return predictionMethod;
    }

    public void setPredictionMethod(String predictionMethod) {
        this.predictionMethod = predictionMethod;
    }

    public Map<String, Double> getModelPredictions() {
        return modelPredictions;
    }

    public void setModelPredictions(Map<String, Double> modelPredictions) {
        this.modelPredictions = modelPredictions;
    }
}