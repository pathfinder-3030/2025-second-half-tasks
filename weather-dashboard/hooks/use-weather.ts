"use client";

import { useState, useEffect, useCallback } from "react";
import { SimplifiedWeatherData } from "@/types/weather";
import {
  getWeatherForMultipleCities,
  WeatherApiError,
} from "@/lib/weather-api";

const DEFAULT_CITIES = ["Tokyo", "Osaka", "Kyoto", "Fukuoka", "Sapporo"];

interface UseWeatherReturn {
  weatherData: SimplifiedWeatherData[];
  loading: boolean;
  error: string | null;
  cities: string[];
  addCity: (cityName: string) => void;
  refresh: () => void;
  clearError: () => void;
}

export function useWeather(): UseWeatherReturn {
  const [weatherData, setWeatherData] = useState<SimplifiedWeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cities, setCities] = useState<string[]>(DEFAULT_CITIES);

  const fetchWeatherData = useCallback(async (cityList: string[]) => {
    setLoading(true);
    setError(null);

    try {
      const data = await getWeatherForMultipleCities(cityList);
      setWeatherData(data);
    } catch (err) {
      if (err instanceof WeatherApiError) {
        setError(err.message);
      } else {
        setError("天気情報の取得中に予期しないエラーが発生しました");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeatherData(cities);
  }, [fetchWeatherData, cities]);

  const addCity = useCallback(
    (cityName: string) => {
      const trimmedCity = cityName.trim();
      if (!trimmedCity) {
        return;
      }

      const isDuplicate = cities.some(
        (city) => city.toLowerCase() === trimmedCity.toLowerCase()
      );
      if (isDuplicate) {
        setError("この都市は既に追加されています");
        return;
      }

      setCities((prev) => [...prev, trimmedCity]);
    },
    [cities]
  );

  const refresh = useCallback(() => {
    fetchWeatherData(cities);
  }, [fetchWeatherData, cities]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    weatherData,
    loading,
    error,
    cities,
    addCity,
    refresh,
    clearError,
  };
}
