"use client";

import { create } from "zustand";

import { SEEDED_ENTRIES } from "@/lib/seed";
import { DailyMenuEntry } from "@/lib/types";

const STORAGE_KEY = "nova-sbe-canteen-dashboard";

type CanteenState = {
  customEntries: DailyMenuEntry[];
  hydrated: boolean;
  hydrate: () => void;
  addEntries: (entries: DailyMenuEntry[]) => void;
  allEntries: () => DailyMenuEntry[];
};

export const useCanteenStore = create<CanteenState>((set, get) => ({
  customEntries: [],
  hydrated: false,
  hydrate: () => {
    if (typeof window === "undefined") return;

    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: DailyMenuEntry[] = raw ? JSON.parse(raw) : [];
    set({ customEntries: parsed, hydrated: true });
  },
  addEntries: (entries) => {
    const next = [...get().customEntries, ...entries];
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
    set({ customEntries: next });
  },
  allEntries: () => [...SEEDED_ENTRIES, ...get().customEntries].sort((a, b) => a.date.localeCompare(b.date))
}));
