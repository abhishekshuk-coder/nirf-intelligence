// NIRF Intelligence Platform — Universal Data Model
// Works with any institution. Data is loaded via CSV upload or manual entry.

export interface InstitutionInfo {
  name: string;
  shortName: string;
  code: string;
  category: string;
  cycle: string;
  location: string;
}

export const DEFAULT_INSTITUTION: InstitutionInfo = {
  name: "Your University",
  shortName: "Your University",
  code: "IR-X-U-0000",
  category: "Engineering",
  cycle: "NIRF 2026",
  location: "",
};

// Kept for backward compat — pages can import this but it reads from localStorage
export const INSTITUTION = DEFAULT_INSTITUTION;

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
  institution: InstitutionInfo;
  tlr: TLRFormData;
  rpc: RPCFormData;
  go: GOFormData;
  oi: OIFormData;
  pr: PRFormData;
  lastUpdated: string;
}

// ── Default values (blank slate — user uploads their own data) ───────────────

export const DEFAULT_TLR: TLRFormData = {
  totalFaculty: 0, phdFaculty: 0, avgExperienceMonths: 0,
  ugStudents: 0, pgStudents: 0, phdStudents: 0,
  libraryExpenditure: 0, labExpenditure: 0, salaries: 0,
  maintenance: 0, seminars: 0, capitalOther: 0,
};

export const DEFAULT_RPC: RPCFormData = {
  scopusPapers: 0, wosPapers: 0, citations: 0, hIndex: 0,
  patentsPublished: 0, patentsGranted: 0,
  sponsoredProjects: 0, sponsoredAmount: 0,
  consultancyProjects: 0, consultancyRevenue: 0,
};

export const DEFAULT_GO: GOFormData = {
  ugGraduating: 0, ugPlaced: 0, ugHigherStudies: 0, ugSelfEmployed: 0, ugMedianSalary: 0,
  pgGraduating: 0, pgPlaced: 0, pgHigherStudies: 0, pgMedianSalary: 0, phdGraduated: 0,
};

export const DEFAULT_OI: OIFormData = {
  totalStudents: 0, womenStudents: 0, withinStateStudents: 0, outsideStateStudents: 0,
  internationalStudents: 0, ewsStudents: 0, scStudents: 0, stStudents: 0, obcStudents: 0,
  physicallyDisabled: 0, pcsLiftsRamps: false, pcsWheelchairs: false, pcsToilets: false,
};

export const DEFAULT_PR: PRFormData = {
  academicReputation: 0, employerReputation: 0, alumniEngagement: 0, mediaVisibility: 0,
};

export const DEFAULT_NIRF_DATA: NIRFAllData = {
  institution: DEFAULT_INSTITUTION,
  tlr: DEFAULT_TLR, rpc: DEFAULT_RPC, go: DEFAULT_GO, oi: DEFAULT_OI, pr: DEFAULT_PR,
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
