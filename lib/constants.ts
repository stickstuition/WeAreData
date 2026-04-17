import { Dish, TemperatureBand, WeatherType } from "@/lib/types";

export const DISHES: Dish[] = [
  {
    id: "chicken-curry",
    name: "Chicken Curry",
    category: "meat",
    estimatedCostPerPortion: 3.1,
    sellingPricePerPortion: 6.8,
    active: true
  },
  {
    id: "veg-lasagna",
    name: "Vegetarian Lasagna",
    category: "vegetarian",
    estimatedCostPerPortion: 2.5,
    sellingPricePerPortion: 6.2,
    active: true
  },
  {
    id: "beef-burger",
    name: "Beef Burger Plate",
    category: "comfort food",
    estimatedCostPerPortion: 3.4,
    sellingPricePerPortion: 7.4,
    active: true
  },
  {
    id: "grilled-fish",
    name: "Grilled Fish",
    category: "fish",
    estimatedCostPerPortion: 4.1,
    sellingPricePerPortion: 7.2,
    active: true
  },
  {
    id: "pasta-soup",
    name: "Soup + Pasta Combo",
    category: "pasta",
    estimatedCostPerPortion: 2.2,
    sellingPricePerPortion: 5.9,
    active: true
  },
  {
    id: "poke-bowl",
    name: "Chicken Poke Bowl",
    category: "healthy/light",
    estimatedCostPerPortion: 3,
    sellingPricePerPortion: 7.1,
    active: true
  },
  {
    id: "mushroom-risotto",
    name: "Mushroom Risotto",
    category: "vegetarian",
    estimatedCostPerPortion: 2.7,
    sellingPricePerPortion: 6.4,
    active: true
  },
  {
    id: "roast-turkey",
    name: "Roast Turkey",
    category: "meat",
    estimatedCostPerPortion: 3.6,
    sellingPricePerPortion: 7.3,
    active: true
  },
  {
    id: "salmon-pasta",
    name: "Salmon Pasta",
    category: "fish",
    estimatedCostPerPortion: 4.4,
    sellingPricePerPortion: 7.6,
    active: true
  },
  {
    id: "veggie-wrap",
    name: "Veggie Wrap",
    category: "healthy/light",
    estimatedCostPerPortion: 2.1,
    sellingPricePerPortion: 5.6,
    active: true
  }
];

export const WEEKDAY_ORDER = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday"
] as const;

export const WEATHER_TYPES: WeatherType[] = ["sunny", "cloudy", "rainy", "windy"];
export const TEMPERATURE_BANDS: TemperatureBand[] = ["cold", "mild", "warm"];
export const ATTENDANCE_LEVELS = ["low", "medium", "high"] as const;

export const HERO_DISHES = ["beef-burger", "chicken-curry", "veg-lasagna"];
