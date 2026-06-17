// NIRF Scoring Engine — approximates the official NIRF Engineering methodology
// Based on NIRF Engineering framework: TLR(30) + RPC(30) + GO(20) + OI(10) + PR(10) = 100

import type { TLRFormData, RPCFormData, GOFormData, OIFormData, PRFormData } from "./shoolini-data";

export interface NIRFScores {
  tlr: number;
  rpc: number;
  go: number;
  oi: number;
  pr: number;
  total: number;
  estimatedRank: number;
  completeness: number; // 0-100, how complete the data is
}

export interface ScoreBreakdown {
  tlr: { fsr: number; qualification: number; financial: number; total: number };
  rpc: { publications: number; citations: number; patents: number; research: number; consultancy: number; total: number };
  go: { outcomes: number; salary: number; phd: number; total: number };
  oi: { women: number; reserved: number; regional: number; international: number; pcs: number; total: number };
  pr: { total: number };
}

function clamp(val: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, val));
}

export function calculateTLR(data: TLRFormData): { score: number; breakdown: ScoreBreakdown["tlr"] } {
  const totalExp = data.salaries + data.maintenance + data.libraryExpenditure + data.labExpenditure + data.seminars + data.capitalOther;

  // Faculty-Student Ratio (ideal: 20:1 for Engineering)
  const weighted = data.ugStudents + data.pgStudents * 1.5 + data.phdStudents * 2.0;
  const fsr = weighted / Math.max(data.totalFaculty, 1);
  const fsrScore = clamp(20 / fsr);

  // Faculty Qualification
  const qualScore = clamp(data.phdFaculty / Math.max(data.totalFaculty, 1));

  // Financial Resources Utilization
  const libRatio = totalExp > 0 ? data.libraryExpenditure / totalExp : 0;
  const labRatio = totalExp > 0 ? data.labExpenditure / totalExp : 0;
  const expPerStudent = weighted > 0 ? totalExp / weighted : 0;

  const libScore  = clamp(libRatio / 0.05);         // 5% target
  const labScore  = clamp(labRatio / 0.07);         // 7% target
  const expScore  = clamp(expPerStudent / 100000);  // ₹1 Lakh/student target

  const finScore = libScore * 0.40 + labScore * 0.35 + expScore * 0.25;

  const raw = fsrScore * 0.35 + qualScore * 0.30 + finScore * 0.35;
  const score = +Math.min(30, raw * 30).toFixed(2);

  return {
    score,
    breakdown: {
      fsr: +(fsrScore * 10.5).toFixed(2),          // out of 10.5
      qualification: +(qualScore * 9).toFixed(2),  // out of 9
      financial: +(finScore * 10.5).toFixed(2),    // out of 10.5
      total: score,
    },
  };
}

export function calculateRPC(data: RPCFormData, faculty: number): { score: number; breakdown: ScoreBreakdown["rpc"] } {
  const f = Math.max(faculty, 1);
  const totalPapers = data.scopusPapers + data.wosPapers;

  // Publications per faculty (target: 5/faculty)
  const pubScore = clamp((totalPapers / f) / 5);

  // Citations per paper (target: 8/paper)
  const citScore = totalPapers > 0 ? clamp((data.citations / totalPapers) / 8) : 0;

  // Patents granted per faculty (target: 0.4/faculty)
  const patScore = clamp((data.patentsGranted / f) / 0.4);

  // Sponsored research per faculty (target: ₹15L/faculty/year)
  const resScore = clamp((data.sponsoredAmount / f) / 1500000);

  // Consultancy per faculty (target: ₹5L/faculty)
  const conScore = data.consultancyRevenue > 0
    ? clamp((data.consultancyRevenue / f) / 500000)
    : 0;

  const raw = pubScore * 0.30 + citScore * 0.25 + patScore * 0.20 + resScore * 0.15 + conScore * 0.10;
  const score = +Math.min(30, raw * 30).toFixed(2);

  return {
    score,
    breakdown: {
      publications: +(pubScore * 9).toFixed(2),
      citations: +(citScore * 7.5).toFixed(2),
      patents: +(patScore * 6).toFixed(2),
      research: +(resScore * 4.5).toFixed(2),
      consultancy: +(conScore * 3).toFixed(2),
      total: score,
    },
  };
}

export function calculateGO(data: GOFormData): { score: number; breakdown: ScoreBreakdown["go"] } {
  const totalGrad = data.ugGraduating + data.pgGraduating;
  const totalOutcomes = data.ugPlaced + data.pgPlaced + data.ugHigherStudies + data.pgHigherStudies + data.ugSelfEmployed;

  // Outcome rate (placed + higher + self-employed)
  const outcomeRate = totalGrad > 0 ? clamp(totalOutcomes / totalGrad) : 0;

  // Weighted median salary (target: ₹7L)
  const weightedSalary = totalGrad > 0
    ? (data.ugGraduating * data.ugMedianSalary + data.pgGraduating * data.pgMedianSalary) / totalGrad
    : 0;
  const salScore = clamp(weightedSalary / 700000);

  // PhD graduation rate (target: 15% of total graduates)
  const phdScore = totalGrad > 0 ? clamp((data.phdGraduated / totalGrad) / 0.15) : 0;

  const raw = outcomeRate * 0.60 + salScore * 0.30 + phdScore * 0.10;
  const score = +Math.min(20, raw * 20).toFixed(2);

  return {
    score,
    breakdown: {
      outcomes: +(outcomeRate * 12).toFixed(2),
      salary: +(salScore * 6).toFixed(2),
      phd: +(phdScore * 2).toFixed(2),
      total: score,
    },
  };
}

export function calculateOI(data: OIFormData): { score: number; breakdown: ScoreBreakdown["oi"] } {
  const total = Math.max(data.totalStudents, 1);

  const womenPct    = data.womenStudents / total;
  const reservedPct = (data.ewsStudents + data.scStudents + data.stStudents + data.obcStudents) / total;
  const outsidePct  = data.outsideStateStudents / total;
  const intlPct     = data.internationalStudents / total;
  const pcsCount    = (data.pcsLiftsRamps ? 1 : 0) + (data.pcsWheelchairs ? 1 : 0) + (data.pcsToilets ? 1 : 0);

  const womenScore    = clamp(womenPct / 0.33);           // target: 33%
  const reservedScore = clamp(reservedPct / 0.27);        // target: 27% (EWS+SC+ST+OBC)
  const regionalScore = clamp(outsidePct / 0.30);         // target: 30% outside state
  const intlScore     = clamp(intlPct / 0.025);           // target: 2.5% international
  const pcsScore      = pcsCount / 3;

  const raw = womenScore * 0.30 + reservedScore * 0.25 + regionalScore * 0.25 + intlScore * 0.10 + pcsScore * 0.10;
  const score = +Math.min(10, raw * 10).toFixed(2);

  return {
    score,
    breakdown: {
      women: +(womenScore * 3).toFixed(2),
      reserved: +(reservedScore * 2.5).toFixed(2),
      regional: +(regionalScore * 2.5).toFixed(2),
      international: +(intlScore * 1).toFixed(2),
      pcs: +(pcsScore * 1).toFixed(2),
      total: score,
    },
  };
}

export function calculatePR(data: PRFormData): { score: number; breakdown: ScoreBreakdown["pr"] } {
  const raw = (data.academicReputation * 0.45 + data.employerReputation * 0.35 + data.alumniEngagement * 0.20) / 100;
  const score = +Math.min(10, raw * 10).toFixed(2);
  return { score, breakdown: { total: score } };
}

export function calculateAllScores(
  tlrData: TLRFormData,
  rpcData: RPCFormData,
  goData: GOFormData,
  oiData: OIFormData,
  prData: PRFormData,
): { scores: NIRFScores; breakdown: ScoreBreakdown } {
  const tlrResult = calculateTLR(tlrData);
  const rpcResult = calculateRPC(rpcData, tlrData.totalFaculty);
  const goResult  = calculateGO(goData);
  const oiResult  = calculateOI(oiData);
  const prResult  = calculatePR(prData);

  const total = tlrResult.score + rpcResult.score + goResult.score + oiResult.score + prResult.score;

  // Check data completeness — penalize missing publications
  const hasPublications = rpcData.scopusPapers > 0 || rpcData.wosPapers > 0;
  const hasCitations    = rpcData.citations > 0;
  const completeness    = Math.round(
    (hasPublications ? 35 : 0) + (hasCitations ? 15 : 0) +
    (tlrData.totalFaculty > 0 ? 20 : 0) + (goData.ugGraduating > 0 ? 20 : 0) +
    (oiData.totalStudents > 0 ? 10 : 0),
  );

  const estimatedRank = estimateRank(total);

  return {
    scores: {
      tlr: tlrResult.score,
      rpc: rpcResult.score,
      go: goResult.score,
      oi: oiResult.score,
      pr: prResult.score,
      total: +total.toFixed(2),
      estimatedRank,
      completeness,
    },
    breakdown: {
      tlr: tlrResult.breakdown,
      rpc: rpcResult.breakdown,
      go: goResult.breakdown,
      oi: oiResult.breakdown,
      pr: prResult.breakdown,
    },
  };
}

export function estimateRank(score: number): number {
  if (score >= 90) return Math.round(1  + (90 - score) * 0.5);
  if (score >= 85) return Math.round(5  + (85 - score) * 3);
  if (score >= 80) return Math.round(20 + (80 - score) * 6);
  if (score >= 75) return Math.round(50 + (75 - score) * 8);
  if (score >= 70) return Math.round(90 + (70 - score) * 10);
  if (score >= 65) return Math.round(140 + (65 - score) * 12);
  if (score >= 60) return Math.round(200 + (60 - score) * 14);
  if (score >= 55) return Math.round(270 + (55 - score) * 16);
  return Math.round(350 + (50 - score) * 20);
}

// Scenario projection: how much score improvement = how many rank positions
export function projectScenarios(currentTotal: number): Array<{ label: string; delta: number; newScore: number; newRank: number }> {
  return [
    { label: "Conservative (+2 pts)", delta: 2 },
    { label: "Base Case (+5 pts)",     delta: 5 },
    { label: "Optimistic (+8 pts)",    delta: 8 },
    { label: "Best Case (+12 pts)",    delta: 12 },
  ].map(({ label, delta }) => {
    const newScore = Math.min(100, currentTotal + delta);
    return { label, delta, newScore: +newScore.toFixed(2), newRank: estimateRank(newScore) };
  });
}
