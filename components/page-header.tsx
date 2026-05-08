"use client";

import { useCanteenStore } from "@/lib/storage";

const copy: Record<string, Record<"English" | "Portuguese", string>> = {
  "Operation Zone": { English: "Operation Zone", Portuguese: "Zona Operacional" },
  "Data Analytics Zone": { English: "Data Analytics Zone", Portuguese: "Zona de Analise de Dados" },
  Dashboard: { English: "Dashboard", Portuguese: "Painel" },
  DailyItemLab: { English: "DailyItemLab", Portuguese: "Laboratorio Diario" },
  History: { English: "History", Portuguese: "Historico" },
  Insight: { English: "Insight", Portuguese: "Analise" },
  "Build the Day 1-5 weekly plan by food category. The chosen dishes become the data source for DailyItemLab without duplicating the planning UI.": {
    English:
      "Build the Day 1-5 weekly plan by food category. The chosen dishes become the data source for DailyItemLab without duplicating the planning UI.",
    Portuguese:
      "Construa o plano semanal do Dia 1 ao Dia 5 por categoria. Os pratos escolhidos alimentam o Laboratorio Diario sem duplicar o painel de planeamento."
  },
  "Prepare the selected Dashboard day with recipes, suppliers, forecasts, two-day purchasing logic, and digital variance notes.": {
    English:
      "Prepare the selected Dashboard day with recipes, suppliers, forecasts, two-day purchasing logic, and digital variance notes.",
    Portuguese:
      "Prepare o dia selecionado com receitas, fornecedores, previsoes, compras com dois dias de antecedencia e desvios estruturados."
  },
  "Store and review operational history: people, sales, revenue, P.O. trends per dish, overtime impact, and dish type performance.": {
    English:
      "Store and review operational history: people, sales, revenue, P.O. trends per dish, overtime impact, and dish type performance.",
    Portuguese:
      "Guarde e analise o historico operacional: pessoas, vendas, receita, tendencias de encomendas por prato, impacto de horas extra e desempenho por tipo de prato."
  },
  "Compare costs, revenue, purchase order values, and unit pricing through the required analysis modules.": {
    English: "Compare costs, revenue, purchase order values, and unit pricing through the required analysis modules.",
    Portuguese: "Compare custos, receita, valores de encomenda e preco unitario nos modulos de analise."
  }
};

function translate(value: string, language: "English" | "Portuguese") {
  return copy[value]?.[language] ?? value;
}

export function PageHeader({
  title,
  description
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  const language = useCanteenStore((state) => state.language);

  return (
    <div className="mb-5">
      <h2 className="text-2xl font-semibold tracking-tight">{translate(title, language)}</h2>
    </div>
  );
}
