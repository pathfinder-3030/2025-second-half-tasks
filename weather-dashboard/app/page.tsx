"use client";

import { useWeather } from "@/hooks/use-weather";
import WeatherCard from "@/components/weather-card";
import LoadingSpinner from "@/components/loading-spinner";
import ErrorMessage from "@/components/error-message";
import CityAddForm from "@/components/city-add-form";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function Home() {
  const { weatherData, loading, error, addCity, refresh } = useWeather();

  return (
    <main className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4'>
      <div className='max-w-7xl mx-auto'>
        <Header />
        <CityAddForm onAdd={addCity} disabled={loading} />
        <div className='mb-8 text-center'>
          <button
            onClick={refresh}
            disabled={loading}
            className='px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold rounded-lg transition-colors duration-200'
          >
            {loading ? "更新中..." : "データを更新"}
          </button>
        </div>
        {error && <ErrorMessage message={error} onRetry={refresh} />}
        {loading && weatherData.length === 0 && <LoadingSpinner />}
        {!loading && weatherData.length === 0 && !error && (
          <div className='text-center text-gray-600 dark:text-gray-400 py-8'>
            天気情報がありません
          </div>
        )}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {weatherData.map((weather) => (
            <WeatherCard key={weather.cityName} weather={weather} />
          ))}
        </div>
        <Footer />
      </div>
    </main>
  );
}
