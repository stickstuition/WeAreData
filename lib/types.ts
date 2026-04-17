export type DishCategory =
  | "meat"
  | "fish"
  | "vegetarian"
  | "pasta"
  | "comfort food"
  | "healthy/light";

export type WeatherType = "sunny" | "cloudy" | "rainy" | "windy";
export type TemperatureBand = "cold" | "mild" | "warm";
export type AttendanceLevel = "low" | "medium" | "high";

export type Dish = {
  id: string;
  name: string;
  category: DishCategory;
  estimatedCostPerPortion: number;
  sellingPricePerPortion: number;
  active: boolean;
};

export type DailyMenuEntry = {
  id: string;
  date: string;
  weekday: string;
  dishId: string;
  traysPrepared: number;
  portionsProduced: number;
  portionsSold: number;
  portionsWasted: number;
  weatherType: WeatherType;
  temperatureBand: TemperatureBand;
  studentAttendanceLevel: AttendanceLevel;
  examPeriod: boolean;
  notes: string;
};

export type EntryWithDish = DailyMenuEntry & {
  dish: Dish;
};

export type DerivedMetrics = {
  sellThroughRate: number;
  wasteRate: number;
  grossRevenue: number;
  foodCost: number;
  estimatedMargin: number;
};

export type DishPerformance = {
  dishId: string;
  dishName: string;
  category: DishCategory;
  avgSellThrough: number;
  avgWasteRate: number;
  avgMargin: number;
  consistencyScore: number;
  totalSold: number;
  totalWaste: number;
  daysServed: number;
  score: number;
  status: "strong" | "watch" | "risky";
};

export type Recommendation = {
  id: string;
  title: string;
  tone: "good" | "warning" | "neutral";
  detail: string;
  action: string;
};

export type Filters = {
  dishId: string;
  weekday: string;
  weatherType: string;
  examPeriod: string;
  startDate: string;
  endDate: string;
};
