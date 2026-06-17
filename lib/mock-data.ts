export const mockUniversityData = {
  name: "Shoolini University",
  location: "Solan, Himachal Pradesh",
  type: "Private",
  established: 2009,
  currentRank: 47,
  previousRank: 61,
  nirfScore: 68.4,
  targetScore: 75.0,
  targetRank: 30,
  accreditationStatus: "NAAC A+",
  lastUpdated: "2024-12-15",
};

export const historicalScores = [
  { year: "2019", tlr: 18.2, rpc: 14.5, go: 12.8, oi: 6.1, pr: 5.2, total: 56.8, rank: 112 },
  { year: "2020", tlr: 19.8, rpc: 16.2, go: 13.5, oi: 6.4, pr: 5.8, total: 61.7, rank: 89 },
  { year: "2021", tlr: 21.3, rpc: 18.1, go: 14.2, oi: 6.7, pr: 6.3, total: 66.6, rank: 72 },
  { year: "2022", tlr: 22.5, rpc: 19.4, go: 15.1, oi: 7.0, pr: 6.8, total: 70.8, rank: 61 },
  { year: "2023", tlr: 21.8, rpc: 20.2, go: 15.8, oi: 7.2, pr: 7.1, total: 72.1, rank: 52 },
  { year: "2024", tlr: 22.1, rpc: 21.5, go: 16.2, oi: 7.3, pr: 7.4, total: 74.5, rank: 47 },
];

export const currentScores = {
  tlr: 22.1, rpc: 21.5, go: 16.2, oi: 7.3, pr: 7.4, total: 74.5,
};

export const parameterTargets = {
  tlr: { current: 22.1, target: 27.0, benchmark: 28.5, weight: 30 },
  rpc: { current: 21.5, target: 26.0, benchmark: 28.8, weight: 30 },
  go:  { current: 16.2, target: 18.5, benchmark: 19.2, weight: 20 },
  oi:  { current: 7.3,  target: 8.5,  benchmark: 8.1,  weight: 10 },
  pr:  { current: 7.4,  target: 8.8,  benchmark: 9.9,  weight: 10 },
};

export const departmentData = [
  { name: "Engineering",      tlr: 23.1, rpc: 24.2, go: 17.8, oi: 7.5, pr: 7.8, total: 80.4, faculty: 89, students: 1240 },
  { name: "Sciences",         tlr: 24.5, rpc: 26.1, go: 15.2, oi: 8.1, pr: 7.2, total: 81.1, faculty: 65, students: 780  },
  { name: "Management",       tlr: 21.2, rpc: 16.8, go: 18.9, oi: 7.2, pr: 8.4, total: 72.5, faculty: 42, students: 520  },
  { name: "Pharmacy",         tlr: 22.8, rpc: 22.4, go: 16.1, oi: 7.8, pr: 6.9, total: 76.0, faculty: 38, students: 410  },
  { name: "Law",              tlr: 18.4, rpc: 13.2, go: 15.8, oi: 6.9, pr: 7.1, total: 61.4, faculty: 28, students: 290  },
  { name: "Biotechnology",    tlr: 23.4, rpc: 24.8, go: 14.5, oi: 8.4, pr: 6.8, total: 77.9, faculty: 35, students: 320  },
];

export const kpiData = {
  totalFaculty: 297,
  totalStudents: 3560,
  publications: 1248,
  citations: 8942,
  hIndex: 42,
  patents: 34,
  consultancyRevenue: 4200000,
  placementRate: 88.4,
  medianSalary: 680000,
  phdFaculty: 198,
  internationalStudents: 42,
  womenStudents: 1420,
};

export const monthlyPublications = [
  { month: "Jan", publications: 82, citations: 620 },
  { month: "Feb", publications: 95, citations: 710 },
  { month: "Mar", publications: 108, citations: 820 },
  { month: "Apr", publications: 91, citations: 690 },
  { month: "May", publications: 118, citations: 890 },
  { month: "Jun", publications: 102, citations: 780 },
  { month: "Jul", publications: 88, citations: 660 },
  { month: "Aug", publications: 124, citations: 950 },
  { month: "Sep", publications: 115, citations: 870 },
  { month: "Oct", publications: 131, citations: 1020 },
  { month: "Nov", publications: 142, citations: 1100 },
  { month: "Dec", publications: 152, citations: 1180 },
];

export const gapAnalysisData = [
  { parameter: "TLR", current: 22.1, target: 27.0, benchmark: 28.5, gap: 4.9, severity: "Moderate" },
  { parameter: "RPC", current: 21.5, target: 26.0, benchmark: 28.8, gap: 7.3, severity: "Critical" },
  { parameter: "GO",  current: 16.2, target: 18.5, benchmark: 19.2, gap: 3.0, severity: "Minor"    },
  { parameter: "OI",  current: 7.3,  target: 8.5,  benchmark: 8.1,  gap: 0.8, severity: "Minor"    },
  { parameter: "PR",  current: 7.4,  target: 8.8,  benchmark: 9.9,  gap: 2.5, severity: "Moderate" },
];

export const radarData = [
  { subject: "TLR", current: 73.7, benchmark: 95.0 },
  { subject: "RPC", current: 71.7, benchmark: 96.0 },
  { subject: "GO",  current: 81.0, benchmark: 96.0 },
  { subject: "OI",  current: 73.0, benchmark: 81.0 },
  { subject: "PR",  current: 74.0, benchmark: 99.0 },
];

export const predictionData = [
  { year: "2025", predicted: 78.2, rank: 38, confidence: 88 },
  { year: "2026", predicted: 81.5, rank: 29, confidence: 74 },
  { year: "2027", predicted: 84.1, rank: 22, confidence: 61 },
  { year: "2028", predicted: 86.3, rank: 17, confidence: 48 },
];

export const alerts = [
  { id: 1, type: "red",   title: "Research Publications Critical", message: "RPC score is 7.3 points below target. Urgent faculty push needed.", time: "2 hours ago",   category: "RPC" },
  { id: 2, type: "amber", title: "Placement Rate Declining",       message: "Placement rate dropped 2.1% vs last quarter. Monitor closely.", time: "5 hours ago",   category: "GO"  },
  { id: 3, type: "amber", title: "Faculty Qualification Gap",      message: "PhD faculty ratio at 66.7%, target is 75%.",                    time: "1 day ago",     category: "TLR" },
  { id: 4, type: "blue",  title: "Patent Milestone Approaching",   message: "28 patents filed. Target 30 by Dec 2024.",                       time: "2 days ago",    category: "RPC" },
  { id: 5, type: "green", title: "Citations Milestone Achieved",   message: "Total citations crossed 8,000 milestone. Great progress!",       time: "3 days ago",    category: "RPC" },
];

export const roadmapItems = {
  "30-Day": [
    { priority: "Critical", action: "Submit 15 pending Scopus papers", impact: "+1.2 RPC", owner: "Research Cell" },
    { priority: "Critical", action: "Initiate 5 new industry consultancy projects", impact: "+0.8 RPC", owner: "Dean R&D" },
    { priority: "High",     action: "Onboard 4 PhD faculty positions", impact: "+0.6 TLR", owner: "HR" },
    { priority: "High",     action: "Launch campus recruitment drives Q1", impact: "+1.1 GO", owner: "Placement Cell" },
  ],
  "90-Day": [
    { priority: "Critical", action: "File 6 new patent applications", impact: "+2.1 RPC", owner: "IPR Cell" },
    { priority: "High",     action: "Increase international student admissions to 60", impact: "+0.9 OI", owner: "International Office" },
    { priority: "High",     action: "Upgrade 3 laboratories with modern equipment", impact: "+1.4 TLR", owner: "Dean Academics" },
    { priority: "Medium",   action: "Launch industry-academia collaboration program", impact: "+1.0 PR", owner: "External Relations" },
  ],
  "6-Month": [
    { priority: "Critical", action: "Achieve 400 publications milestone", impact: "+3.5 RPC", owner: "All Departments" },
    { priority: "High",     action: "Increase women enrollment to 45%", impact: "+1.5 OI", owner: "Admissions" },
    { priority: "High",     action: "Launch 2 new interdisciplinary research centers", impact: "+2.0 RPC", owner: "VC Office" },
    { priority: "Medium",   action: "Implement alumni mentorship program", impact: "+0.8 PR", owner: "Alumni Cell" },
  ],
  "1-Year": [
    { priority: "Strategic", action: "Target Top 35 NIRF Engineering ranking", impact: "+5–8 ranks", owner: "VC Office" },
    { priority: "Strategic", action: "Achieve NIRF score of 80+", impact: "Composite", owner: "IQAC" },
    { priority: "High",      action: "Secure ₹2 Cr+ in sponsored research", impact: "+2.8 RPC", owner: "Research Cell" },
    { priority: "High",      action: "Expand PhD program by 20 seats", impact: "+2.1 TLR+RPC", owner: "Academic Council" },
  ],
};

export type BenchmarkEntry = { tlr: number; rpc: number; go: number; oi: number; pr: number; total: number; rank: number };

export const BENCHMARK_DATA: Record<string, BenchmarkEntry> = {
  "IIT Madras":     { tlr: 28.5, rpc: 28.8, go: 19.2, oi: 8.1, pr: 9.9, total: 94.5, rank: 1 },
  "IISc Bengaluru": { tlr: 27.9, rpc: 29.3, go: 18.5, oi: 7.8, pr: 9.7, total: 93.2, rank: 2 },
  "IIT Bombay":     { tlr: 28.1, rpc: 28.1, go: 19.0, oi: 7.9, pr: 9.5, total: 92.6, rank: 3 },
  "IIT Delhi":      { tlr: 27.8, rpc: 27.9, go: 18.8, oi: 7.7, pr: 9.4, total: 91.6, rank: 4 },
  "IIM Ahmedabad":  { tlr: 26.5, rpc: 25.2, go: 19.5, oi: 7.2, pr: 9.8, total: 88.2, rank: 5 },
};
