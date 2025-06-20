package com.backend.backend.repository;

import com.backend.backend.entity.RiskFactor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RiskFactorRepository extends JpaRepository<RiskFactor, Long> {
    
    List<RiskFactor> findByTransactionId(String transactionId);
}