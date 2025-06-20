package com.backend.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "daily_statistics")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DailyStatistics {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private LocalDate date;
    
    @Column(name = "normal_count")
    private Integer normalCount = 0;
    
    @Column(name = "suspicious_count")
    private Integer suspiciousCount = 0;
    
    @Column(name = "fraud_count")
    private Integer fraudCount = 0;
    
    @Column(name = "total_amount", precision = 15, scale = 2)
    private BigDecimal totalAmount = BigDecimal.ZERO;
    
    @Column(name = "fraud_amount", precision = 15, scale = 2)
    private BigDecimal fraudAmount = BigDecimal.ZERO;
}