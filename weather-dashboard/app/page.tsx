"use client";

import { useState, useEffect } from "react";
import { SimplifiedWeatherData } from "@/types/weather";
import { getWeatherForMultipleCities, WeatherApiError } from "@/lib/weather-api";
import WeatherCard from "@/components/weather-card";
import LoadingSpinner from "@/components/loading-spinner";
import ErrorMessage from "@/components/error-message";

// デフォルトの都市リスト
const DEFAULT_CITIES = ["Tokyo", "Osaka", "Kyoto", "Fukuoka", "Sapporo"];

export default function Home() {
  const [weatherData, setWeatherData] = useState<SimplifiedWeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cityInput, setCityInput] = useState("");

  // 初回ロード時に天気データを取得
  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getWeatherForMultipleCities(DEFAULT_CITIES);
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
  };

  const handleAddCity = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cityInput.trim()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 新しい都市リストを作成
      const newCities = [...DEFAULT_CITIES, cityInput.trim()];
      const data = await getWeatherForMultipleCities(newCities);
      setWeatherData(data);
      setCityInput("");
    } catch (err) {
      if (err instanceof WeatherApiError) {
        setError(err.message);
      } else {
        setError("都市の追加中にエラーが発生しました");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
            天気予報ダッシュボード
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            複数都市の天気情報をリアルタイムで確認
          </p>
        </header>

        {/* 都市追加フォーム */}
        <div className="mb-8 max-w-md mx-auto">
          <form onSubmit={handleAddCity} className="flex gap-2">
            <input
              type="text"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              placeholder="都市名を入力 (例: London)"
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              追加
            </button>
          </form>
        </div>

        {/* リフレッシュボタン */}
        <div className="mb-8 text-center">
          <button
            onClick={fetchWeatherData}
            disabled={loading}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            {loading ? "更新中..." : "データを更新"}
          </button>
        </div>

        {/* エラー表示 */}
        {error && (
          <ErrorMessage message={error} onRetry={fetchWeatherData} />
        )}

        {/* ローディング表示 */}
        {loading && weatherData.length === 0 && <LoadingSpinner />}

        {/* 天気カード表示 */}
        {!loading && weatherData.length === 0 && !error && (
          <div className="text-center text-gray-600 dark:text-gray-400 py-8">
            天気情報がありません
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {weatherData.map((weather, index) => (
            <WeatherCard key={`${weather.cityName}-${index}`} weather={weather} />
          ))}
        </div>

        {/* フッター */}
        <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Powered by Open-Meteo API</p>
          <p className="mt-2">
            学習目的のデモアプリケーション - Next.js + TypeScript + Tailwind CSS
          </p>
        </footer>
      </div>
    </main>
  );
}
