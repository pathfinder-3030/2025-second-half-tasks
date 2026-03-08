import { SimplifiedWeatherData } from "@/types/weather";
import {
  Sun,
  Cloud,
  CloudSun,
  CloudRain,
  CloudDrizzle,
  CloudSnow,
  CloudFog,
  CloudLightning,
  Snowflake,
  type LucideIcon,
} from "lucide-react";

const WEATHER_ICONS: Record<string, LucideIcon> = {
  Sun,
  Cloud,
  CloudSun,
  CloudRain,
  CloudDrizzle,
  CloudSnow,
  CloudFog,
  CloudLightning,
  Snowflake,
};

const ICON_COLORS: Record<string, string> = {
  Sun: "text-yellow-500",
  Cloud: "text-gray-400",
  CloudSun: "text-yellow-400",
  CloudRain: "text-blue-500",
  CloudDrizzle: "text-blue-400",
  CloudSnow: "text-blue-300",
  CloudFog: "text-gray-500",
  CloudLightning: "text-purple-500",
  Snowflake: "text-cyan-400",
};

interface WeatherCardProps {
  weather: SimplifiedWeatherData;
}

export default function WeatherCard({ weather }: WeatherCardProps) {
  const IconComponent = WEATHER_ICONS[weather.icon] || Sun;
  const iconColor = ICON_COLORS[weather.icon] || "text-yellow-500";

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
        <div className="w-20 h-20 flex items-center justify-center">
          <IconComponent
            className={`w-16 h-16 ${iconColor}`}
            aria-label={weather.description}
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
