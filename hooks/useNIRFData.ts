"use client";
import { useState, useEffect, useCallback } from "react";
import {
  DEFAULT_NIRF_DATA,
  type NIRFAllData, type InstitutionInfo, type TLRFormData, type RPCFormData,
  type GOFormData, type OIFormData, type PRFormData,
} from "@/lib/shoolini-data";
import { calculateAllScores, type NIRFScores, type ScoreBreakdown } from "@/lib/nirf-engine";

const STORAGE_KEY = "nirf_platform_data_v2";

function loadFromStorage(): NIRFAllData {
  if (typeof window === "undefined") return DEFAULT_NIRF_DATA;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_NIRF_DATA;
    return { ...DEFAULT_NIRF_DATA, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_NIRF_DATA;
  }
}

function saveToStorage(data: NIRFAllData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useNIRFData() {
  const [data, setData] = useState<NIRFAllData>(DEFAULT_NIRF_DATA);
  const [isLoaded, setIsLoaded] = useState(false);
  const [scores, setScores] = useState<NIRFScores | null>(null);
  const [breakdown, setBreakdown] = useState<ScoreBreakdown | null>(null);

  useEffect(() => {
    const stored = loadFromStorage();
    setData(stored);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    const result = calculateAllScores(data.tlr, data.rpc, data.go, data.oi, data.pr);
    setScores(result.scores);
    setBreakdown(result.breakdown);
  }, [data, isLoaded]);

  const update = useCallback((partial: Partial<NIRFAllData>) => {
    setData((prev) => {
      const next = { ...prev, ...partial, lastUpdated: new Date().toISOString() };
      saveToStorage(next);
      return next;
    });
  }, []);

  const updateInstitution = useCallback((inst: InstitutionInfo) => update({ institution: inst }), [update]);
  const updateTLR = useCallback((tlr: TLRFormData) => update({ tlr }), [update]);
  const updateRPC = useCallback((rpc: RPCFormData) => update({ rpc }), [update]);
  const updateGO  = useCallback((go: GOFormData) => update({ go }), [update]);
  const updateOI  = useCallback((oi: OIFormData) => update({ oi }), [update]);
  const updatePR  = useCallback((pr: PRFormData) => update({ pr }), [update]);

  const resetToDefaults = useCallback(() => {
    setData(DEFAULT_NIRF_DATA);
    saveToStorage(DEFAULT_NIRF_DATA);
  }, []);

  const institution = data.institution ?? DEFAULT_NIRF_DATA.institution;

  return { data, institution, scores, breakdown, isLoaded, updateInstitution, updateTLR, updateRPC, updateGO, updateOI, updatePR, resetToDefaults };
}
