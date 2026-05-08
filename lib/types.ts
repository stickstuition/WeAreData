export type FoodCategory =
  | "Meat/Fish"
  | "Vegetarian"
  | "Nomad"
  | "Soup"
  | "Salads"
  | "Dessert"
  | "Fruit";

export type AppLanguage = "English" | "Portuguese";
export type WeatherType = "sunny" | "cloudy" | "rainy" | "windy";

export type RecipeIngredient = {
  name: string;
  quantityPerPortion: number;
  unit: "kg" | "g" | "l" | "unit";
  supplierId: string;
  unitCost: number;
};

export type Recipe = {
  id: string;
  name: string;
  portugueseName: string;
  category: FoodCategory;
  sellingPricePerPortion: number;
  prepNotes: string;
  ingredients: RecipeIngredient[];
  active: boolean;
};

export type Supplier = {
  id: string;
  name: string;
  leadTimeDays: number;
  orderContact: string;
  categories: FoodCategory[];
};

export type WeeklyPlan = Record<string, Record<FoodCategory, string[]>>;

export type DailyForecast = {
  day: string;
  recipeId: string;
  forecastPortions: number;
  manualForecast: number;
  actualSold: number;
  actualRevenue: number;
  correctionType: "none" | "quantity correction" | "forecast miss" | "operational note";
  varianceNote: string;
};

export type HistoricalRecord = {
  id: string;
  date: string;
  day: string;
  recipeId: string;
  people: number;
  sales: number;
  revenue: number;
  overtimeHours: number;
  poValue: number;
  unitPrice: number;
};

export type ScanDocumentType = "invoice" | "recipe sheet" | "ordering" | "sales" | "unknown";

export type ParsedScanLine = {
  label: string;
  quantity: number;
  unit: string;
  unitCost?: number;
  total?: number;
};

export type ScannedDocument = {
  id: string;
  createdAt: string;
  documentType: ScanDocumentType;
  imageDataUrl: string;
  parsedText: string;
  supplier?: string;
  documentDate?: string;
  totalValue?: number;
  lines: ParsedScanLine[];
  committed: boolean;
};

export type WeatherForecastDay = {
  date: string;
  maxTemperatureC: number;
  condition: WeatherType;
};

export type ForecastInputs = "same weekday historical data" | "previous days";
export type SuggestionInputs = "historical data" | "stock level";
