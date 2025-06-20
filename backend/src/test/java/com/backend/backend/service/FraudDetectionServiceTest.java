package com.backend.backend.service;

import com.backend.backend.dto.FraudRequest;
import com.backend.backend.dto.FraudResponse;
import com.backend.backend.entity.Transaction;
import com.backend.backend.repository.TransactionRepository;
import com.backend.backend.repository.NotificationRepository;
import com.backend.backend.util.PythonInvoker;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class FraudDetectionServiceTest {

    @Mock
    private PythonInvoker pythonInvoker;

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private NotificationRepository notificationRepository;

    @InjectMocks
    private FraudDetectionService fraudDetectionService;

    @Test
    void testDetectFraud() throws Exception {
        FraudRequest request = new FraudRequest();
        request.setAmount(5000.0);
        request.setType("CASH_OUT");

        FraudResponse mockResponse = new FraudResponse();
        mockResponse.setFraud(true);
        mockResponse.setProbability(0.85);
        mockResponse.setRiskScore(85);

        when(pythonInvoker.invokePythonScript(any())).thenReturn(mockResponse);
        when(transactionRepository.save(any(Transaction.class))).thenReturn(new Transaction());

        FraudResponse result = fraudDetectionService.detectFraud(request);

        assertNotNull(result);
        assertTrue(result.isFraud());
        assertEquals(85, result.getRiskScore());
    }
}