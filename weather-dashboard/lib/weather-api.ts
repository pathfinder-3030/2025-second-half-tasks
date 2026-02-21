import {
  GeocodingResponse,
  GeocodingResult,
  OpenMeteoResponse,
  SimplifiedWeatherData,
  WeatherError,
  WeatherCodeInfo,
} from "@/types/weather";

const GEOCODING_API_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast";

/**
 * WMO Weather Codes を日本語の説明とアイコンにマッピング
 * https://open-meteo.com/en/docs より
 */
const WMO_WEATHER_CODES: Record<number, WeatherCodeInfo> = {
  0: { description: "快晴", icon: "01d" },
  1: { description: "晴れ", icon: "01d" },
  2: { description: "一部曇り", icon: "02d" },
  3: { description: "曇り", icon: "03d" },
  45: { description: "霧", icon: "50d" },
  48: { description: "霧氷", icon: "50d" },
  51: { description: "弱い霧雨", icon: "09d" },
  53: { description: "霧雨", icon: "09d" },
  55: { description: "強い霧雨", icon: "09d" },
  56: { description: "弱い着氷性霧雨", icon: "09d" },
  57: { description: "強い着氷性霧雨", icon: "09d" },
  61: { description: "弱い雨", icon: "10d" },
  63: { description: "雨", icon: "10d" },
  65: { description: "強い雨", icon: "10d" },
  66: { description: "弱い着氷性の雨", icon: "13d" },
  67: { description: "強い着氷性の雨", icon: "13d" },
  71: { description: "弱い雪", icon: "13d" },
  73: { description: "雪", icon: "13d" },
  75: { description: "強い雪", icon: "13d" },
  77: { description: "霧雪", icon: "13d" },
  80: { description: "弱いにわか雨", icon: "09d" },
  81: { description: "にわか雨", icon: "09d" },
  82: { description: "激しいにわか雨", icon: "09d" },
  85: { description: "弱いにわか雪", icon: "13d" },
  86: { description: "強いにわか雪", icon: "13d" },
  95: { description: "雷雨", icon: "11d" },
  96: { description: "雷雨（弱い雹）", icon: "11d" },
  99: { description: "雷雨（強い雹）", icon: "11d" },
};

/**
 * カスタムエラークラス
 */
export class WeatherApiError extends Error implements WeatherError {
  code?: string;
  statusCode?: number;

  constructor(message: string, statusCode?: number, code?: string) {
    super(message);
    this.name = "WeatherApiError";
    this.statusCode = statusCode;
    this.code = code;
  }
}

/**
 * WMO Weather Codeから天気情報を取得
 */
function getWeatherInfo(code: number): WeatherCodeInfo {
  return WMO_WEATHER_CODES[code] || { description: "不明", icon: "01d" };
}

/**
 * OpenMeteoResponseをSimplifiedWeatherDataに変換
 */
function transformToSimplifiedData(
  weatherData: OpenMeteoResponse,
  cityName: string,
  country: string
): SimplifiedWeatherData {
  const weatherInfo = getWeatherInfo(weatherData.current.weather_code);

  return {
    cityName,
    country,
    temperature: Math.round(weatherData.current.temperature_2m),
    feelsLike: Math.round(weatherData.current.apparent_temperature),
    description: weatherInfo.description,
    icon: weatherInfo.icon,
    humidity: weatherData.current.relative_humidity_2m,
    windSpeed: Math.round(weatherData.current.wind_speed_10m * 10) / 10,
    timestamp: Math.floor(new Date(weatherData.current.time).getTime() / 1000),
  };
}

/**
 * 都市名から座標を取得 (Geocoding API)
 */
async function geocodeCity(cityName: string): Promise<GeocodingResult> {
  if (!cityName || cityName.trim() === "") {
    throw new WeatherApiError(
      "都市名が指定されていません",
      400,
      "INVALID_CITY_NAME"
    );
  }

  try {
    const url = `${GEOCODING_API_URL}?name=${encodeURIComponent(
      cityName
    )}&count=1&language=ja&format=json`;

    const response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new WeatherApiError(
        `ジオコーディングに失敗しました (ステータス: ${response.status})`,
        response.status,
        "GEOCODING_FAILED"
      );
    }

    const data: GeocodingResponse = await response.json();

    if (!data.results || data.results.length === 0) {
      throw new WeatherApiError(
        `都市 "${cityName}" が見つかりませんでした`,
        404,
        "CITY_NOT_FOUND"
      );
    }

    return data.results[0];
  } catch (error) {
    if (error instanceof WeatherApiError) {
      throw error;
    }

    if (error instanceof Error) {
      throw new WeatherApiError(
        `ネットワークエラー: ${error.message}`,
        500,
        "NETWORK_ERROR"
      );
    }

    throw new WeatherApiError(
      "不明なエラーが発生しました",
      500,
      "UNKNOWN_ERROR"
    );
  }
}

/**
 * 座標から天気情報を取得 (Weather API)
 */
async function fetchWeatherByCoordinates(
  lat: number,
  lon: number
): Promise<OpenMeteoResponse> {
  try {
    const url = `${WEATHER_API_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`;

    const response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new WeatherApiError(
        `天気情報の取得に失敗しました (ステータス: ${response.status})`,
        response.status,
        "FETCH_FAILED"
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof WeatherApiError) {
      throw error;
    }

    if (error instanceof Error) {
      throw new WeatherApiError(
        `ネットワークエラー: ${error.message}`,
        500,
        "NETWORK_ERROR"
      );
    }

    throw new WeatherApiError(
      "不明なエラーが発生しました",
      500,
      "UNKNOWN_ERROR"
    );
  }
}

/**
 * 都市名から天気情報を取得
 */
export async function getWeatherByCity(
  cityName: string
): Promise<SimplifiedWeatherData> {
  // 1. 都市名から座標を取得
  const location = await geocodeCity(cityName);

  // 2. 座標から天気情報を取得
  const weatherData = await fetchWeatherByCoordinates(
    location.latitude,
    location.longitude
  );

  // 3. データを変換して返す
  return transformToSimplifiedData(
    weatherData,
    location.name,
    location.country_code
  );
}

/**
 * 複数の都市の天気情報を並列で取得
 */
export async function getWeatherForMultipleCities(
  cityNames: string[]
): Promise<SimplifiedWeatherData[]> {
  if (!cityNames || cityNames.length === 0) {
    throw new WeatherApiError(
      "都市名のリストが空です",
      400,
      "EMPTY_CITY_LIST"
    );
  }

  // Promise.allSettledを使用して、一部が失敗しても他の結果を取得
  const results = await Promise.allSettled(
    cityNames.map((city) => getWeatherByCity(city))
  );

  // 成功した結果のみを抽出
  const successfulResults = results
    .filter((result) => result.status === "fulfilled")
    .map(
      (result) => (result as PromiseFulfilledResult<SimplifiedWeatherData>).value
    );

  // すべて失敗した場合はエラーを投げる
  if (successfulResults.length === 0) {
    throw new WeatherApiError(
      "すべての都市の天気情報の取得に失敗しました",
      500,
      "ALL_CITIES_FAILED"
    );
  }

  return successfulResults;
}

/**
 * 緯度経度から天気情報を取得
 */
export async function getWeatherByCoordinates(
  lat: number,
  lon: number
): Promise<SimplifiedWeatherData> {
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    throw new WeatherApiError("無効な座標です", 400, "INVALID_COORDINATES");
  }

  // 座標から天気情報を取得
  const weatherData = await fetchWeatherByCoordinates(lat, lon);

  // 逆ジオコーディングは行わず、座標を都市名として使用
  return transformToSimplifiedData(
    weatherData,
    `${lat.toFixed(2)}, ${lon.toFixed(2)}`,
    ""
  );
}
