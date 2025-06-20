package com.backend.backend.util;

import com.backend.backend.dto.FraudRequest;
import com.backend.backend.dto.FraudResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;

import java.io.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Component
public class PythonInvoker {
    
    private static final Logger logger = LoggerFactory.getLogger(PythonInvoker.class);
    
    @Autowired
    private ResourceLoader resourceLoader;
    
    @Autowired
    private ObjectMapper objectMapper;

    public FraudResponse invokePythonScript(FraudRequest request) throws IOException, InterruptedException {
        String inputJson = objectMapper.writeValueAsString(request);
        
        // Log the input JSON
        logger.info("Python script input: {}", inputJson);

        // Get the resource directory path
        Resource resource = resourceLoader.getResource("classpath:predict.py");
        File resourceDir = resource.getFile().getParentFile();
        
        // Build the command (platform-agnostic)
        String pythonCommand = System.getProperty("os.name").toLowerCase().contains("win") ? "python" : "python3";
        ProcessBuilder pb = new ProcessBuilder(pythonCommand, resource.getFile().getAbsolutePath());
        pb.directory(resourceDir);
        pb.redirectErrorStream(false); // Keep stderr separate
        Process process = pb.start();

        // Write JSON to stdin
        try (BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(process.getOutputStream()))) {
            writer.write(inputJson);
            writer.flush();
        }

        // Read stdout
        StringBuilder output = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line);
            }
        }

        // Read stderr
        StringBuilder errorOutput = new StringBuilder();
        try (BufferedReader errorReader = new BufferedReader(new InputStreamReader(process.getErrorStream()))) {
            String line;
            while ((line = errorReader.readLine()) != null) {
                // Log each line from stderr
                if (line.contains("PYTHON_LOG:")) {
                    logger.info(">>> {}", line);
                } else {
                    logger.debug("Python stderr: {}", line);
                }
                errorOutput.append(line).append("\n");
            }
        }

        int exitCode = process.waitFor();
        if (exitCode != 0) {
            throw new RuntimeException("Python script exited with code: " + exitCode + ". Error: " + errorOutput);
        }

        // Parse output to FraudResponse
        if (output.length() == 0) {
            throw new RuntimeException("Python script returned no output");
        }
        
        try {
            // Log the Python script output
            logger.info("Python script output: {}", output.toString());
            
            FraudResponse fraudResponse = objectMapper.readValue(output.toString(), FraudResponse.class);
            
            // Add transaction details to the response for frontend
            fraudResponse.setTransactionDetails(request);
            
            // Add risk factors based on the transaction and prediction
            if (fraudResponse.getFactors() == null || fraudResponse.getFactors().isEmpty()) {
                fraudResponse.setFactors(generateRiskFactors(request, fraudResponse.getProbability()));
            }
            
            // Ensure transactionId is set
            if (fraudResponse.getTransactionId() == null || fraudResponse.getTransactionId().isEmpty()) {
                fraudResponse.setTransactionId("TX" + UUID.randomUUID().toString().substring(0, 8));
            }
            
            // Ensure timestamp is set
            if (fraudResponse.getTimestamp() == null || fraudResponse.getTimestamp().isEmpty()) {
                fraudResponse.setTimestamp(LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
            }
            
            return fraudResponse;
        } catch (Exception e) {
            logger.error("Error parsing Python output: {}", e.getMessage());
            logger.error("Raw output: {}", output.toString());
            throw e;
        }
    }
    
    private List<String> generateRiskFactors(FraudRequest request, double probability) {
        List<String> factors = new ArrayList<>();
        
        if (request.getAmount() > 1000) {
            factors.add("High transaction amount");
        }
        
        if ("night".equals(request.getPart_of_the_day())) {
            factors.add("Unusual transaction time");
        }
        
        if ("CASH_OUT".equals(request.getType())) {
            factors.add("Cash out transaction");
        }
        
        if (probability > 0.7) {
            factors.add("High fraud probability score");
        }
        
        if (probability > 0.5) {
            factors.add("Unusual transaction pattern");
        }
        
        if ("TRANSFER".equals(request.getType()) && request.getAmount() > 500) {
            factors.add("Large transfer amount");
        }
        
        if ("cm".equals(request.getTransaction_pair_code()) && "night".equals(request.getPart_of_the_day())) {
            factors.add("Unusual merchant transaction time");
        }
        
        return factors;
    }
}