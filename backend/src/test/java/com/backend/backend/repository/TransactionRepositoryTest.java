package com.backend.backend.repository;

import com.backend.backend.entity.Transaction;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class TransactionRepositoryTest {

    @Autowired
    private TransactionRepository transactionRepository;

    @Test
    void testSaveTransaction() {
        Transaction transaction = new Transaction();
        transaction.setTransactionId("TEST_001");
        transaction.setAmount(new BigDecimal("1500.00"));
        transaction.setType("PAYMENT");
        transaction.setStatus(Transaction.TransactionStatus.normal);
        transaction.setRiskScore(25);
        transaction.setTimestamp(LocalDateTime.now());
        transaction.setDay(15);
        transaction.setTransactionPairCode("cc");
        transaction.setPartOfTheDay("morning");

        Transaction saved = transactionRepository.save(transaction);

        assertNotNull(saved.getId());
        assertEquals("TEST_001", saved.getTransactionId());
        assertEquals(new BigDecimal("1500.00"), saved.getAmount());
    }

    @Test
    void testFindByTransactionId() {
        Transaction transaction = new Transaction();
        transaction.setTransactionId("TEST_002");
        transaction.setAmount(new BigDecimal("2000.00"));
        transaction.setType("TRANSFER");
        transaction.setStatus(Transaction.TransactionStatus.suspicious);
        transaction.setRiskScore(65);
        transaction.setTimestamp(LocalDateTime.now());
        transaction.setDay(20);
        transaction.setTransactionPairCode("cm");
        transaction.setPartOfTheDay("evening");

        transactionRepository.save(transaction);

        assertTrue(transactionRepository.findByTransactionId("TEST_002").isPresent());
    }
}