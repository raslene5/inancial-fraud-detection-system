 package com.backend.backend.dto;
import lombok.Data;

@Data
public class FraudRequest {
    private double amount;
    private int day;
    private String type;
    private String transaction_pair_code;
    private String part_of_the_day;
    
    @Override
    public String toString() {
        return "FraudRequest{" +
                "amount=" + amount +
                ", day=" + day +
                ", type='" + type + '\'' +
                ", transaction_pair_code='" + transaction_pair_code + '\'' +
                ", part_of_the_day='" + part_of_the_day + '\'' +
                '}';
    }
}