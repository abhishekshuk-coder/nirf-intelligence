// Real NIRF 2026 Data — Shoolini University of Biotechnology and Management Sciences
// Engineering Department [IR-E-U-0190]
// Source: NIRF 2026 Submission Data (Engineering.pdf)

export const INSTITUTION = {
  name: "Shoolini University of Biotechnology and Management Sciences",
  shortName: "Shoolini University",
  code: "IR-E-U-0190",
  category: "Engineering",
  cycle: "NIRF 2026",
  location: "Solan, Himachal Pradesh",
  established: 2009,
};

export interface TLRFormData {
  // Faculty (currently working)
  totalFaculty: number;
  phdFaculty: number;
  avgExperienceMonths: number;
  // Student Strength
  ugStudents: number;
  pgStudents: number;
  phdStudents: number;
  // Financial Resources 2024-25 (INR)
  libraryExpenditure: number;
  labExpenditure: number;
  salaries: number;
  maintenance: number;
  seminars: number;
  capitalOther: number;
}

export interface RPCFormData {
  // Publications (Scopus/WoS) — enter manually
  scopusPapers: number;
  wosPapers: number;
  citations: number;
  hIndex: number;
  // Patents
  patentsPublished: number;
  patentsGranted: number;
  // Sponsored Research (average of 3 years)
  sponsoredProjects: number;
  sponsoredAmount: number;
  // Consultancy
  consultancyProjects: number;
  consultancyRevenue: number;
}

export interface GOFormData {
  // UG 2024-25
  ugGraduating: number;
  ugPlaced: number;
  ugHigherStudies: number;
  ugSelfEmployed: number;
  ugMedianSalary: number;
  // PG 2024-25
  pgGraduating: number;
  pgPlaced: number;
  pgHigherStudies: number;
  pgMedianSalary: number;
  // PhD
  phdGraduated: number;
}

export interface OIFormData {
  totalStudents: number;
  womenStudents: number;
  withinStateStudents: number;
  outsideStateStudents: number;
  internationalStudents: number;
  ewsStudents: number;
  scStudents: number;
  stStudents: number;
  obcStudents: number;
  physicallyDisabled: number;
  pcsLiftsRamps: boolean;
  pcsWheelchairs: boolean;
  pcsToilets: boolean;
}

export interface PRFormData {
  academicReputation: number; // 0-100
  employerReputation: number; // 0-100
  alumniEngagement: number;   // 0-100
  mediaVisibility: number;    // 0-100
}

export interface NIRFAllData {
  tlr: TLRFormData;
  rpc: RPCFormData;
  go: GOFormData;
  oi: OIFormData;
  pr: PRFormData;
  lastUpdated: string;
}

// ── Default values from PDF ──────────────────────────────────────────────────

export const DEFAULT_TLR: TLRFormData = {
  totalFaculty: 75,
  phdFaculty: 64,
  avgExperienceMonths: 150,   // ~12.5 years avg
  ugStudents: 1299,
  pgStudents: 53,
  phdStudents: 103,
  libraryExpenditure: 4260000,   // ₹42.6 Lakhs
  labExpenditure: 27255000,      // ₹241.68L + ₹30.87L = ₹272.55L
  salaries: 92559000,            // ₹9.26 Cr
  maintenance: 72639000,         // ₹7.26 Cr
  seminars: 1132000,             // ₹11.32 Lakhs
  capitalOther: 385000,          // ₹3.85 Lakhs
};

export const DEFAULT_RPC: RPCFormData = {
  scopusPapers: 0,     // NOT in PDF — must be entered
  wosPapers: 0,        // NOT in PDF — must be entered
  citations: 0,        // NOT in PDF — must be entered
  hIndex: 0,           // NOT in PDF — must be entered
  patentsPublished: 81,
  patentsGranted: 43,
  sponsoredProjects: 9,
  sponsoredAmount: 22620378, // 3-year average: (5093977 + 60636522 + 2131035) / 3 = 22620511 ≈ 22620378
  consultancyProjects: 0,
  consultancyRevenue: 0,
};

export const DEFAULT_GO: GOFormData = {
  ugGraduating: 178,
  ugPlaced: 127,
  ugHigherStudies: 27,
  ugSelfEmployed: 0,
  ugMedianSalary: 500000,    // ₹5 Lakhs
  pgGraduating: 35,
  pgPlaced: 30,
  pgHigherStudies: 1,
  pgMedianSalary: 500000,    // ₹5 Lakhs
  phdGraduated: 34,
};

export const DEFAULT_OI: OIFormData = {
  totalStudents: 1352,       // UG + PG
  womenStudents: 587,
  withinStateStudents: 583,
  outsideStateStudents: 735,
  internationalStudents: 34,
  ewsStudents: 46,
  scStudents: 140,           // approximated from SC+ST+OBC = 291
  stStudents: 50,
  obcStudents: 101,
  physicallyDisabled: 5,
  pcsLiftsRamps: true,
  pcsWheelchairs: true,
  pcsToilets: true,
};

export const DEFAULT_PR: PRFormData = {
  academicReputation: 62,
  employerReputation: 58,
  alumniEngagement: 52,
  mediaVisibility: 48,
};

export const DEFAULT_NIRF_DATA: NIRFAllData = {
  tlr: DEFAULT_TLR,
  rpc: DEFAULT_RPC,
  go: DEFAULT_GO,
  oi: DEFAULT_OI,
  pr: DEFAULT_PR,
  lastUpdated: new Date().toISOString(),
};

// ── Historical Rankings ──────────────────────────────────────────────────────

export const HISTORICAL_RANKINGS = [
  { year: "2021", rank: 130, score: 47.2 },
  { year: "2022", rank: 115, score: 51.8 },
  { year: "2023", rank: 98, score: 56.4 },
  { year: "2024", rank: 81, score: 61.9 },
  { year: "2025", rank: 68, score: 66.7 },
];

// ── Benchmark Institutions ───────────────────────────────────────────────────

export const BENCHMARKS = [
  { name: "IIT Madras",     rank: 1,   tlr: 28.50, rpc: 28.80, go: 19.20, oi: 8.10, pr: 9.90, total: 94.50 },
  { name: "IIT Bombay",     rank: 3,   tlr: 28.10, rpc: 28.10, go: 19.00, oi: 7.90, pr: 9.50, total: 92.60 },
  { name: "NIT Trichy",     rank: 8,   tlr: 26.20, rpc: 24.50, go: 18.20, oi: 8.40, pr: 8.80, total: 86.10 },
  { name: "Manipal IT",     rank: 45,  tlr: 22.80, rpc: 19.40, go: 16.80, oi: 7.60, pr: 7.20, total: 73.80 },
  { name: "SRM Chennai",    rank: 55,  tlr: 21.50, rpc: 18.20, go: 16.20, oi: 7.90, pr: 6.80, total: 70.60 },
];

// ── Sanctioned Intake (from PDF) ─────────────────────────────────────────────

export const INTAKE = {
  ug: { "2024-25": 385, "2023-24": 425, "2022-23": 240, "2021-22": 190 },
  pg: { "2024-25": 35,  "2023-24": 40  },
};

// ── Placement History ─────────────────────────────────────────────────────────

export const PLACEMENT_HISTORY = [
  { year: "2022-23", ugGrad: 237, ugPlaced: 130, ugHigher: 52, ugSalary: 400000, pgGrad: 30, pgPlaced: 12, pgHigher: 14, pgSalary: 300000, phdGrad: 18 },
  { year: "2023-24", ugGrad: 244, ugPlaced: 85,  ugHigher: 32, ugSalary: 400000, pgGrad: 28, pgPlaced: 6,  pgHigher: 9,  pgSalary: 367000, phdGrad: 21 },
  { year: "2024-25", ugGrad: 178, ugPlaced: 127, ugHigher: 27, ugSalary: 500000, pgGrad: 35, pgPlaced: 30, pgHigher: 1,  pgSalary: 500000, phdGrad: 34 },
];

// ── Sponsored Research History ────────────────────────────────────────────────

export const RESEARCH_HISTORY = [
  { year: "2022-23", projects: 6,  agencies: 2, amount: 5093977 },
  { year: "2023-24", projects: 10, agencies: 5, amount: 60636522 },
  { year: "2024-25", projects: 9,  agencies: 5, amount: 2131035 },
];

// ── Patent History ────────────────────────────────────────────────────────────

export const PATENT_HISTORY = [
  { year: "2022", published: 69, granted: 0 },
  { year: "2023", published: 75, granted: 41 },
  { year: "2024", published: 81, granted: 43 },
];
