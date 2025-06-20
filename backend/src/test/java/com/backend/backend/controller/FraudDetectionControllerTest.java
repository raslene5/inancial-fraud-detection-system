package com.backend.backend.controller;

import com.backend.backend.dto.FraudRequest;
import com.backend.backend.service.FraudDetectionService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(FraudDetectionController.class)
class FraudDetectionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private FraudDetectionService fraudDetectionService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testValidFraudRequest() throws Exception {
        FraudRequest request = new FraudRequest();
        request.setAmount(1500.0);
        request.setDay(15);
        request.setType("PAYMENT");
        request.setTransaction_pair_code("cc");
        request.setPart_of_the_day("morning");

        mockMvc.perform(post("/api/fraud-detect")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    void testInvalidAmount() throws Exception {
        FraudRequest request = new FraudRequest();
        request.setAmount(-100.0);
        request.setDay(15);
        request.setType("PAYMENT");
        request.setTransaction_pair_code("cc");
        request.setPart_of_the_day("morning");

        mockMvc.perform(post("/api/fraud-detect")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}