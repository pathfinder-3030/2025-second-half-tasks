// Open-Meteo Geocoding APIのレスポンス型定義
export type GeocodingResult = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code: string;
  country: string;
  timezone: string;
  population?: number;
  admin1?: string;
  admin2?: string;
  admin3?: string;
  admin4?: string;
};

export type GeocodingResponse = {
  results?: GeocodingResult[];
  generationtime_ms?: number;
};

// Open-Meteo Weather APIのレスポンス型定義
export type OpenMeteoCurrentWeather = {
  time: string;
  interval: number;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  weather_code: number;
  wind_speed_10m: number;
};

export type OpenMeteoResponse = {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: {
    time: string;
    interval: string;
    temperature_2m: string;
    relative_humidity_2m: string;
    apparent_temperature: string;
    weather_code: string;
    wind_speed_10m: string;
  };
  current: OpenMeteoCurrentWeather;
};

// エラー型定義
export type WeatherError = {
  message: string;
  code?: string;
  statusCode?: number;
};

// アプリケーション用の簡略化された天気データ
export type SimplifiedWeatherData = {
  cityName: string;
  country: string;
  temperature: number;
  feelsLike: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  timestamp: number;
};

// WMO Weather Codes マッピング用
export type WeatherCodeInfo = {
  description: string;
  icon: string;
};
