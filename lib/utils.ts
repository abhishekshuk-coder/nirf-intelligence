import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number): string {
  if (n >= 10000000) return (n / 10000000).toFixed(1) + "Cr";
  if (n >= 100000)   return (n / 100000).toFixed(1) + "L";
  if (n >= 1000)     return (n / 1000).toFixed(1) + "K";
  return n.toString();
}

export function formatScore(n: number): string {
  return n.toFixed(2);
}

export function getRankChange(current: number, previous: number): { value: number; direction: "up" | "down" | "same" } {
  const diff = previous - current; // lower rank number = better
  if (diff > 0) return { value: diff, direction: "up" };
  if (diff < 0) return { value: Math.abs(diff), direction: "down" };
  return { value: 0, direction: "same" };
}

export function getScoreColor(score: number, max = 100): string {
  const pct = (score / max) * 100;
  if (pct >= 75) return "#16A34A";
  if (pct >= 50) return "#D97706";
  return "#DC2626";
}

export function getStatusLabel(score: number, max = 100): "Healthy" | "Needs Attention" | "Critical" {
  const pct = (score / max) * 100;
  if (pct >= 75) return "Healthy";
  if (pct >= 50) return "Needs Attention";
  return "Critical";
}

/* NIRF Scoring Engine */
export interface NIRFInputs {
  tlr: { faculty: number; students: number; qualifiedFaculty: number; financialResources: number; libraryExp: number; labExp: number };
  rpc: { publications: number; citations: number; hIndex: number; patents: number; consultancy: number; sponsoredProjects: number };
  go:  { placed: number; higherStudies: number; totalGraduates: number; medianSalary: number; phdGraduates: number };
  oi:  { women: number; totalStudents: number; ewsStudents: number; regionalDiversity: number; disabled: number; international: number };
  pr:  { academicReputation: number; employerReputation: number; alumniScore: number };
}

export interface NIRFScores {
  tlr: number; rpc: number; go: number; oi: number; pr: number;
  total: number; estimatedRank: number;
}

export function calculateNIRFScores(inputs: NIRFInputs): NIRFScores {
  // TLR (30%)
  const fsRatio = inputs.tlr.students / Math.max(inputs.tlr.faculty, 1);
  const fsScore = Math.max(0, 100 - (fsRatio - 15) * 3);
  const qualScore = (inputs.tlr.qualifiedFaculty / Math.max(inputs.tlr.faculty, 1)) * 100;
  const finScore = Math.min(100, inputs.tlr.financialResources / 50000);
  const tlr = Math.min(30, ((fsScore * 0.3 + qualScore * 0.4 + finScore * 0.3) / 100) * 30);

  // RPC (30%)
  const pubScore = Math.min(100, (inputs.rpc.publications / inputs.tlr.faculty) * 10);
  const citScore = Math.min(100, (inputs.rpc.citations / Math.max(inputs.rpc.publications, 1)) * 5);
  const patScore = Math.min(100, inputs.rpc.patents * 2);
  const rpc = Math.min(30, ((pubScore * 0.35 + citScore * 0.35 + patScore * 0.15 + Math.min(100, inputs.rpc.consultancy / 10000) * 0.15) / 100) * 30);

  // GO (20%)
  const totalGrad = Math.max(inputs.go.totalGraduates, 1);
  const placedPct = ((inputs.go.placed + inputs.go.higherStudies) / totalGrad) * 100;
  const salScore = Math.min(100, inputs.go.medianSalary / 700);
  const go = Math.min(20, ((placedPct * 0.6 + salScore * 0.3 + Math.min(100, (inputs.go.phdGraduates / totalGrad) * 500) * 0.1) / 100) * 20);

  // OI (10%)
  const oiTotal = Math.max(inputs.oi.totalStudents, 1);
  const womenPct = (inputs.oi.women / oiTotal) * 100;
  const ewsPct   = (inputs.oi.ewsStudents / oiTotal) * 100;
  const oi = Math.min(10, ((Math.min(100, womenPct * 1.5) * 0.3 + Math.min(100, ewsPct * 3) * 0.3 + Math.min(100, inputs.oi.regionalDiversity * 10) * 0.2 + Math.min(100, inputs.oi.disabled * 10) * 0.1 + Math.min(100, inputs.oi.international * 20) * 0.1) / 100) * 10);

  // PR (10%)
  const pr = Math.min(10, ((inputs.pr.academicReputation * 0.5 + inputs.pr.employerReputation * 0.35 + inputs.pr.alumniScore * 0.15) / 100) * 10);

  const total = tlr + rpc + go + oi + pr;

  // Rough rank estimation
  const estimatedRank = total >= 85 ? Math.ceil((100 - total) * 2) :
                        total >= 70 ? Math.ceil((100 - total) * 5) :
                        total >= 55 ? Math.ceil((100 - total) * 8) :
                        Math.ceil((100 - total) * 12);

  return { tlr: +tlr.toFixed(2), rpc: +rpc.toFixed(2), go: +go.toFixed(2), oi: +oi.toFixed(2), pr: +pr.toFixed(2), total: +total.toFixed(2), estimatedRank };
}

// BENCHMARK_DATA is exported from lib/mock-data.ts

export const NIRF_WEIGHTS = { tlr: 0.30, rpc: 0.30, go: 0.20, oi: 0.10, pr: 0.10 };
