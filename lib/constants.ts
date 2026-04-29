import { FoodCategory, Recipe, Supplier } from "@/lib/types";

export const DAYS = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"] as const;

export const FOOD_CATEGORIES: FoodCategory[] = [
  "Meat/Fish",
  "Vegetarian",
  "Nomad",
  "Soup",
  "Salads",
  "Dessert",
  "Fruit"
];

export const CATEGORY_RULES: Partial<Record<FoodCategory, number>> = {
  Salads: 2,
  Dessert: 4
};

export const PORTUGUESE_TO_ENGLISH: Record<string, FoodCategory> = {
  Sopa: "Soup",
  Prato: "Meat/Fish",
  Vegetariano: "Vegetarian",
  "Nómada": "Nomad",
  Salada: "Salads",
  FRUTA: "Fruit",
  Sobremesa: "Dessert"
};

export const CURRENT_PROCESS_TERMS = [
  ["Previsão", "Forecast"],
  ["Refeição Social", "Social Meal"],
  ["Senhas / Palops", "Meal Vouchers / PALOPs"],
  ["Total da Linha", "Line Total"],
  ["Colaboradores", "Staff"],
  ["Total do Dia", "Daily Total"],
  ["Massa / Nómada", "Pasta / Nomad"],
  ["Pizzas / Saladas", "Pizzas / Salads"]
] as const;

export const RED_PEN_MEANING = [
  "difference between forecast and actual production",
  "percentage variance",
  "manual adjustment notes",
  "corrections to quantities",
  "observations for future planning"
];

export const PURCHASE_SCHEDULE = [
  {
    purchaseDay: "Friday",
    coversFoodFor: ["Monday", "Tuesday"]
  },
  {
    purchaseDay: "Monday",
    coversFoodFor: ["Wednesday", "Thursday"]
  }
] as const;

export const SUPPLIERS: Supplier[] = [
  {
    id: "atlantic-protein",
    name: "Atlantic Protein",
    leadTimeDays: 2,
    orderContact: "orders@atlantic-protein.pt",
    categories: ["Meat/Fish", "Nomad"]
  },
  {
    id: "cascais-produce",
    name: "Cascais Produce",
    leadTimeDays: 2,
    orderContact: "produce@cascais.pt",
    categories: ["Vegetarian", "Soup", "Salads", "Fruit"]
  },
  {
    id: "nova-bakery",
    name: "NOVA Bakery & Sweets",
    leadTimeDays: 2,
    orderContact: "pastry@nova.local",
    categories: ["Dessert"]
  }
];

export const RECIPES: Recipe[] = [
  {
    id: "cod-rice",
    name: "Codfish with tomato rice",
    portugueseName: "Pescada com arroz de tomate",
    category: "Meat/Fish",
    sellingPricePerPortion: 4.5,
    prepNotes: "Compatible with the paper Prato line.",
    active: true,
    ingredients: [
      { name: "codfish", quantityPerPortion: 0.16, unit: "kg", supplierId: "atlantic-protein", unitCost: 8.8 },
      { name: "rice", quantityPerPortion: 0.09, unit: "kg", supplierId: "cascais-produce", unitCost: 1.4 }
    ]
  },
  {
    id: "chicken-mushroom",
    name: "Chicken steak with mushroom sauce",
    portugueseName: "Bife de frango com molho de cogumelos",
    category: "Meat/Fish",
    sellingPricePerPortion: 4.5,
    prepNotes: "High familiarity main dish.",
    active: true,
    ingredients: [
      { name: "chicken", quantityPerPortion: 0.18, unit: "kg", supplierId: "atlantic-protein", unitCost: 5.4 },
      { name: "mushrooms", quantityPerPortion: 0.05, unit: "kg", supplierId: "cascais-produce", unitCost: 3.8 }
    ]
  },
  {
    id: "chickpea-stew",
    name: "Chickpea stew with white rice",
    portugueseName: "Estufado de grão com arroz branco",
    category: "Vegetarian",
    sellingPricePerPortion: 4,
    prepNotes: "Vegetariano line; strong batch-prep candidate.",
    active: true,
    ingredients: [
      { name: "chickpeas", quantityPerPortion: 0.12, unit: "kg", supplierId: "cascais-produce", unitCost: 2.1 },
      { name: "rice", quantityPerPortion: 0.08, unit: "kg", supplierId: "cascais-produce", unitCost: 1.4 }
    ]
  },
  {
    id: "goat-cheese-puff",
    name: "Goat cheese puff with wild rice salad",
    portugueseName: "Folhado de queijo de cabra com salada de arroz selvagem",
    category: "Vegetarian",
    sellingPricePerPortion: 4.2,
    prepNotes: "Higher-cost vegetarian option.",
    active: true,
    ingredients: [
      { name: "goat cheese", quantityPerPortion: 0.06, unit: "kg", supplierId: "cascais-produce", unitCost: 9.5 },
      { name: "puff pastry", quantityPerPortion: 0.08, unit: "kg", supplierId: "nova-bakery", unitCost: 4.2 }
    ]
  },
  {
    id: "beef-bourguignon",
    name: "Beef bourguignon with rustic mash",
    portugueseName: "Bourguignon de novilho com puré rústico",
    category: "Nomad",
    sellingPricePerPortion: 5.2,
    prepNotes: "Nomad premium dish; watch cannibalisation.",
    active: true,
    ingredients: [
      { name: "beef", quantityPerPortion: 0.18, unit: "kg", supplierId: "atlantic-protein", unitCost: 10.2 },
      { name: "potatoes", quantityPerPortion: 0.16, unit: "kg", supplierId: "cascais-produce", unitCost: 1.2 }
    ]
  },
  {
    id: "salmon-passion",
    name: "Salmon with passion fruit sauce",
    portugueseName: "Salmão com molho de maracujá",
    category: "Nomad",
    sellingPricePerPortion: 5.5,
    prepNotes: "Premium forecast-sensitive item.",
    active: true,
    ingredients: [
      { name: "salmon", quantityPerPortion: 0.17, unit: "kg", supplierId: "atlantic-protein", unitCost: 12.5 },
      { name: "broccoli", quantityPerPortion: 0.08, unit: "kg", supplierId: "cascais-produce", unitCost: 2.6 }
    ]
  },
  {
    id: "vegetable-soup",
    name: "Vegetable soup",
    portugueseName: "Sopa de legumes",
    category: "Soup",
    sellingPricePerPortion: 1.2,
    prepNotes: "Sopa line; weather-sensitive demand.",
    active: true,
    ingredients: [
      { name: "mixed vegetables", quantityPerPortion: 0.12, unit: "kg", supplierId: "cascais-produce", unitCost: 1.7 }
    ]
  },
  {
    id: "caldo-verde",
    name: "Caldo verde",
    portugueseName: "Caldo verde",
    category: "Soup",
    sellingPricePerPortion: 1.3,
    prepNotes: "Portuguese standard; performs better on colder days.",
    active: true,
    ingredients: [
      { name: "kale", quantityPerPortion: 0.05, unit: "kg", supplierId: "cascais-produce", unitCost: 2.3 },
      { name: "potatoes", quantityPerPortion: 0.1, unit: "kg", supplierId: "cascais-produce", unitCost: 1.2 }
    ]
  },
  {
    id: "green-salad",
    name: "Green salad",
    portugueseName: "Salada verde",
    category: "Salads",
    sellingPricePerPortion: 2.2,
    prepNotes: "One of two required salad slots.",
    active: true,
    ingredients: [
      { name: "lettuce", quantityPerPortion: 0.08, unit: "kg", supplierId: "cascais-produce", unitCost: 2.5 }
    ]
  },
  {
    id: "pasta-salad",
    name: "Pasta salad",
    portugueseName: "Salada de massa",
    category: "Salads",
    sellingPricePerPortion: 2.6,
    prepNotes: "Maps to Pizzas / Saladas paper line.",
    active: true,
    ingredients: [
      { name: "pasta", quantityPerPortion: 0.09, unit: "kg", supplierId: "cascais-produce", unitCost: 1.8 }
    ]
  },
  {
    id: "rice-pudding",
    name: "Rice pudding",
    portugueseName: "Arroz doce",
    category: "Dessert",
    sellingPricePerPortion: 1.6,
    prepNotes: "One of four dessert slots.",
    active: true,
    ingredients: [
      { name: "milk", quantityPerPortion: 0.12, unit: "l", supplierId: "nova-bakery", unitCost: 0.9 }
    ]
  },
  {
    id: "chocolate-mousse",
    name: "Chocolate mousse",
    portugueseName: "Mousse de chocolate",
    category: "Dessert",
    sellingPricePerPortion: 1.8,
    prepNotes: "One of four dessert slots.",
    active: true,
    ingredients: [
      { name: "chocolate", quantityPerPortion: 0.04, unit: "kg", supplierId: "nova-bakery", unitCost: 6.4 }
    ]
  },
  {
    id: "apple",
    name: "Apple",
    portugueseName: "Maçã",
    category: "Fruit",
    sellingPricePerPortion: 0.9,
    prepNotes: "FRUTA paper line.",
    active: true,
    ingredients: [
      { name: "apple", quantityPerPortion: 1, unit: "unit", supplierId: "cascais-produce", unitCost: 0.28 }
    ]
  }
];
