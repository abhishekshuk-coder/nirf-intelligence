"use client";
import { useState, useEffect, useCallback } from "react";
import {
  DEFAULT_NIRF_DATA,
  type NIRFAllData, type TLRFormData, type RPCFormData,
  type GOFormData, type OIFormData, type PRFormData,
} from "@/lib/shoolini-data";
import { calculateAllScores, type NIRFScores, type ScoreBreakdown } from "@/lib/nirf-engine";

const STORAGE_KEY = "nirf_platform_data_v1";

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

  // Load from localStorage on mount
  useEffect(() => {
    const stored = loadFromStorage();
    setData(stored);
    setIsLoaded(true);
  }, []);

  // Recalculate scores whenever data changes
  useEffect(() => {
    if (!isLoaded) return;
    const result = calculateAllScores(data.tlr, data.rpc, data.go, data.oi, data.pr);
    setScores(result.scores);
    setBreakdown(result.breakdown);
  }, [data, isLoaded]);

  const updateTLR = useCallback((tlr: TLRFormData) => {
    setData((prev) => {
      const next = { ...prev, tlr, lastUpdated: new Date().toISOString() };
      saveToStorage(next);
      return next;
    });
  }, []);

  const updateRPC = useCallback((rpc: RPCFormData) => {
    setData((prev) => {
      const next = { ...prev, rpc, lastUpdated: new Date().toISOString() };
      saveToStorage(next);
      return next;
    });
  }, []);

  const updateGO = useCallback((go: GOFormData) => {
    setData((prev) => {
      const next = { ...prev, go, lastUpdated: new Date().toISOString() };
      saveToStorage(next);
      return next;
    });
  }, []);

  const updateOI = useCallback((oi: OIFormData) => {
    setData((prev) => {
      const next = { ...prev, oi, lastUpdated: new Date().toISOString() };
      saveToStorage(next);
      return next;
    });
  }, []);

  const updatePR = useCallback((pr: PRFormData) => {
    setData((prev) => {
      const next = { ...prev, pr, lastUpdated: new Date().toISOString() };
      saveToStorage(next);
      return next;
    });
  }, []);

  const resetToDefaults = useCallback(() => {
    setData(DEFAULT_NIRF_DATA);
    saveToStorage(DEFAULT_NIRF_DATA);
  }, []);

  return { data, scores, breakdown, isLoaded, updateTLR, updateRPC, updateGO, updateOI, updatePR, resetToDefaults };
}
