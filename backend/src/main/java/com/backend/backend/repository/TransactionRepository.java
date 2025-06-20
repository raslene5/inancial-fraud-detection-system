package com.backend.backend.repository;

import com.backend.backend.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    Optional<Transaction> findByTransactionId(String transactionId);
    
    List<Transaction> findByStatus(Transaction.TransactionStatus status);
    
    List<Transaction> findByTimestampBetween(LocalDateTime start, LocalDateTime end);
    
    @Query("SELECT t FROM Transaction t WHERE t.riskScore >= :minRiskScore ORDER BY t.timestamp DESC")
    List<Transaction> findHighRiskTransactions(@Param("minRiskScore") Integer minRiskScore);
    
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.status = :status")
    Long countByStatus(@Param("status") Transaction.TransactionStatus status);
    
    @Query("SELECT t FROM Transaction t WHERE t.timestamp >= :since ORDER BY t.timestamp DESC")
    List<Transaction> findRecentTransactions(@Param("since") LocalDateTime since);
}