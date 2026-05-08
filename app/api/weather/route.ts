import { NextResponse } from "next/server";

import { WeatherForecastDay, WeatherType } from "@/lib/types";

const NOVA_SBE_CARCAVELOS = {
  latitude: 38.6786,
  longitude: -9.3262
};

function toDateString(displayDate: { year?: number; month?: number; day?: number }) {
  if (!displayDate.year || !displayDate.month || !displayDate.day) return "";
  return `${displayDate.year}-${String(displayDate.month).padStart(2, "0")}-${String(displayDate.day).padStart(2, "0")}`;
}

function normalizeCondition(condition = ""): WeatherType {
  const value = condition.toLowerCase();
  if (value.includes("rain") || value.includes("shower") || value.includes("storm")) return "rainy";
  if (value.includes("wind")) return "windy";
  if (value.includes("cloud") || value.includes("overcast")) return "cloudy";
  return "sunny";
}

function normalizeWeatherCode(code: number): WeatherType {
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(code)) return "rainy";
  if ([45, 48, 1, 2, 3].includes(code)) return "cloudy";
  return "sunny";
}

export async function GET() {
  const key = process.env.GOOGLE_WEATHER_API_KEY;

  if (!key) {
    try {
      const url = new URL("https://api.open-meteo.com/v1/forecast");
      url.searchParams.set("latitude", String(NOVA_SBE_CARCAVELOS.latitude));
      url.searchParams.set("longitude", String(NOVA_SBE_CARCAVELOS.longitude));
      url.searchParams.set("daily", "weather_code,temperature_2m_max");
      url.searchParams.set("timezone", "Europe/Lisbon");
      url.searchParams.set("forecast_days", "10");
      const response = await fetch(url, { next: { revalidate: 60 * 60 * 3 } });
      if (!response.ok) throw new Error("Open-Meteo unavailable");
      const data = await response.json();
      const forecast: WeatherForecastDay[] = (data.daily?.time ?? []).map((date: string, index: number) => ({
        date,
        maxTemperatureC: Math.round(data.daily.temperature_2m_max?.[index] ?? 20),
        condition: normalizeWeatherCode(Number(data.daily.weather_code?.[index] ?? 0))
      }));
      return NextResponse.json({ forecast, source: "open-meteo" });
    } catch {
      return NextResponse.json({
        forecast: [],
        message: "Weather forecast unavailable; using planning assumptions for now."
      });
    }
  }

  const url = new URL("https://weather.googleapis.com/v1/forecast/days:lookup");
  url.searchParams.set("key", key);
  url.searchParams.set("location.latitude", String(NOVA_SBE_CARCAVELOS.latitude));
  url.searchParams.set("location.longitude", String(NOVA_SBE_CARCAVELOS.longitude));
  url.searchParams.set("days", "10");
  url.searchParams.set("unitsSystem", "METRIC");
  url.searchParams.set("languageCode", "en");

  try {
    const response = await fetch(url, { next: { revalidate: 60 * 60 * 6 } });

    if (!response.ok) {
      return NextResponse.json(
        {
          forecast: [],
          message: "Google Weather did not return a forecast; using planning assumptions for now."
        },
        { status: 200 }
      );
    }

    const data = await response.json();
    const forecast: WeatherForecastDay[] = (data.forecastDays ?? [])
      .map((day: any) => ({
        date: toDateString(day.displayDate ?? {}),
        maxTemperatureC: Math.round(day.maxTemperature?.degrees ?? 20),
        condition: normalizeCondition(day.daytimeForecast?.weatherCondition?.description?.text)
      }))
      .filter((day: WeatherForecastDay) => day.date);

    return NextResponse.json({ forecast });
  } catch {
    return NextResponse.json({
      forecast: [],
      message: "Weather forecast unavailable; using planning assumptions for now."
    });
  }
}
