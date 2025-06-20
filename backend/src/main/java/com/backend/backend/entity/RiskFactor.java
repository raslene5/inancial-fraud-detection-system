package com.backend.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "risk_factors")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RiskFactor {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "transaction_id", nullable = false, length = 50)
    private String transactionId;
    
    @Column(nullable = false, length = 100)
    private String factor;
}