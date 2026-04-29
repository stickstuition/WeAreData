"use client";

import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import {
  CURRENT_PROCESS_TERMS,
  DAYS,
  FOOD_CATEGORIES,
  PORTUGUESE_TO_ENGLISH,
  PURCHASE_SCHEDULE,
  RECIPES,
  RED_PEN_MEANING
} from "@/lib/constants";
import {
  aggregateHistory,
  getAutoForecast,
  getCategoryRuleIssues,
  getDailyPurchaseNeeds,
  getDishTypePerformance,
  getDuplicateDishIds,
  getPurchaseScheduleRows,
  getRecipe,
  getRecipeCost,
  getSelectedRecipesForDay,
  getVarianceRows,
  getWeatherImpact,
  recipesByCategory,
  round
} from "@/lib/analytics";
import { useCanteenStore } from "@/lib/storage";
import { FoodCategory, WeatherForecastDay } from "@/lib/types";
import { formatCurrency, formatPercent } from "@/lib/utils";

import { SectionCard } from "./section-card";
import { StatusPill } from "./status-pill";

function useAppData() {
  const hydrate = useCanteenStore((state) => state.hydrate);
  const hydrated = useCanteenStore((state) => state.hydrated);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return hydrated;
}

function label(language: string, english: string, portuguese: string) {
  return language === "Portuguese" ? portuguese : english;
}

const ui: Record<string, string> = {
  "Loading dashboard...": "A carregar painel...",
  "Weekly Plan": "Plano Semanal",
  "Plan Day 1-5 by food category. Salads has 2 item slots and Dessert has 4; every selected dish feeds DailyItemLab as state.": "Planeie o Dia 1 ao Dia 5 por categoria. Saladas tem 2 itens e Sobremesa tem 4; cada prato alimenta o Laboratorio Diario como dados.",
  "Optimal Meal Prep": "Preparacao Otima",
  "Category rules": "Regras de categoria",
  "enforced": "aplicadas",
  "Needs correction": "Precisa de correcao",
  "Weather calendar": "Calendario meteorologico",
  "Forecast loaded": "Previsao carregada",
  "Using planning assumptions": "A usar pressupostos de planeamento",
  Category: "Categoria",
  "Planning Controls": "Controlos de Planeamento",
  "Historical demand, weather, and anti-cannibalisation update the weekly plan in one click.": "Procura historica, meteorologia e anti-canibalizacao atualizam o plano semanal num clique.",
  "No duplicate dishes": "Sem pratos duplicados",
  "Dashboard feeds DailyItemLab": "Painel alimenta o Laboratorio Diario",
  "Loading DailyItemLab...": "A carregar Laboratorio Diario...",
  "Production Planning": "Planeamento de Producao",
  Forecast: "Previsao",
  "Auto forecast": "Previsao automatica",
  "Actual sold": "Vendido real",
  "Unit cost": "Custo unitario",
  "Ingredients": "Ingredientes",
  "Correction type": "Tipo de correcao",
  "Variance note": "Nota de desvio",
  "Supplier Purchasing Logic": "Logica de Compras a Fornecedores",
  "Purchases are planned two days before the covered food service.": "As compras sao planeadas dois dias antes do servico alimentar coberto.",
  "Current Day Purchase Lines": "Linhas de Compra do Dia",
  "Ingredient suggestions": "Sugestoes de ingredientes",
  "Structured Variance": "Desvio Estruturado",
  "Loading history...": "A carregar historico...",
  sales: "vendas",
  revenue: "receita",
  "Aggregated Sales and Revenue": "Vendas e Receita Agregadas",
  "Derived Analysis": "Analise Derivada",
  "Daily Production Sheet Terms": "Termos da Folha de Producao Diaria",
  "Loading insight...": "A carregar analise...",
  "Cost vs Revenue Analysis": "Analise de Custo vs Receita",
  "P.O. Analysis vs Revenue": "Analise de Encomendas vs Receita",
  "Unitary Price Analysis": "Analise de Preco Unitario",
  "Financial Comparison": "Comparacao Financeira",
  "Purchase Schedule Reference": "Referencia do Calendario de Compras",
  "buy more": "comprar mais",
  "buy less": "comprar menos",
  hold: "manter",
  none: "nenhuma",
  "quantity correction": "correcao de quantidade",
  "forecast miss": "falha de previsao",
  "operational note": "nota operacional"
};

const categoryPt: Record<FoodCategory, string> = {
  "Meat/Fish": "Carne/Peixe",
  Vegetarian: "Vegetariano",
  Nomad: "Nomada",
  Soup: "Sopa",
  Salads: "Saladas",
  Dessert: "Sobremesa",
  Fruit: "Fruta"
};

function t(language: string, text: string) {
  return language === "Portuguese" ? ui[text] ?? text : text;
}

function categoryLabel(language: string, category: FoodCategory) {
  return language === "Portuguese" ? categoryPt[category] : category;
}

function RecipeSelect({
  day,
  category,
  slotIndex,
  value,
  duplicate,
  language
}: {
  day: string;
  category: FoodCategory;
  slotIndex: number;
  value: string;
  duplicate: boolean;
  language: string;
}) {
  const updatePlanSlot = useCanteenStore((state) => state.updatePlanSlot);
  const weeklyPlan = useCanteenStore((state) => state.weeklyPlan);
  const usedThisWeek = useMemo(
    () => Object.values(weeklyPlan).flatMap((row) => Object.values(row).flat()),
    [weeklyPlan]
  );
  const pool = recipesByCategory(category);

  return (
    <select
      value={value}
      onChange={(event) => updatePlanSlot(day, category, slotIndex, event.target.value)}
      className={`w-full rounded-md border bg-white px-2 py-2 text-sm ${duplicate ? "border-coral" : "border-slate-200"}`}
    >
      {pool.map((recipe) => (
        <option key={recipe.id} value={recipe.id} disabled={usedThisWeek.includes(recipe.id) && recipe.id !== value}>
          {language === "Portuguese" ? recipe.portugueseName : recipe.name}
        </option>
      ))}
    </select>
  );
}

export function DashboardClientPage() {
  const hydrated = useAppData();
  const language = useCanteenStore((state) => state.language);
  const weeklyPlan = useCanteenStore((state) => state.weeklyPlan);
  const selectedDay = useCanteenStore((state) => state.selectedDay);
  const setSelectedDay = useCanteenStore((state) => state.setSelectedDay);
  const optimizePlan = useCanteenStore((state) => state.optimizePlan);
  const history = useCanteenStore((state) => state.history);
  const duplicates = useMemo(() => getDuplicateDishIds(weeklyPlan), [weeklyPlan]);
  const ruleIssues = useMemo(() => getCategoryRuleIssues(weeklyPlan), [weeklyPlan]);
  const [forecast, setForecast] = useState<WeatherForecastDay[]>([]);
  const [weatherStatus, setWeatherStatus] = useState("Using planning assumptions");

  useEffect(() => {
    let active = true;
    fetch("/api/weather")
      .then((response) => response.json())
      .then((data) => {
        if (!active) return;
        if (Array.isArray(data.forecast) && data.forecast.length) {
          setForecast(data.forecast);
          setWeatherStatus("Forecast loaded");
        } else {
          setWeatherStatus("Using planning assumptions");
        }
      })
      .catch(() => {
        if (active) setWeatherStatus("Using planning assumptions");
      });
    return () => {
      active = false;
    };
  }, []);

  if (!hydrated) return <div className="text-sm text-slate">{t(language, "Loading dashboard...")}</div>;

  return (
    <div className="space-y-5">
      <SectionCard
        title={t(language, "Weekly Plan")}
        subtitle={t(language, "Plan Day 1-5 by food category. Salads has 2 item slots and Dessert has 4; every selected dish feeds DailyItemLab as state.")}
      >
        <div className="mb-4 grid gap-3 md:grid-cols-4">
          <div className="rounded-lg bg-mist px-4 py-3 text-sm">
            <div className="font-medium">{t(language, "Category rules")}</div>
            <div className="text-slate">{ruleIssues.length ? t(language, "Needs correction") : t(language, "enforced")}</div>
          </div>
          <div className="rounded-lg bg-mist px-4 py-3 text-sm">
            <div className="font-medium">{t(language, "No duplicate dishes")}</div>
            <div className="text-slate">{duplicates.length ? t(language, "Needs correction") : t(language, "enforced")}</div>
          </div>
          <div className="rounded-lg bg-mist px-4 py-3 text-sm">
            <div className="font-medium">{t(language, "Weather calendar")}</div>
            <div className="text-slate">{t(language, weatherStatus)}</div>
          </div>
          <button
            type="button"
            onClick={() => optimizePlan(forecast)}
            className="rounded-lg bg-ink px-4 py-3 text-left text-sm font-semibold text-white shadow-soft transition hover:opacity-90"
          >
            {t(language, "Optimal Meal Prep")}
            <span className="mt-1 block text-xs font-normal opacity-80">
              {t(language, "Historical demand, weather, and anti-cannibalisation update the weekly plan in one click.")}
            </span>
          </button>
        </div>

        <div className="mb-4 grid gap-3 md:grid-cols-5">
          {DAYS.map((day, index) => {
            const weather = forecast[index];
            const dayRecipes = getSelectedRecipesForDay(weeklyPlan, day);
            const impact = dayRecipes
              .map((recipe) => getWeatherImpact(recipe, weather))
              .filter((item) => item.multiplier !== 1)[0];
            return (
              <button
                key={day}
                type="button"
                onClick={() => setSelectedDay(day)}
                className={`rounded-lg border px-3 py-3 text-left text-sm ${
                  selectedDay === day ? "border-ink bg-ink text-white" : "border-slate-200 bg-white"
                }`}
              >
                <div className="font-semibold">{day}</div>
                <div className="text-xs opacity-80">
                  {weather ? `${weather.maxTemperatureC}C · ${weather.condition}` : t(language, "Using planning assumptions")}
                </div>
                <div className="mt-1 text-xs opacity-80">{impact?.reason ?? "normal weather"}</div>
              </button>
            );
          })}
        </div>

        <div className="mb-4 rounded-lg bg-mist px-4 py-3 text-sm">
          <div className="font-medium">{t(language, "Planning Controls")}</div>
          <div className="text-slate">{t(language, "Dashboard feeds DailyItemLab")}</div>
          </div>

        <div className="overflow-x-auto">
          <table className="min-w-[980px] border-separate border-spacing-0 text-left text-sm">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 bg-white p-2 font-semibold">{t(language, "Category")}</th>
                {DAYS.map((day, index) => (
                  <th key={day} className="p-2 font-semibold">
                    <button
                      type="button"
                      onClick={() => setSelectedDay(day)}
                      className={`w-full rounded-md px-3 py-2 text-left ${selectedDay === day ? "bg-ink text-white" : "bg-mist"}`}
                    >
                      {day}
                      {forecast[index]?.maxTemperatureC ? (
                        <span className="block text-xs opacity-75">{forecast[index].maxTemperatureC}C</span>
                      ) : null}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FOOD_CATEGORIES.map((category) => (
                <tr key={category}>
                  <td className="sticky left-0 z-10 border-t border-slate-100 bg-white p-2 font-medium">{categoryLabel(language, category)}</td>
                  {DAYS.map((day) => (
                    <td key={`${day}-${category}`} className="border-t border-slate-100 p-2 align-top">
                      <div className="space-y-2">
                        {weeklyPlan[day][category].map((recipeId, index) => (
                          <RecipeSelect
                            key={`${day}-${category}-${index}`}
                            day={day}
                            category={category}
                            slotIndex={index}
                            value={recipeId}
                            duplicate={duplicates.includes(recipeId)}
                            language={language}
                          />
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard title={label(language, "Paper Workflow Terms", "Termos do Processo em Papel")}>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {Object.entries(PORTUGUESE_TO_ENGLISH).map(([pt, en]) => (
            <div key={pt} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
              <div className="font-medium">{pt}</div>
              <div className="text-slate">{en}</div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

export function DailyItemLabClientPage() {
  const hydrated = useAppData();
  const language = useCanteenStore((state) => state.language);
  const weeklyPlan = useCanteenStore((state) => state.weeklyPlan);
  const selectedDay = useCanteenStore((state) => state.selectedDay);
  const forecasts = useCanteenStore((state) => state.forecasts);
  const history = useCanteenStore((state) => state.history);
  const updateForecast = useCanteenStore((state) => state.updateForecast);
  const [weatherForecast, setWeatherForecast] = useState<WeatherForecastDay[]>([]);
  const selectedWeather = weatherForecast[DAYS.indexOf(selectedDay as (typeof DAYS)[number])];
  const selectedRecipes = useMemo(() => getSelectedRecipesForDay(weeklyPlan, selectedDay), [weeklyPlan, selectedDay]);
  const varianceRows = useMemo(
    () => getVarianceRows(weeklyPlan, forecasts, selectedDay, history, selectedWeather),
    [weeklyPlan, forecasts, selectedDay, history, selectedWeather]
  );
  const purchaseNeeds = useMemo(
    () => getDailyPurchaseNeeds(weeklyPlan, forecasts, selectedDay, history, selectedWeather),
    [weeklyPlan, forecasts, selectedDay, history, selectedWeather]
  );
  const purchaseRows = useMemo(
    () => getPurchaseScheduleRows(weeklyPlan, forecasts, history, weatherForecast),
    [weeklyPlan, forecasts, history, weatherForecast]
  );

  useEffect(() => {
    let active = true;
    fetch("/api/weather")
      .then((response) => response.json())
      .then((data) => {
        if (active && Array.isArray(data.forecast)) setWeatherForecast(data.forecast);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  if (!hydrated) return <div className="text-sm text-slate">{t(language, "Loading DailyItemLab...")}</div>;

  return (
    <div className="space-y-5">
      <SectionCard
        title={`${t(language, "Production Planning")}: ${selectedDay}`}
      >
        <div className="grid gap-3 lg:grid-cols-2">
          {selectedRecipes.map((recipe) => {
            const forecast = forecasts.find((item) => item.day === selectedDay && item.recipeId === recipe.id);
            const auto = getAutoForecast(recipe, selectedDay, history, forecasts, selectedWeather);
            const manual = forecast?.manualForecast ?? forecast?.forecastPortions ?? auto.value;
            const actual = forecast?.actualSold ?? 0;
            const variance = actual ? (actual - manual) / Math.max(manual, 1) : 0;
            const ingredients = recipe.ingredients.map((ingredient) => ({
              ...ingredient,
              required: round(ingredient.quantityPerPortion * manual, 2),
              cost: round(ingredient.quantityPerPortion * manual * ingredient.unitCost, 2)
            }));

            return (
              <div key={recipe.id} className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-medium uppercase text-slate">{categoryLabel(language, recipe.category)}</div>
                    <div className="font-semibold">{language === "Portuguese" ? recipe.portugueseName : recipe.name}</div>
                    <div className="text-sm text-slate">{auto.phase}: {auto.explanation}</div>
                  </div>
                  <StatusPill tone={variance < -0.1 ? "warning" : "neutral"}>{actual ? formatPercent(variance) : "Manual"}</StatusPill>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <label className="text-sm">
                    <div className="mb-1 font-medium">{t(language, "Forecast")}</div>
                    <input
                      type="number"
                      min={0}
                      value={manual}
                      onChange={(event) =>
                        updateForecast(selectedDay, recipe.id, {
                          manualForecast: Number(event.target.value),
                          forecastPortions: Number(event.target.value)
                        })
                      }
                      className="w-full rounded-md border border-slate-200 px-3 py-2"
                    />
                  </label>
                  <label className="text-sm">
                    <div className="mb-1 font-medium">{t(language, "Actual sold")}</div>
                    <input
                      type="number"
                      min={0}
                      value={actual}
                      onChange={(event) => updateForecast(selectedDay, recipe.id, { actualSold: Number(event.target.value) })}
                      className="w-full rounded-md border border-slate-200 px-3 py-2"
                    />
                  </label>
                  <div className="rounded-md bg-mist px-3 py-2 text-sm">
                    <div className="font-medium">{t(language, "Auto forecast")}</div>
                    <div>{auto.value}</div>
                  </div>
                </div>
                <div className="mt-3 rounded-md bg-mist px-3 py-2 text-sm">
                  <div className="font-medium">{t(language, "Ingredients")}</div>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    {ingredients.map((ingredient) => (
                      <div key={ingredient.name} className="rounded-md bg-white px-2 py-2">
                        <div className="font-medium">{ingredient.name}</div>
                        <div className="text-slate">{ingredient.required} {ingredient.unit} - {formatCurrency(ingredient.cost)}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 text-slate">{t(language, "Unit cost")}: {formatCurrency(getRecipeCost(recipe))}</div>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <label className="text-sm">
                    <div className="mb-1 font-medium">{t(language, "Correction type")}</div>
                    <select
                      value={forecast?.correctionType ?? "none"}
                      onChange={(event) => updateForecast(selectedDay, recipe.id, { correctionType: event.target.value as any })}
                      className="w-full rounded-md border border-slate-200 px-3 py-2"
                    >
                      {["none", "quantity correction", "forecast miss", "operational note"].map((item) => (
                        <option key={item} value={item}>{t(language, item)}</option>
                      ))}
                    </select>
                  </label>
                  <label className="text-sm">
                    <div className="mb-1 font-medium">{t(language, "Variance note")}</div>
                    <input
                      value={forecast?.varianceNote ?? ""}
                      onChange={(event) => updateForecast(selectedDay, recipe.id, { varianceNote: event.target.value })}
                      className="w-full rounded-md border border-slate-200 px-3 py-2"
                    />
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>

      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <SectionCard title={t(language, "Supplier Purchasing Logic")} subtitle={t(language, "Purchases are planned two days before the covered food service.")}>
          <div className="space-y-3">
            {purchaseRows.map((row) => (
              <div key={row.purchaseDay} className="rounded-lg bg-mist px-4 py-3 text-sm">
                <div className="font-semibold">{row.purchaseDay} purchase &rarr; {row.calendarDays}</div>
                <div className="text-slate">{row.lineCount} {t(language, "Ingredient suggestions")} - {row.suppliers.join(", ") || "suppliers"}</div>
                <div className="mt-1 font-medium">{formatCurrency(row.estimatedPO)} estimated P.O.</div>
                <div className="mt-2 grid gap-2 md:grid-cols-2">
                  {row.aggregated.slice(0, 4).map((item) => (
                    <div key={`${row.purchaseDay}-${item.ingredient}`} className="rounded-md bg-white px-2 py-2">
                      <div className="font-medium">{item.ingredient}</div>
                      <div className="text-slate">{item.suggestedQuantity} {item.unit} - {t(language, item.suggestion)}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
        <SectionCard title={t(language, "Current Day Purchase Lines")}>
          <div className="max-h-80 space-y-2 overflow-auto pr-1">
            {purchaseNeeds.map((need) => (
              <div key={`${need.recipe.id}-${need.ingredient.name}`} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
                <div className="font-medium">{need.ingredient.name}</div>
                <div className="text-slate">
                  {need.suggestedQuantity} {need.ingredient.unit} for {language === "Portuguese" ? need.recipe.portugueseName : need.recipe.name}
                </div>
                <div className="text-slate">{need.supplier?.name} · {formatCurrency(need.estimatedCost)}</div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title={t(language, "Structured Variance")}>
        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
          {varianceRows.map((row) => (
            <div key={row.recipe.id} className="rounded-lg bg-mist px-3 py-2 text-sm">
              <div className="font-medium">{language === "Portuguese" ? row.recipe.portugueseName : row.recipe.name}</div>
              <div className="text-slate">{t(language, "Forecast")}: {row.planned} - {t(language, "Actual sold")}: {row.actual || "-"}</div>
              <div className="text-slate">{row.actual ? formatPercent(row.varianceRate) : "0%"}</div>
              <div className="text-slate">{t(language, row.correctionType)}</div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

export function HistoryClientPage() {
  const hydrated = useAppData();
  const language = useCanteenStore((state) => state.language);
  const history = useCanteenStore((state) => state.history);
  const byDish = useMemo(() => aggregateHistory(history, "dish"), [history]);
  const byDay = useMemo(() => aggregateHistory(history, "day"), [history]);
  const byMonth = useMemo(() => aggregateHistory(history, "month"), [history]);
  const typePerformance = useMemo(() => getDishTypePerformance(history), [history]);

  if (!hydrated) return <div className="text-sm text-slate">{t(language, "Loading history...")}</div>;

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-3">
        <TrendTable title="# of people" rows={byDay.map((row) => ({ label: row.label, value: row.people }))} language={language} />
        <TrendTable title={t(language, "sales")} rows={byDish.map((row) => ({ label: row.label, value: row.sales }))} language={language} />
        <TrendTable title={t(language, "revenue")} rows={byMonth.map((row) => ({ label: row.label, value: formatCurrency(row.revenue) }))} language={language} />
      </div>

      <SectionCard title={t(language, "Aggregated Sales and Revenue")}>
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byDish.slice(0, 8)}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" tick={false} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#11243D" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {typePerformance.map((row) => (
              <div key={row.category} className="rounded-lg bg-mist px-4 py-3 text-sm">
                <div className="font-medium">{row.category} performance</div>
                <div className="text-slate">
                  Sales {row.sales} · Revenue {formatCurrency(row.revenue)} · P.O. {formatCurrency(row.poValue)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      <SectionCard title={t(language, "Derived Analysis")}>
        <div className="grid gap-3 md:grid-cols-3">
          {byDish.slice(0, 6).map((row) => (
            <div key={row.label} className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm">
              <div className="font-medium">{row.label}</div>
              <div className="text-slate">Overtime {row.overtimeHours}h · P.O. {formatCurrency(row.poValue)}</div>
              <div className="text-slate">Revenue {formatCurrency(row.revenue)}</div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title={t(language, "Daily Production Sheet Terms")}>
        <div className="grid gap-2 md:grid-cols-4">
          {CURRENT_PROCESS_TERMS.map(([pt, en]) => (
            <div key={pt} className="rounded-lg bg-mist px-3 py-2 text-sm">
              <div className="font-medium">{pt}</div>
              <div className="text-slate">{en}</div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function TrendTable({ title, rows, language }: { title: string; rows: { label: string; value: string | number }[]; language: string }) {
  return (
    <SectionCard title={title} subtitle={label(language, "Trend table", "Tabela de tendencias")}>
      <div className="space-y-2">
        {rows.slice(0, 6).map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-3 rounded-lg bg-mist px-3 py-2 text-sm">
            <span className="truncate">{row.label}</span>
            <span className="font-semibold">{row.value}</span>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

export function InsightClientPage() {
  const hydrated = useAppData();
  const language = useCanteenStore((state) => state.language);
  const history = useCanteenStore((state) => state.history);
  const byDish = useMemo(() => aggregateHistory(history, "dish"), [history]);
  const insightRows = useMemo(
    () =>
      byDish.map((row) => ({
        ...row,
        margin: round(row.revenue - row.poValue, 2),
        poToRevenue: row.revenue ? round(row.poValue / row.revenue, 2) : 0,
        unitaryPrice: row.sales ? round(row.revenue / row.sales, 2) : 0
      })),
    [byDish]
  );

  if (!hydrated) return <div className="text-sm text-slate">{t(language, "Loading insight...")}</div>;

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-3">
        <SectionCard title={t(language, "Cost vs Revenue Analysis")}>
          <div className="space-y-2">
            {insightRows.slice(0, 6).map((row) => (
              <div key={row.label} className="rounded-lg bg-mist px-3 py-2 text-sm">
                <div className="font-medium">{row.label}</div>
                <div className="text-slate">Margin {formatCurrency(row.margin)}</div>
              </div>
            ))}
          </div>
        </SectionCard>
        <SectionCard title={t(language, "P.O. Analysis vs Revenue")}>
          <div className="space-y-2">
            {insightRows.slice(0, 6).map((row) => (
              <div key={row.label} className="rounded-lg bg-mist px-3 py-2 text-sm">
                <div className="font-medium">{row.label}</div>
                <div className="text-slate">P.O. ratio {formatPercent(row.poToRevenue)}</div>
              </div>
            ))}
          </div>
        </SectionCard>
        <SectionCard title={t(language, "Unitary Price Analysis")}>
          <div className="space-y-2">
            {insightRows.slice(0, 6).map((row) => (
              <div key={row.label} className="rounded-lg bg-mist px-3 py-2 text-sm">
                <div className="font-medium">{row.label}</div>
                <div className="text-slate">{formatCurrency(row.unitaryPrice)} / unit</div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title={t(language, "Financial Comparison")}>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={insightRows}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" tick={false} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#11243D" strokeWidth={3} />
              <Line type="monotone" dataKey="poValue" stroke="#F66B4E" strokeWidth={3} />
              <Line type="monotone" dataKey="margin" stroke="#6D9F71" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      <SectionCard title={t(language, "Purchase Schedule Reference")}>
        <div className="grid gap-3 md:grid-cols-2">
          {PURCHASE_SCHEDULE.map((item) => (
            <div key={item.purchaseDay} className="rounded-lg bg-mist px-4 py-3 text-sm">
              <div className="font-medium">{item.purchaseDay} purchase</div>
              <div className="text-slate">Covers food for {item.coversFoodFor.join(" and ")}</div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

export const InputClientPage = DailyItemLabClientPage;
export const InsightsClientPage = InsightClientPage;
export const PlannerClientPage = DashboardClientPage;
export const RecommendationsClientPage = InsightClientPage;
