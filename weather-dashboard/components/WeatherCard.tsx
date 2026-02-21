import { SimplifiedWeatherData } from "@/types/weather";
import Image from "next/image";

interface WeatherCardProps {
  weather: SimplifiedWeatherData;
}

export default function WeatherCard({ weather }: WeatherCardProps) {
  const iconUrl = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {weather.cityName}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {weather.country}
          </p>
        </div>
        <div className="relative w-20 h-20">
          <Image
            src={iconUrl}
            alt={weather.description}
            fill
            sizes="80px"
            className="object-contain"
            unoptimized
          />
        </div>
      </div>

      <div className="mb-4">
        <div className="text-5xl font-bold text-gray-900 dark:text-white">
          {weather.temperature}°C
        </div>
        <p className="text-gray-600 dark:text-gray-300 capitalize mt-2">
          {weather.description}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">体感温度</p>
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            {weather.feelsLike}°C
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">湿度</p>
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            {weather.humidity}%
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">風速</p>
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            {weather.windSpeed} m/s
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">更新時刻</p>
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            {new Date(weather.timestamp * 1000).toLocaleTimeString("ja-JP", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
