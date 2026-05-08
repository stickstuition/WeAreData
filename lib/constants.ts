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
    id: "pumpkin-sweet-potato-soup",
    name: "Pumpkin and sweet potato soup",
    portugueseName: "Sopa de abóbora e batata-doce",
    category: "Soup",
    sellingPricePerPortion: 1.3,
    prepNotes: "Sopa line from the Mon Bistrot weekly menu.",
    active: true,
    ingredients: [
      { name: "pumpkin", quantityPerPortion: 0.09, unit: "kg", supplierId: "cascais-produce", unitCost: 1.6 },
      { name: "sweet potato", quantityPerPortion: 0.06, unit: "kg", supplierId: "cascais-produce", unitCost: 1.8 }
    ]
  },
  {
    id: "zucchini-coriander-soup",
    name: "Zucchini and coriander soup",
    portugueseName: "Sopa de curgete com coentros",
    category: "Soup",
    sellingPricePerPortion: 1.3,
    prepNotes: "Sopa line from the Mon Bistrot weekly menu.",
    active: true,
    ingredients: [
      { name: "zucchini", quantityPerPortion: 0.12, unit: "kg", supplierId: "cascais-produce", unitCost: 1.9 },
      { name: "coriander", quantityPerPortion: 0.01, unit: "kg", supplierId: "cascais-produce", unitCost: 6.5 }
    ]
  },
  {
    id: "leek-carrot-soup",
    name: "Leek and carrot soup",
    portugueseName: "Sopa de alho-francês e cenoura",
    category: "Soup",
    sellingPricePerPortion: 1.3,
    prepNotes: "Sopa line from the Mon Bistrot weekly menu.",
    active: true,
    ingredients: [
      { name: "leek", quantityPerPortion: 0.06, unit: "kg", supplierId: "cascais-produce", unitCost: 2.4 },
      { name: "carrot", quantityPerPortion: 0.08, unit: "kg", supplierId: "cascais-produce", unitCost: 1.1 }
    ]
  },
  {
    id: "beef-burger-mustard-pasta",
    name: "Beef burger with mustard sauce and pasta",
    portugueseName: "Hambúrguer de vaca com molho de mostarda e massa",
    category: "Meat/Fish",
    sellingPricePerPortion: 4.5,
    prepNotes: "Meat/Fish main from the Mon Bistrot weekly menu.",
    active: true,
    ingredients: [
      { name: "beef burger", quantityPerPortion: 0.16, unit: "kg", supplierId: "atlantic-protein", unitCost: 9.2 },
      { name: "pasta", quantityPerPortion: 0.08, unit: "kg", supplierId: "cascais-produce", unitCost: 1.8 },
      { name: "mustard sauce", quantityPerPortion: 0.03, unit: "kg", supplierId: "cascais-produce", unitCost: 3.6 }
    ]
  },
  {
    id: "hake-fillet-vegetable-puree",
    name: "Portuguese-style hake fillet with vegetable purée",
    portugueseName: "Filete de pescada à portuguesa com puré de legumes",
    category: "Meat/Fish",
    sellingPricePerPortion: 4.5,
    prepNotes: "Meat/Fish main from the Mon Bistrot weekly menu.",
    active: true,
    ingredients: [
      { name: "hake fillet", quantityPerPortion: 0.17, unit: "kg", supplierId: "atlantic-protein", unitCost: 7.8 },
      { name: "vegetable puree", quantityPerPortion: 0.16, unit: "kg", supplierId: "cascais-produce", unitCost: 1.9 }
    ]
  },
  {
    id: "suckling-pig-rissois-bean-rice",
    name: "Suckling pig rissóis with bean rice",
    portugueseName: "Rissóis de leitão com arroz de feijão",
    category: "Meat/Fish",
    sellingPricePerPortion: 4.5,
    prepNotes: "Meat/Fish main from the Mon Bistrot weekly menu.",
    active: true,
    ingredients: [
      { name: "suckling pig rissóis", quantityPerPortion: 0.18, unit: "kg", supplierId: "atlantic-protein", unitCost: 8.6 },
      { name: "bean rice", quantityPerPortion: 0.16, unit: "kg", supplierId: "cascais-produce", unitCost: 1.7 }
    ]
  },
  {
    id: "roasted-chicken-leg-spaghetti",
    name: "Roasted chicken leg with sautéed spaghetti",
    portugueseName: "Perna de frango assada com esparguete salteado",
    category: "Meat/Fish",
    sellingPricePerPortion: 4.5,
    prepNotes: "Meat/Fish main from the Mon Bistrot weekly menu.",
    active: true,
    ingredients: [
      { name: "chicken leg", quantityPerPortion: 0.2, unit: "kg", supplierId: "atlantic-protein", unitCost: 4.9 },
      { name: "spaghetti", quantityPerPortion: 0.08, unit: "kg", supplierId: "cascais-produce", unitCost: 1.8 }
    ]
  },
  {
    id: "pork-escalopes-beer-carrot-rice",
    name: "Pork escalopes with beer sauce and carrot rice",
    portugueseName: "Escalopes de porco com molho de cerveja e arroz de cenoura",
    category: "Meat/Fish",
    sellingPricePerPortion: 4.5,
    prepNotes: "Meat/Fish main from the Mon Bistrot weekly menu.",
    active: true,
    ingredients: [
      { name: "pork escalopes", quantityPerPortion: 0.17, unit: "kg", supplierId: "atlantic-protein", unitCost: 5.8 },
      { name: "carrot rice", quantityPerPortion: 0.15, unit: "kg", supplierId: "cascais-produce", unitCost: 1.5 },
      { name: "beer sauce", quantityPerPortion: 0.03, unit: "l", supplierId: "nova-bakery", unitCost: 2.2 }
    ]
  },
  {
    id: "peas-poached-eggs-white-rice",
    name: "Peas with poached eggs and white rice",
    portugueseName: "Ervilhas com ovos escalfados e arroz branco",
    category: "Vegetarian",
    sellingPricePerPortion: 4,
    prepNotes: "Green Vibes vegetarian main from the Mon Bistrot weekly menu.",
    active: true,
    ingredients: [
      { name: "peas", quantityPerPortion: 0.12, unit: "kg", supplierId: "cascais-produce", unitCost: 2.2 },
      { name: "egg", quantityPerPortion: 1, unit: "unit", supplierId: "cascais-produce", unitCost: 0.24 },
      { name: "rice", quantityPerPortion: 0.08, unit: "kg", supplierId: "cascais-produce", unitCost: 1.4 }
    ]
  },
  {
    id: "mushroom-soy-ragu-bow-tie-pasta",
    name: "Mushroom and soy ragù with bow-tie pasta",
    portugueseName: "Ragù de cogumelos com soja e massa laços",
    category: "Vegetarian",
    sellingPricePerPortion: 4,
    prepNotes: "Green Vibes vegetarian main from the Mon Bistrot weekly menu.",
    active: true,
    ingredients: [
      { name: "mushrooms", quantityPerPortion: 0.09, unit: "kg", supplierId: "cascais-produce", unitCost: 3.8 },
      { name: "soy protein", quantityPerPortion: 0.05, unit: "kg", supplierId: "cascais-produce", unitCost: 4.2 },
      { name: "bow-tie pasta", quantityPerPortion: 0.08, unit: "kg", supplierId: "cascais-produce", unitCost: 1.8 }
    ]
  },
  {
    id: "ricotta-spinach-cannelloni",
    name: "Ricotta and spinach cannelloni",
    portugueseName: "Canelone de ricota e espinafres",
    category: "Vegetarian",
    sellingPricePerPortion: 4.2,
    prepNotes: "Green Vibes vegetarian main from the Mon Bistrot weekly menu.",
    active: true,
    ingredients: [
      { name: "ricotta", quantityPerPortion: 0.07, unit: "kg", supplierId: "cascais-produce", unitCost: 6.5 },
      { name: "spinach", quantityPerPortion: 0.06, unit: "kg", supplierId: "cascais-produce", unitCost: 3.4 },
      { name: "cannelloni pasta", quantityPerPortion: 0.08, unit: "kg", supplierId: "cascais-produce", unitCost: 2.1 }
    ]
  },
  {
    id: "ratatouille-chickpea-rice",
    name: "Ratatouille with chickpea rice",
    portugueseName: "Ratatouille com arroz de grão-de-bico",
    category: "Vegetarian",
    sellingPricePerPortion: 4,
    prepNotes: "Green Vibes vegetarian main from the Mon Bistrot weekly menu.",
    active: true,
    ingredients: [
      { name: "ratatouille vegetables", quantityPerPortion: 0.16, unit: "kg", supplierId: "cascais-produce", unitCost: 2.4 },
      { name: "chickpea rice", quantityPerPortion: 0.15, unit: "kg", supplierId: "cascais-produce", unitCost: 1.8 }
    ]
  },
  {
    id: "vegetables-a-bras",
    name: "Sautéed vegetables with eggs and matchstick potatoes",
    portugueseName: "Legumes à Brás",
    category: "Vegetarian",
    sellingPricePerPortion: 4,
    prepNotes: "Green Vibes vegetarian main from the Mon Bistrot weekly menu.",
    active: true,
    ingredients: [
      { name: "mixed vegetables", quantityPerPortion: 0.14, unit: "kg", supplierId: "cascais-produce", unitCost: 1.7 },
      { name: "egg", quantityPerPortion: 1, unit: "unit", supplierId: "cascais-produce", unitCost: 0.24 },
      { name: "matchstick potatoes", quantityPerPortion: 0.09, unit: "kg", supplierId: "cascais-produce", unitCost: 2.2 }
    ]
  },
  {
    id: "codfish-fritters-tomato-rice",
    name: "Codfish fritters with tomato rice",
    portugueseName: "Pataniscas de bacalhau com arroz de tomate",
    category: "Nomad",
    sellingPricePerPortion: 5.2,
    prepNotes: "Nomad premium dish from the Mon Bistrot weekly menu.",
    active: true,
    ingredients: [
      { name: "codfish fritters", quantityPerPortion: 0.18, unit: "kg", supplierId: "atlantic-protein", unitCost: 8.8 },
      { name: "tomato rice", quantityPerPortion: 0.15, unit: "kg", supplierId: "cascais-produce", unitCost: 1.6 }
    ]
  },
  {
    id: "chicken-curry-basmati-kachumber",
    name: "Chicken curry with basmati rice and kachumber salad",
    portugueseName: "Caril de frango com arroz basmati e salada kachumber",
    category: "Nomad",
    sellingPricePerPortion: 5.2,
    prepNotes: "Nomad premium dish from the Mon Bistrot weekly menu.",
    active: true,
    ingredients: [
      { name: "chicken", quantityPerPortion: 0.18, unit: "kg", supplierId: "atlantic-protein", unitCost: 5.4 },
      { name: "basmati rice", quantityPerPortion: 0.08, unit: "kg", supplierId: "cascais-produce", unitCost: 2.1 },
      { name: "kachumber salad", quantityPerPortion: 0.06, unit: "kg", supplierId: "cascais-produce", unitCost: 2.6 }
    ]
  },
  {
    id: "roasted-turkey-leg-bbq-wedges",
    name: "Roasted turkey leg with BBQ sauce, wedges and green beans",
    portugueseName: "Perna de peru assada com molho BBQ, batatas e feijão-verde",
    category: "Nomad",
    sellingPricePerPortion: 5.2,
    prepNotes: "Nomad premium dish from the Mon Bistrot weekly menu.",
    active: true,
    ingredients: [
      { name: "turkey leg", quantityPerPortion: 0.2, unit: "kg", supplierId: "atlantic-protein", unitCost: 6.8 },
      { name: "potato wedges", quantityPerPortion: 0.14, unit: "kg", supplierId: "cascais-produce", unitCost: 1.2 },
      { name: "green beans", quantityPerPortion: 0.07, unit: "kg", supplierId: "cascais-produce", unitCost: 2.8 }
    ]
  },
  {
    id: "pork-loin-farinheira-fries",
    name: "Pork loin with farinheira sauce and fries",
    portugueseName: "Lombo de porco com molho de farinheira e batatas fritas",
    category: "Nomad",
    sellingPricePerPortion: 5.2,
    prepNotes: "Nomad premium dish from the Mon Bistrot weekly menu.",
    active: true,
    ingredients: [
      { name: "pork loin", quantityPerPortion: 0.18, unit: "kg", supplierId: "atlantic-protein", unitCost: 6.1 },
      { name: "farinheira sauce", quantityPerPortion: 0.04, unit: "kg", supplierId: "atlantic-protein", unitCost: 7.5 },
      { name: "fries", quantityPerPortion: 0.14, unit: "kg", supplierId: "cascais-produce", unitCost: 1.5 }
    ]
  },
  {
    id: "roasted-squid-tentacles-potatoes-greens",
    name: "Roasted squid tentacles with potatoes and sautéed greens",
    portugueseName: "Tentáculos de pota no forno com batatas e grelos",
    category: "Nomad",
    sellingPricePerPortion: 5.5,
    prepNotes: "Nomad premium dish from the Mon Bistrot weekly menu.",
    active: true,
    ingredients: [
      { name: "squid tentacles", quantityPerPortion: 0.18, unit: "kg", supplierId: "atlantic-protein", unitCost: 9.6 },
      { name: "potatoes", quantityPerPortion: 0.14, unit: "kg", supplierId: "cascais-produce", unitCost: 1.2 },
      { name: "sautéed greens", quantityPerPortion: 0.07, unit: "kg", supplierId: "cascais-produce", unitCost: 2.9 }
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
