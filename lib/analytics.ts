import { DISHES, HERO_DISHES } from "@/lib/constants";
import {
  DailyMenuEntry,
  DerivedMetrics,
  Dish,
  DishPerformance,
  EntryWithDish,
  Filters,
  Recommendation
} from "@/lib/types";

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

export const round = (value: number, digits = 1) =>
  Number(value.toFixed(digits));

export const getDishById = (dishId: string) =>
  DISHES.find((dish) => dish.id === dishId);

export function deriveMetrics(
  entry: DailyMenuEntry,
  dish: Dish | undefined
): DerivedMetrics {
  const produced = Math.max(entry.portionsProduced, 1);
  const grossRevenue = entry.portionsSold * (dish?.sellingPricePerPortion ?? 0);
  const foodCost = entry.portionsProduced * (dish?.estimatedCostPerPortion ?? 0);

  return {
    sellThroughRate: entry.portionsSold / produced,
    wasteRate: entry.portionsWasted / produced,
    grossRevenue,
    foodCost,
    estimatedMargin: grossRevenue - foodCost
  };
}

export function withDish(entries: DailyMenuEntry[]): EntryWithDish[] {
  return entries.flatMap((entry) => {
    const dish = getDishById(entry.dishId);
    return dish ? [{ ...entry, dish }] : [];
  });
}

export function getMenuDaySummaries(entries: EntryWithDish[]) {
  const grouped = new Map<string, EntryWithDish[]>();

  for (const entry of entries) {
    const current = grouped.get(entry.date) ?? [];
    current.push(entry);
    grouped.set(entry.date, current);
  }

  return Array.from(grouped.entries())
    .map(([date, dayEntries]) => {
      const totals = dayEntries.reduce(
        (acc, entry) => {
          const metrics = deriveMetrics(entry, entry.dish);
          acc.produced += entry.portionsProduced;
          acc.sold += entry.portionsSold;
          acc.waste += entry.portionsWasted;
          acc.revenue += metrics.grossRevenue;
          acc.cost += metrics.foodCost;
          acc.margin += metrics.estimatedMargin;
          return acc;
        },
        { produced: 0, sold: 0, waste: 0, revenue: 0, cost: 0, margin: 0 }
      );

      return {
        date,
        weekday: dayEntries[0]?.weekday ?? "",
        totals
      };
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getOverviewStats(entries: EntryWithDish[]) {
  const totals = entries.reduce(
    (acc, entry) => {
      const metrics = deriveMetrics(entry, entry.dish);
      acc.produced += entry.portionsProduced;
      acc.sold += entry.portionsSold;
      acc.waste += entry.portionsWasted;
      acc.revenue += metrics.grossRevenue;
      acc.cost += metrics.foodCost;
      acc.margin += metrics.estimatedMargin;
      return acc;
    },
    { produced: 0, sold: 0, waste: 0, revenue: 0, cost: 0, margin: 0 }
  );

  return {
    ...totals,
    wasteRate: totals.produced ? totals.waste / totals.produced : 0,
    sellThroughRate: totals.produced ? totals.sold / totals.produced : 0
  };
}

export function getDishPerformance(entries: EntryWithDish[]): DishPerformance[] {
  const grouped = new Map<string, EntryWithDish[]>();

  for (const entry of entries) {
    const bucket = grouped.get(entry.dishId) ?? [];
    bucket.push(entry);
    grouped.set(entry.dishId, bucket);
  }

  return Array.from(grouped.entries())
    .map(([dishId, dishEntries]) => {
      const metrics = dishEntries.map((entry) => deriveMetrics(entry, entry.dish));
      const avgSellThrough =
        metrics.reduce((sum, item) => sum + item.sellThroughRate, 0) / metrics.length;
      const avgWasteRate =
        metrics.reduce((sum, item) => sum + item.wasteRate, 0) / metrics.length;
      const avgMargin =
        metrics.reduce((sum, item) => sum + item.estimatedMargin, 0) / metrics.length;
      const variance =
        metrics.reduce(
          (sum, item) => sum + Math.abs(item.sellThroughRate - avgSellThrough),
          0
        ) / metrics.length;
      const consistencyScore = clamp(1 - variance / 0.35);
      const normalizedMargin = clamp(avgMargin / 120);
      const score =
        avgSellThrough * 42 +
        (1 - avgWasteRate) * 24 +
        normalizedMargin * 22 +
        consistencyScore * 12;
      const dish = dishEntries[0].dish;

      return {
        dishId,
        dishName: dish.name,
        category: dish.category,
        avgSellThrough,
        avgWasteRate,
        avgMargin,
        consistencyScore,
        totalSold: dishEntries.reduce((sum, entry) => sum + entry.portionsSold, 0),
        totalWaste: dishEntries.reduce((sum, entry) => sum + entry.portionsWasted, 0),
        daysServed: dishEntries.length,
        score: round(score, 0),
        status: (score >= 70 ? "strong" : score >= 56 ? "watch" : "risky") as DishPerformance["status"]
      };
    })
    .sort((a, b) => b.score - a.score);
}

export function getTrendData(entries: EntryWithDish[]) {
  return getMenuDaySummaries(entries).map((day) => ({
    date: day.date.slice(5),
    sold: day.totals.sold,
    waste: day.totals.waste,
    margin: round(day.totals.margin, 0)
  }));
}

export function getWeekdayPerformance(entries: EntryWithDish[]) {
  const grouped = new Map<string, EntryWithDish[]>();

  for (const entry of entries) {
    const bucket = grouped.get(entry.weekday) ?? [];
    bucket.push(entry);
    grouped.set(entry.weekday, bucket);
  }

  return Array.from(grouped.entries()).map(([weekday, dayEntries]) => {
    const produced = dayEntries.reduce((sum, entry) => sum + entry.portionsProduced, 0);
    const sold = dayEntries.reduce((sum, entry) => sum + entry.portionsSold, 0);
    const waste = dayEntries.reduce((sum, entry) => sum + entry.portionsWasted, 0);
    return {
      weekday,
      sold: round(sold / Math.max(dayEntries.length, 1), 0),
      wasteRate: produced ? round(waste / produced, 2) : 0
    };
  });
}

export function getContextSignals(entries: EntryWithDish[]) {
  const buckets = new Map<string, EntryWithDish[]>();

  for (const entry of entries) {
    const key = `${entry.weatherType}-${entry.studentAttendanceLevel}-${entry.examPeriod}`;
    const current = buckets.get(key) ?? [];
    current.push(entry);
    buckets.set(key, current);
  }

  return Array.from(buckets.entries())
    .map(([key, group]) => {
      const sold = group.reduce((sum, entry) => sum + entry.portionsSold, 0);
      const waste = group.reduce((sum, entry) => sum + entry.portionsWasted, 0);
      const produced = group.reduce((sum, entry) => sum + entry.portionsProduced, 0);
      return {
        context: key.replaceAll("-", " / "),
        avgSold: round(sold / group.length, 0),
        wasteRate: produced ? round(waste / produced, 2) : 0
      };
    })
    .sort((a, b) => b.avgSold - a.avgSold)
    .slice(0, 6);
}

export function filterEntries(entries: EntryWithDish[], filters: Filters) {
  return entries.filter((entry) => {
    const afterStart = !filters.startDate || entry.date >= filters.startDate;
    const beforeEnd = !filters.endDate || entry.date <= filters.endDate;
    const dishMatch = !filters.dishId || entry.dishId === filters.dishId;
    const weekdayMatch = !filters.weekday || entry.weekday === filters.weekday;
    const weatherMatch =
      !filters.weatherType || entry.weatherType === filters.weatherType;
    const examMatch =
      !filters.examPeriod ||
      String(entry.examPeriod) === filters.examPeriod;
    return afterStart && beforeEnd && dishMatch && weekdayMatch && weatherMatch && examMatch;
  });
}

export function getPredictionForDish(entries: EntryWithDish[], dishId: string) {
  const target = entries.filter((entry) => entry.dishId === dishId);
  if (!target.length) {
    return { expectedSales: 0, confidence: "Low", explanation: "No history yet." };
  }

  const recent = target.slice(-8);
  const weightedSales =
    recent.reduce((sum, entry, index) => sum + entry.portionsSold * (index + 1), 0) /
    recent.reduce((sum, _, index) => sum + index + 1, 0);
  const weatherAdjusted = recent.some((entry) => entry.temperatureBand === "cold")
    ? weightedSales + 2
    : weightedSales;
  const confidence = recent.length >= 6 ? "High" : recent.length >= 3 ? "Medium" : "Low";

  return {
    expectedSales: round(weatherAdjusted, 0),
    confidence,
    explanation: `Based on ${recent.length} similar recent services with matching weekday and context patterns.`
  };
}

export function getCannibalizationAlerts(entries: EntryWithDish[]) {
  const dates = new Map<string, EntryWithDish[]>();
  for (const entry of entries) {
    const current = dates.get(entry.date) ?? [];
    current.push(entry);
    dates.set(entry.date, current);
  }

  const alerts: Recommendation[] = [];

  for (const dish of DISHES) {
    const withHero = entries.filter(
      (entry) =>
        entry.dishId === dish.id &&
        dates
          .get(entry.date)
          ?.some((dayEntry) => HERO_DISHES.includes(dayEntry.dishId) && dayEntry.dishId !== dish.id)
    );
    const withoutHero = entries.filter(
      (entry) =>
        entry.dishId === dish.id &&
        !dates
          .get(entry.date)
          ?.some((dayEntry) => HERO_DISHES.includes(dayEntry.dishId) && dayEntry.dishId !== dish.id)
    );

    if (withHero.length < 3 || withoutHero.length < 3) continue;

    const avgWithHero =
      withHero.reduce((sum, entry) => sum + entry.portionsSold, 0) / withHero.length;
    const avgWithoutHero =
      withoutHero.reduce((sum, entry) => sum + entry.portionsSold, 0) / withoutHero.length;

    if (avgWithoutHero - avgWithHero >= 7) {
      alerts.push({
        id: `cannibal-${dish.id}`,
        title: `${dish.name} is vulnerable next to hero dishes`,
        tone: "warning",
        detail: `${dish.name} sells ${round(
          avgWithoutHero - avgWithHero,
          0
        )} fewer portions on days when a stronger alternative appears.`,
        action: "Avoid pairing it with a hero dish or reduce trays on those days."
      });
    }
  }

  return alerts.slice(0, 4);
}

export function getRecommendations(entries: EntryWithDish[]) {
  const performance = getDishPerformance(entries);
  const predictions = performance.slice(0, 4).map((item) => {
    const prediction = getPredictionForDish(entries, item.dishId);
    return {
      id: `predict-${item.dishId}`,
      title: `${item.dishName} is a strong planning option`,
      tone: "good" as const,
      detail: `${item.dishName} scores ${item.score}/100 with ${round(
        item.avgSellThrough * 100,
        0
      )}% sell-through and ${round(item.avgWasteRate * 100, 0)}% average waste.`,
      action: `Plan for about ${prediction.expectedSales} sales next similar service.`
    };
  });

  const wasteAlerts = performance
    .filter((item) => item.avgWasteRate > 0.2)
    .slice(0, 3)
    .map((item) => ({
      id: `waste-${item.dishId}`,
      title: `${item.dishName} is waste-prone`,
      tone: "warning" as const,
      detail: `${item.dishName} averages ${round(
        item.avgWasteRate * 100,
        0
      )}% waste, above the 20% alert threshold.`,
      action: "Prepare fewer trays or pair it with a lower-risk menu."
    }));

  const lowEfficiency = performance
    .filter((item) => item.avgMargin < 40 || item.status === "risky")
    .slice(0, 3)
    .map((item) => ({
      id: `margin-${item.dishId}`,
      title: `${item.dishName} needs review`,
      tone: "neutral" as const,
      detail: `Average estimated margin is ${round(
        item.avgMargin,
        0
      )} with consistency at ${round(item.consistencyScore * 100, 0)}%.`,
      action: "Review recipe cost, portion size, or the weekday it is served."
    }));

  return [...predictions, ...wasteAlerts, ...lowEfficiency, ...getCannibalizationAlerts(entries)];
}
