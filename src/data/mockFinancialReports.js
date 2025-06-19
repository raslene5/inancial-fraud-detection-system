export const mockFinancialReports = [
  {
    id: 1,
    title: "Monthly Fraud Detection Summary",
    description: "Overview of fraud detection activities and financial impact for the current month",
    type: "Monthly",
    date: "2023-11-01",
    status: "Ready",
    metrics: {
      fraudDetected: 127,
      amountSaved: "€43,250.75",
      falsePositives: 23,
      accuracy: "94.2%"
    }
  },
  {
    id: 2,
    title: "Quarterly Financial Impact Analysis",
    description: "Detailed analysis of financial impact from fraud prevention for Q3 2023",
    type: "Quarterly",
    date: "2023-10-01",
    status: "Ready",
    metrics: {
      fraudDetected: 342,
      amountSaved: "€128,450.32",
      falsePositives: 58,
      accuracy: "92.8%"
    }
  },
  {
    id: 3,
    title: "Annual Fraud Trends Report",
    description: "Comprehensive analysis of fraud patterns and financial impact for the fiscal year",
    type: "Annual",
    date: "2023-01-01",
    status: "Ready",
    metrics: {
      fraudDetected: 1245,
      amountSaved: "€531,872.45",
      falsePositives: 187,
      accuracy: "93.5%"
    }
  },
  {
    id: 4,
    title: "Geographic Risk Assessment",
    description: "Analysis of fraud patterns by geographic location and associated financial risks",
    type: "Special",
    date: "2023-09-15",
    status: "Ready",
    metrics: {
      fraudDetected: 89,
      amountSaved: "€37,620.18",
      falsePositives: 12,
      accuracy: "95.1%"
    }
  },
  {
    id: 5,
    title: "Transaction Type Risk Analysis",
    description: "Detailed breakdown of fraud by transaction type and financial impact",
    type: "Special",
    date: "2023-08-22",
    status: "Ready",
    metrics: {
      fraudDetected: 156,
      amountSaved: "€62,845.90",
      falsePositives: 31,
      accuracy: "91.7%"
    }
  }
];

export const reportTemplates = [
  {
    id: 1,
    name: "Monthly Summary",
    description: "Standard monthly report of fraud detection activities",
    sections: ["Executive Summary", "Key Metrics", "Fraud Patterns", "Financial Impact", "Recommendations"]
  },
  {
    id: 2,
    name: "Quarterly Analysis",
    description: "Detailed quarterly analysis with trend comparisons",
    sections: ["Executive Summary", "Quarterly Trends", "Financial Impact", "Risk Assessment", "Strategic Recommendations"]
  },
  {
    id: 3,
    name: "Annual Report",
    description: "Comprehensive annual report with year-over-year comparisons",
    sections: ["Executive Summary", "Annual Overview", "Trend Analysis", "Financial Impact", "Risk Assessment", "Strategic Planning"]
  },
  {
    id: 4,
    name: "Custom Report",
    description: "Customizable report template with selectable sections",
    sections: ["Custom Sections"]
  }
];