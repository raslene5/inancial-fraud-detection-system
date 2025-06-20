// Check API health
export const checkApiHealth = async () => {
  try {
    const response = await fetch("http://localhost:8089/api/health", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    
    if (!response.ok) {
      return { status: "DOWN", error: `HTTP error: ${response.status}` };
    }
    
    const result = await response.json();
    return { status: "UP", ...result };
  } catch (error) {
    console.error("API health check failed:", error);
    return { status: "DOWN", error: error.message };
  }
};

// API service for fraud detection
export const predictFraud = async (data) => {
  try {
    console.log("Sending fraud detection request:", data);
    
    // First check if backend is available
    const healthCheck = await checkApiHealth();
    if (healthCheck.status !== "UP") {
      throw new Error("Backend service is not available");
    }
    
    const response = await fetch("http://localhost:8089/api/fraud-detect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Server error (${response.status}):`, errorText);
      throw new Error(`Server error: ${response.status}`);
    }

    const result = await response.json();
    console.log("Prediction result:", result);
    
    // Ensure the result has the expected structure
    if (result) {
      // Convert isFraud to status if status is not present
      if (!result.status && result.isFraud !== undefined) {
        result.status = result.isFraud ? "fraud" : result.probability > 0.3 ? "suspicious" : "normal";
      }
      
      // Ensure riskScore is present
      if (!result.riskScore && result.probability !== undefined) {
        result.riskScore = Math.round(result.probability * 100);
      }
      
      // Ensure timestamp is present
      if (!result.timestamp) {
        result.timestamp = new Date().toISOString();
      }
    }
    
    return result;
  } catch (error) {
    console.error("Error predicting fraud:", error);
    // Create a fallback response for graceful degradation
    const fallbackResponse = {
      isFraud: false,
      probability: 0.1,
      status: "error",
      riskScore: 10,
      timestamp: new Date().toISOString(),
      transactionId: "TX_ERROR_" + Date.now(),
      factors: ["API connection error", "Using fallback response"],
      error: error.message
    };
    return fallbackResponse;
  }
};

// Save fraud transaction to local storage
export const saveFraudTransaction = (transaction) => {
  try {
    const fraudHistory = JSON.parse(localStorage.getItem("fraudHistory") || "[]");
    fraudHistory.unshift(transaction);
    localStorage.setItem("fraudHistory", JSON.stringify(fraudHistory.slice(0, 100))); // Keep last 100 entries
    
    // Dispatch event to notify components with transaction details
    const event = new CustomEvent("fraudDetected", { 
      detail: transaction 
    });
    window.dispatchEvent(event);
    
    return true;
  } catch (error) {
    console.error("Error saving to fraud history:", error);
    return false;
  }
};

// Save any transaction (including normal ones) and dispatch event
export const saveTransaction = (transaction) => {
  try {
    const allTransactions = JSON.parse(localStorage.getItem("allTransactions") || "[]");
    allTransactions.unshift(transaction);
    localStorage.setItem("allTransactions", JSON.stringify(allTransactions.slice(0, 200))); // Keep last 200 entries
    
    // Dispatch event for all transactions
    const event = new CustomEvent("transactionProcessed", { 
      detail: transaction 
    });
    window.dispatchEvent(event);
    
    return true;
  } catch (error) {
    console.error("Error saving transaction:", error);
    return false;
  }
};

// Get fraud history from local storage
export const getFraudHistory = () => {
  try {
    return JSON.parse(localStorage.getItem("fraudHistory") || "[]");
  } catch (error) {
    console.error("Error loading fraud history:", error);
    return [];
  }
};

// Get fraud statistics for charts
export const getFraudStatistics = () => {
  try {
    const fraudHistory = JSON.parse(localStorage.getItem("fraudHistory") || "[]");
    
    // If no data exists, create sample data for demonstration
    if (fraudHistory.length === 0) {
      return generateSampleData();
    }
    
    // Count by status - only include normal, suspicious, and fraud
    const statusCounts = {
      normal: 0,
      suspicious: 0,
      fraud: 0
    };
    
    // Count by type
    const typeCounts = {};
    
    // Count by day (for line chart)
    const dayData = {};
    
    fraudHistory.forEach(transaction => {
      // Count by status - only include valid statuses
      if (transaction.status && ['normal', 'suspicious', 'fraud'].includes(transaction.status)) {
        statusCounts[transaction.status] += 1;
      }
      
      // Count by type
      if (transaction.type) {
        typeCounts[transaction.type] = (typeCounts[transaction.type] || 0) + 1;
      }
      
      // Group by day for timeline
      const date = new Date(transaction.timestamp);
      const dayKey = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
      
      if (!dayData[dayKey]) {
        dayData[dayKey] = { fraud: 0, suspicious: 0, normal: 0 };
      }
      
      if (transaction.status && ['normal', 'suspicious', 'fraud'].includes(transaction.status)) {
        dayData[dayKey][transaction.status] += 1;
      }
    });
    
    // Format data for charts - ensure specific order for status chart
    const statusLabels = ["Normal", "Suspicious", "Fraud"];
    const statusValues = [statusCounts.normal, statusCounts.suspicious, statusCounts.fraud];
    
    const statusData = {
      labels: statusLabels,
      values: statusValues
    };
    
    const typeData = {
      labels: Object.keys(typeCounts),
      values: Object.values(typeCounts)
    };
    
    // Sort days for timeline chart
    const sortedDays = Object.keys(dayData).sort();
    const timelineData = {
      labels: sortedDays,
      values: sortedDays.map(day => dayData[day].fraud),
      secondaryValues: sortedDays.map(day => dayData[day].suspicious)
    };
    
    return {
      statusData,
      typeData,
      timelineData
    };
  } catch (error) {
    console.error("Error generating fraud statistics:", error);
    return generateSampleData();
  }
};

// Generate sample data for demonstration when no real data exists
const generateSampleData = () => {
  // Sample status data
  const statusData = {
    labels: ["Normal", "Suspicious", "Fraud"],
    values: [65, 23, 12]
  };
  
  // Sample type data
  const typeData = {
    labels: ["Credit Card", "Wire Transfer", "Mobile Payment", "Online Banking", "ATM"],
    values: [42, 18, 15, 12, 8]
  };
  
  // Generate sample timeline data for the last 7 days
  const today = new Date();
  const timelineLabels = [];
  const fraudValues = [];
  const suspiciousValues = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const dayKey = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
    timelineLabels.push(dayKey);
    
    // Generate some random but realistic-looking data
    fraudValues.push(Math.floor(Math.random() * 5) + 1); // 1-5 fraud transactions
    suspiciousValues.push(Math.floor(Math.random() * 8) + 3); // 3-10 suspicious transactions
  }
  
  const timelineData = {
    labels: timelineLabels,
    values: fraudValues,
    secondaryValues: suspiciousValues
  };
  
  return {
    statusData,
    typeData,
    timelineData
  };
};

// Generate PDF report for fraud transactions
export const generateFraudReport = async (transactions, chartData, fraudStats) => {
  try {
    // Import libraries dynamically to avoid issues with SSR
    const jsPDF = (await import('jspdf')).default;
    const autoTable = (await import('jspdf-autotable')).default;
    const html2canvas = (await import('html2canvas')).default;
    
    console.log("Generating PDF report for", transactions.length, "transactions");
    
    // Create a new PDF document
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Add title and date
    doc.setFontSize(20);
    doc.setTextColor(33, 33, 33);
    doc.text("Fraud Detection Report", pageWidth / 2, 20, { align: "center" });
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    const today = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    doc.text(`Generated on ${today}`, pageWidth / 2, 28, { align: "center" });
    
    // Add summary statistics
    doc.setFontSize(14);
    doc.setTextColor(33, 33, 33);
    doc.text("Summary Statistics", 14, 40);
    
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    
    const stats = [
      ["Total Transactions", fraudStats.totalTransactions.toLocaleString()],
      ["Fraud Detected", fraudStats.fraudCount.toLocaleString()],
      ["Suspicious Activity", fraudStats.suspiciousCount.toLocaleString()],
      ["Fraud Amount", `${fraudStats.fraudAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`]
    ];
    
    autoTable(doc, {
      startY: 45,
      head: [["Metric", "Value"]],
      body: stats,
      theme: 'striped',
      headStyles: { fillColor: [33, 150, 243], textColor: [255, 255, 255] },
      margin: { left: 14, right: 14 },
      styles: { fontSize: 10 }
    });
    
    // Capture charts from the DOM
    try {
      // Find chart elements
      const chartElements = document.querySelectorAll('canvas');
      if (chartElements.length > 0) {
        let yPosition = doc.lastAutoTable.finalY + 15;
        
        doc.setFontSize(14);
        doc.setTextColor(33, 33, 33);
        doc.text("Fraud Analysis Charts", 14, yPosition);
        yPosition += 10;
        
        // Capture and add each chart
        for (let i = 0; i < Math.min(chartElements.length, 2); i++) {
          const canvas = chartElements[i];
          const imgData = canvas.toDataURL('image/png');
          
          // Add chart to PDF
          const imgWidth = 180;
          const imgHeight = 100;
          
          // Check if we need a new page
          if (yPosition + imgHeight > pageHeight - 20) {
            doc.addPage();
            yPosition = 20;
          }
          
          doc.addImage(imgData, 'PNG', (pageWidth - imgWidth) / 2, yPosition, imgWidth, imgHeight);
          yPosition += imgHeight + 15;
        }
      }
    } catch (chartError) {
      console.error("Error capturing charts:", chartError);
      // Continue with the report even if chart capture fails
    }
    
    // Add transaction table
    if (transactions.length > 0) {
      // Add a new page if needed
      if (doc.lastAutoTable && doc.lastAutoTable.finalY > pageHeight - 100) {
        doc.addPage();
      }
      
      const yPos = doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : 120;
      
      doc.setFontSize(14);
      doc.setTextColor(33, 33, 33);
      doc.text("Recent Transactions", 14, yPos);
      
      // Format transactions for the table
      const tableData = transactions.slice(0, 10).map(t => [
        t.transactionId || "N/A",
        t.amount ? `${parseFloat(t.amount).toFixed(2)}` : "N/A",
        t.status ? t.status.charAt(0).toUpperCase() + t.status.slice(1) : "N/A",
        t.riskScore ? `${t.riskScore}%` : "N/A",
        new Date(t.timestamp).toLocaleString()
      ]);
      
      autoTable(doc, {
        startY: yPos + 5,
        head: [["Transaction ID", "Amount", "Status", "Risk Score", "Timestamp"]],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [33, 150, 243], textColor: [255, 255, 255] },
        margin: { left: 14, right: 14 },
        styles: { fontSize: 8, cellPadding: 2 },
        columnStyles: {
          0: { cellWidth: 40 },
          4: { cellWidth: 40 }
        }
      });
    }
    
    // Add footer
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`Financial Fraud Detection System - Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: "center" });
    }
    
    // Save the PDF
    const pdfBlob = doc.output('blob');
    return URL.createObjectURL(pdfBlob);
  } catch (error) {
    console.error("Error generating fraud report:", error);
    return null;
  }
};
