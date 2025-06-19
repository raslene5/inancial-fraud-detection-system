// Mock data for fraud investigation events
export const mockCalendarEvents = [
  // Investigation Events
  {
    id: "inv-001",
    title: "Initial Case Review: Credit Card Fraud",
    start: new Date(new Date().setDate(new Date().getDate() - 5)),
    end: new Date(new Date().setDate(new Date().getDate() - 5)),
    description: "Review initial evidence and transaction logs for suspected credit card fraud case #FR-2023-0472",
    type: "investigation",
    priority: "high",
    caseId: "FR-2023-0472",
    assignedTo: ["Sarah Chen"],
    status: "in-progress",
    color: "#d32f2f" // red
  },
  {
    id: "inv-002",
    title: "Witness Interview: Merchant",
    start: new Date(new Date().setDate(new Date().getDate() - 2)),
    description: "Interview with merchant who processed suspicious transactions",
    type: "interview",
    priority: "medium",
    caseId: "FR-2023-0472",
    location: "Virtual Meeting",
    assignedTo: ["Robert Johnson", "David Chen"],
    status: "scheduled",
    color: "#7b1fa2" // purple
  },
  {
    id: "inv-003",
    title: "Digital Forensics Analysis",
    start: new Date(new Date().setDate(new Date().getDate() + 1)),
    end: new Date(new Date().setDate(new Date().getDate() + 3)),
    description: "Analyze device logs and digital evidence from seized equipment",
    type: "forensics",
    priority: "high",
    caseId: "FR-2023-0472",
    assignedTo: ["Michelle Wong"],
    status: "pending",
    progress: 0,
    color: "#0288d1" // blue
  },
  {
    id: "inv-004",
    title: "Case Coordination Meeting",
    start: new Date(new Date().setDate(new Date().getDate() + 2)),
    description: "Coordination meeting with law enforcement and financial institution representatives",
    type: "meeting",
    priority: "high",
    caseId: "FR-2023-0472",
    location: "Conference Room A",
    attendees: ["Investigation Team", "FBI Agent Johnson", "Bank Security Officer"],
    status: "scheduled",
    color: "#388e3c" // green
  },
  {
    id: "inv-005",
    title: "Transaction Pattern Analysis",
    start: new Date(new Date().setDate(new Date().getDate() - 3)),
    end: new Date(new Date().setDate(new Date().getDate() + 1)),
    description: "Analyze transaction patterns to identify additional compromised accounts",
    type: "analysis",
    priority: "medium",
    caseId: "FR-2023-0472",
    assignedTo: ["James Wilson"],
    status: "in-progress",
    progress: 65,
    color: "#f57c00" // orange
  },
  {
    id: "inv-006",
    title: "Evidence Submission Deadline",
    start: new Date(new Date().setDate(new Date().getDate() + 7)),
    description: "Final deadline for evidence submission to prosecutor",
    type: "deadline",
    priority: "high",
    caseId: "FR-2023-0472",
    status: "pending",
    color: "#c62828" // dark red
  },
  {
    id: "inv-007",
    title: "Surveillance Operation",
    start: new Date(new Date().setDate(new Date().getDate() + 4)),
    end: new Date(new Date().setDate(new Date().getDate() + 5)),
    description: "Physical surveillance of suspect at identified locations",
    type: "fieldwork",
    priority: "high",
    caseId: "FR-2023-0472",
    location: "Multiple Locations",
    assignedTo: ["Field Team Alpha"],
    status: "planned",
    color: "#ff6f00" // amber
  },
  {
    id: "inv-008",
    title: "Case Report Preparation",
    start: new Date(new Date().setDate(new Date().getDate() + 6)),
    end: new Date(new Date().setDate(new Date().getDate() + 8)),
    description: "Prepare comprehensive case report for legal proceedings",
    type: "documentation",
    priority: "medium",
    caseId: "FR-2023-0472",
    assignedTo: ["Sarah Chen", "Robert Johnson"],
    status: "not-started",
    progress: 0,
    color: "#455a64" // blue grey
  },
  {
    id: "inv-009",
    title: "Financial Trail Analysis",
    start: new Date(new Date().setDate(new Date().getDate() - 1)),
    end: new Date(new Date().setDate(new Date().getDate() + 2)),
    description: "Follow money trail through multiple accounts and financial institutions",
    type: "analysis",
    priority: "high",
    caseId: "FR-2023-0472",
    assignedTo: ["Financial Analysis Team"],
    status: "in-progress",
    progress: 30,
    color: "#00695c" // teal
  },
  {
    id: "inv-010",
    title: "Suspect Background Check",
    start: new Date(new Date().setDate(new Date().getDate() - 4)),
    end: new Date(new Date().setDate(new Date().getDate() - 3)),
    description: "Comprehensive background check on primary suspect",
    type: "investigation",
    priority: "medium",
    caseId: "FR-2023-0472",
    assignedTo: ["David Chen"],
    status: "completed",
    progress: 100,
    color: "#4527a0" // deep purple
  }
];

// Event categories for filtering
export const eventCategories = [
  { id: "investigation", name: "Case Investigation", color: "#d32f2f" },
  { id: "interview", name: "Interviews", color: "#7b1fa2" },
  { id: "forensics", name: "Digital Forensics", color: "#0288d1" },
  { id: "meeting", name: "Meetings", color: "#388e3c" },
  { id: "analysis", name: "Analysis", color: "#f57c00" },
  { id: "deadline", name: "Deadlines", color: "#c62828" },
  { id: "fieldwork", name: "Field Operations", color: "#ff6f00" },
  { id: "documentation", name: "Documentation", color: "#455a64" }
];

// Status indicators
export const statusColors = {
  "completed": "#4caf50",
  "in-progress": "#2196f3",
  "scheduled": "#9c27b0",
  "pending": "#ff9800",
  "not-started": "#757575",
  "planned": "#607d8b"
};

// Generate events from fraud data
export const generateFraudEvents = (fraudData) => {
  return fraudData.map(transaction => {
    const date = new Date(transaction.timestamp);
    const endDate = new Date(date);
    endDate.setHours(date.getHours() + 2); // 2-hour investigation window
    
    return {
      id: `fraud-${transaction.id}`,
      title: `Fraud Investigation: ${transaction.fraudType}`,
      start: date,
      end: endDate,
      description: `Investigate suspicious activity: ${transaction.notes}. Transaction amount: $${transaction.amount}`,
      type: "investigation",
      priority: transaction.fraudScore > 0.9 ? "high" : "medium",
      fraudScore: transaction.fraudScore,
      caseId: transaction.id,
      location: transaction.location,
      status: "pending",
      color: transaction.fraudScore > 0.9 ? "#d32f2f" : "#f57c00"
    };
  });
};