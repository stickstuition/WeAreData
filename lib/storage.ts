"use client";

import { create } from "zustand";

import { SEEDED_FORECASTS, SEEDED_HISTORY, SEEDED_WEEKLY_PLAN } from "@/lib/seed";
import { canUseRecipe, normalizeWeeklyPlan, optimizeWeeklyPlan } from "@/lib/analytics";
import { WeatherForecastDay } from "@/lib/types";
import { AppLanguage, DailyForecast, HistoricalRecord, WeeklyPlan } from "@/lib/types";

const STORAGE_KEY = "nova-sbe-canteen-framework-v2";

type PersistedState = {
  language: AppLanguage;
  selectedDay: string;
  weeklyPlan: WeeklyPlan;
  forecasts: DailyForecast[];
  history: HistoricalRecord[];
};

type CanteenState = PersistedState & {
  hydrated: boolean;
  hydrate: () => void;
  setLanguage: (language: AppLanguage) => void;
  setSelectedDay: (day: string) => void;
  updatePlanSlot: (day: string, category: string, slotIndex: number, recipeId: string) => void;
  updateForecast: (day: string, recipeId: string, patch: Partial<DailyForecast>) => void;
  optimizePlan: (weather: WeatherForecastDay[]) => void;
  addHistoryRecord: (record: HistoricalRecord) => void;
};

const defaults: PersistedState = {
  language: "English",
  selectedDay: "Day 1",
  weeklyPlan: normalizeWeeklyPlan(SEEDED_WEEKLY_PLAN),
  forecasts: SEEDED_FORECASTS,
  history: SEEDED_HISTORY
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
    history: state.history
  };
}

export const useCanteenStore = create<CanteenState>((set, get) => ({
  ...defaults,
  hydrated: false,
  hydrate: () => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as PersistedState) : defaults;
    set({ ...defaults, ...parsed, weeklyPlan: normalizeWeeklyPlan(parsed.weeklyPlan ?? defaults.weeklyPlan), hydrated: true });
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
  }
}));
