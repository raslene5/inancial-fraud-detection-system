/**
 * Mock data for fraud detection and analysis
 */

// Mock fraud data for the team page
export const mockFraudData = [
  {
    id: "TX-78945",
    timestamp: "2023-11-15T14:23:45",
    amount: 1250.00,
    merchantName: "Online Electronics Store",
    cardholderName: "John Smith",
    cardNumber: "**** **** **** 4532",
    fraudType: "Card Not Present",
    fraudScore: 0.92,
    status: "Confirmed",
    location: "New York, USA",
    ipAddress: "192.168.1.45",
    deviceId: "MAC-78945612",
    notes: "Customer reported transaction as unauthorized. Card has been blocked and replacement issued.",
    reviewedBy: "Agent #45231"
  },
  {
    id: "TX-65432",
    timestamp: "2023-11-14T09:17:22",
    amount: 3780.50,
    merchantName: "International Transfer Service",
    cardholderName: "Emily Johnson",
    cardNumber: "**** **** **** 7856",
    fraudType: "Account Takeover",
    fraudScore: 0.88,
    status: "Under Review",
    location: "London, UK",
    ipAddress: "45.67.89.123",
    deviceId: "WIN-98765432",
    notes: "Multiple login attempts from different locations within short timeframe. Account temporarily restricted.",
    reviewedBy: "Agent #78965"
  },
  {
    id: "TX-12378",
    timestamp: "2023-11-13T16:45:11",
    amount: 950.25,
    merchantName: "Mobile Payment App",
    cardholderName: "Michael Brown",
    cardNumber: "**** **** **** 1234",
    fraudType: "Identity Theft",
    fraudScore: 0.76,
    status: "Under Review",
    location: "Chicago, USA",
    ipAddress: "78.90.123.45",
    deviceId: "AND-45678912",
    notes: "Unusual transaction pattern detected. Customer contacted for verification.",
    reviewedBy: "Agent #12345"
  },
  {
    id: "TX-98765",
    timestamp: "2023-11-12T11:32:09",
    amount: 2450.75,
    merchantName: "Online Marketplace",
    cardholderName: "Sarah Wilson",
    cardNumber: "**** **** **** 9876",
    fraudType: "Phishing",
    fraudScore: 0.68,
    status: "Under Review",
    location: "Toronto, Canada",
    ipAddress: "123.45.67.89",
    deviceId: "IOS-12345678",
    notes: "Customer may have been victim of phishing attack. Security questions updated.",
    reviewedBy: "Agent #56789"
  },
  {
    id: "TX-45678",
    timestamp: "2023-11-11T08:14:32",
    amount: 5250.00,
    merchantName: "Luxury Goods Store",
    cardholderName: "David Miller",
    cardNumber: "**** **** **** 5678",
    fraudType: "Card Not Present",
    fraudScore: 0.95,
    status: "Confirmed",
    location: "Sydney, Australia",
    ipAddress: "234.56.78.90",
    deviceId: "MAC-12345678",
    notes: "High-value transaction from unusual location. Customer confirmed they did not make this purchase.",
    reviewedBy: "Agent #34567"
  }
];

export const mockFraudStatistics = {
  totalTransactions: 1245,
  fraudCount: 342,
  suspiciousCount: 187,
  normalCount: 716,
  amountSaved: 531872.45,
  labels: ["Normal", "Suspicious", "Fraud"],
  values: [716, 187, 342]
};

export const mockFraudPatterns = [
  {
    id: "time_based",
    label: "Time-based Patterns",
    value: 239,
    color: "#4caf50",
  },
  {
    id: "location_based",
    label: "Location Anomalies",
    value: 170,
    color: "#2196f3",
  },
  {
    id: "amount_based",
    label: "Amount Thresholds",
    value: 322,
    color: "#9c27b0",
  },
  {
    id: "behavior_based",
    label: "Behavioral Changes",
    value: 503,
    color: "#3f51b5",
  },
  {
    id: "device_based",
    label: "Device Anomalies",
    value: 184,
    color: "#f44336",
  },
];

export const mockFraudTrends = [
  {
    id: "card_fraud",
    color: "#3f51b5",
    data: [
      { x: "Jan", y: 101 },
      { x: "Feb", y: 75 },
      { x: "Mar", y: 36 },
      { x: "Apr", y: 216 },
      { x: "May", y: 35 },
      { x: "Jun", y: 236 },
      { x: "Jul", y: 88 },
      { x: "Aug", y: 232 },
      { x: "Sep", y: 281 },
      { x: "Oct", y: 91 },
      { x: "Nov", y: 135 },
      { x: "Dec", y: 114 },
    ],
  },
  {
    id: "identity_theft",
    color: "#2196f3",
    data: [
      { x: "Jan", y: 212 },
      { x: "Feb", y: 190 },
      { x: "Mar", y: 270 },
      { x: "Apr", y: 9 },
      { x: "May", y: 75 },
      { x: "Jun", y: 175 },
      { x: "Jul", y: 33 },
      { x: "Aug", y: 189 },
      { x: "Sep", y: 97 },
      { x: "Oct", y: 87 },
      { x: "Nov", y: 299 },
      { x: "Dec", y: 251 },
    ],
  },
  {
    id: "account_takeover",
    color: "#9c27b0",
    data: [
      { x: "Jan", y: 191 },
      { x: "Feb", y: 136 },
      { x: "Mar", y: 91 },
      { x: "Apr", y: 222 },
      { x: "May", y: 272 },
      { x: "Jun", y: 143 },
      { x: "Jul", y: 97 },
      { x: "Aug", y: 118 },
      { x: "Sep", y: 165 },
      { x: "Oct", y: 60 },
      { x: "Nov", y: 91 },
      { x: "Dec", y: 126 },
    ],
  },
];

// Helper functions for the team page
export const getFraudTypeStats = () => [
  {
    id: "Card Not Present",
    label: "Card Not Present",
    value: 45,
    color: "#4caf50"
  },
  {
    id: "Account Takeover",
    label: "Account Takeover",
    value: 27,
    color: "#2196f3"
  },
  {
    id: "Identity Theft",
    label: "Identity Theft",
    value: 18,
    color: "#9c27b0"
  },
  {
    id: "Phishing",
    label: "Phishing",
    value: 10,
    color: "#3f51b5"
  }
];

export const getFraudStatusStats = () => [
  {
    id: "Confirmed",
    label: "Confirmed",
    value: 38,
    color: "#f44336"
  },
  {
    id: "Under Review",
    label: "Under Review",
    value: 62,
    color: "#ff9800"
  }
];

export const getFraudTimelineData = () => [
  {
    id: "Fraud Amount",
    color: "#3f51b5",
    data: [
      { x: "Jan", y: 10150 },
      { x: "Feb", y: 7500 },
      { x: "Mar", y: 3600 },
      { x: "Apr", y: 21600 },
      { x: "May", y: 3500 },
      { x: "Jun", y: 23600 },
      { x: "Jul", y: 8800 },
      { x: "Aug", y: 23200 },
      { x: "Sep", y: 28100 },
      { x: "Oct", y: 9100 },
      { x: "Nov", y: 13500 },
      { x: "Dec", y: 11400 }
    ]
  }
];

export const getFraudByLocation = () => [
  {
    country: "USA",
    "fraud count": 157,
    "fraud countColor": "#3f51b5"
  },
  {
    country: "UK",
    "fraud count": 98,
    "fraud countColor": "#2196f3"
  },
  {
    country: "Canada",
    "fraud count": 72,
    "fraud countColor": "#9c27b0"
  },
  {
    country: "Australia",
    "fraud count": 53,
    "fraud countColor": "#f44336"
  },
  {
    country: "Germany",
    "fraud count": 40,
    "fraud countColor": "#4caf50"
  }
];

export const getFraudScoreDistribution = () => [
  {
    id: "90-100%",
    label: "90-100%",
    value: 32,
    color: "#f44336"
  },
  {
    id: "80-89%",
    label: "80-89%",
    value: 25,
    color: "#ff5722"
  },
  {
    id: "70-79%",
    label: "70-79%",
    value: 18,
    color: "#ff9800"
  },
  {
    id: "60-69%",
    label: "60-69%",
    value: 15,
    color: "#ffc107"
  },
  {
    id: "Below 60%",
    label: "Below 60%",
    value: 10,
    color: "#8bc34a"
  }
];

// Initialize localStorage with mock fraud history if it doesn't exist
if (typeof window !== 'undefined' && !localStorage.getItem("fraudHistory")) {
  localStorage.setItem("fraudHistory", JSON.stringify(mockFraudData));
}