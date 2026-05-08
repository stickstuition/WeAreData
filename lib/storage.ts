"use client";

import { create } from "zustand";

import { SEEDED_FORECASTS, SEEDED_HISTORY, SEEDED_WEEKLY_PLAN } from "@/lib/seed";
import { canUseRecipe, normalizeWeeklyPlan, optimizeWeeklyPlan } from "@/lib/analytics";
import { WeatherForecastDay } from "@/lib/types";
import { AppLanguage, DailyForecast, HistoricalRecord, ScannedDocument, WeeklyPlan } from "@/lib/types";

const STORAGE_KEY = "tempero-pilot-v1";
const AUTH_KEY = "tempero-authenticated";

type PersistedState = {
  language: AppLanguage;
  selectedDay: string;
  weeklyPlan: WeeklyPlan;
  forecasts: DailyForecast[];
  history: HistoricalRecord[];
  scans: ScannedDocument[];
};

type CanteenState = PersistedState & {
  hydrated: boolean;
  authenticated: boolean;
  hydrate: () => void;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  setLanguage: (language: AppLanguage) => void;
  setSelectedDay: (day: string) => void;
  updatePlanSlot: (day: string, category: string, slotIndex: number, recipeId: string) => void;
  updateForecast: (day: string, recipeId: string, patch: Partial<DailyForecast>) => void;
  optimizePlan: (weather: WeatherForecastDay[]) => void;
  addHistoryRecord: (record: HistoricalRecord) => void;
  addScan: (scan: ScannedDocument) => void;
  updateScan: (scanId: string, patch: Partial<ScannedDocument>) => void;
  commitScan: (scanId: string) => void;
};

const defaults: PersistedState = {
  language: "English",
  selectedDay: "Day 1",
  weeklyPlan: normalizeWeeklyPlan(SEEDED_WEEKLY_PLAN),
  forecasts: SEEDED_FORECASTS,
  history: SEEDED_HISTORY,
  scans: []
};

function persist(state: PersistedState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function snapshot(state: CanteenState): PersistedState {
  return {
    language: state.language,
    selectedDay: state.selectedDay,
    weeklyPlan: state.weeklyPlan,
    forecasts: state.forecasts,
    history: state.history,
    scans: state.scans
  };
}

export const useCanteenStore = create<CanteenState>((set, get) => ({
  ...defaults,
  hydrated: false,
  authenticated: false,
  hydrate: () => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as PersistedState) : defaults;
    set({
      ...defaults,
      ...parsed,
      weeklyPlan: normalizeWeeklyPlan(parsed.weeklyPlan ?? defaults.weeklyPlan),
      scans: parsed.scans ?? [],
      authenticated: window.localStorage.getItem(AUTH_KEY) === "true",
      hydrated: true
    });
  },
  login: (username, password) => {
    const ok = username === "user" && password === "password1";
    if (ok && typeof window !== "undefined") {
      window.localStorage.setItem(AUTH_KEY, "true");
      set({ authenticated: true });
    }
    return ok;
  },
  logout: () => {
    if (typeof window !== "undefined") window.localStorage.removeItem(AUTH_KEY);
    set({ authenticated: false });
  },
  setLanguage: (language) => {
    set({ language });
    persist(snapshot(get()));
  },
  setSelectedDay: (selectedDay) => {
    set({ selectedDay });
    persist(snapshot(get()));
  },
  updatePlanSlot: (day, category, slotIndex, recipeId) => {
    set((state) => {
      const currentRecipeId = state.weeklyPlan[day][category as keyof WeeklyPlan[string]][slotIndex];
      if (!canUseRecipe(state.weeklyPlan, currentRecipeId, recipeId)) return {};
      const next = {
        ...state.weeklyPlan,
        [day]: {
          ...state.weeklyPlan[day],
          [category]: state.weeklyPlan[day][category as keyof WeeklyPlan[string]].map((current, index) =>
            index === slotIndex ? recipeId : current
          )
        }
      };
      return { weeklyPlan: normalizeWeeklyPlan(next) };
    });
    persist(snapshot(get()));
  },
  updateForecast: (day, recipeId, patch) => {
    set((state) => {
      const exists = state.forecasts.some((item) => item.day === day && item.recipeId === recipeId);
      const forecasts = exists
        ? state.forecasts.map((item) => (item.day === day && item.recipeId === recipeId ? { ...item, ...patch } : item))
        : [
            ...state.forecasts,
            {
              day,
              recipeId,
              forecastPortions: patch.forecastPortions ?? patch.manualForecast ?? 0,
              manualForecast: patch.manualForecast ?? patch.forecastPortions ?? 0,
              actualSold: patch.actualSold ?? 0,
              actualRevenue: patch.actualRevenue ?? 0,
              correctionType: patch.correctionType ?? "none",
              varianceNote: patch.varianceNote ?? ""
            }
          ];
      return { forecasts };
    });
    persist(snapshot(get()));
  },
  optimizePlan: (weather) => {
    set((state) => ({ weeklyPlan: optimizeWeeklyPlan(state.weeklyPlan, state.history, weather) }));
    persist(snapshot(get()));
  },
  addHistoryRecord: (record) => {
    set((state) => ({ history: [...state.history, record] }));
    persist(snapshot(get()));
  },
  addScan: (scan) => {
    set((state) => ({ scans: [scan, ...state.scans] }));
    persist(snapshot(get()));
  },
  updateScan: (scanId, patch) => {
    set((state) => ({ scans: state.scans.map((scan) => (scan.id === scanId ? { ...scan, ...patch } : scan)) }));
    persist(snapshot(get()));
  },
  commitScan: (scanId) => {
    set((state) => ({ scans: state.scans.map((scan) => (scan.id === scanId ? { ...scan, committed: true } : scan)) }));
    persist(snapshot(get()));
  }
}));
