import { WeatherData, WeatherError, SimplifiedWeatherData } from "@/types/weather";

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

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
 * APIキーの存在を確認
 */
function validateApiKey(): void {
  if (!API_KEY) {
    throw new WeatherApiError(
      "APIキーが設定されていません。.env.localファイルにNEXT_PUBLIC_OPENWEATHER_API_KEYを設定してください。",
      500,
      "MISSING_API_KEY"
    );
  }
}

/**
 * 都市名から天気情報を取得
 */
export async function getWeatherByCity(
  cityName: string
): Promise<SimplifiedWeatherData> {
  validateApiKey();

  if (!cityName || cityName.trim() === "") {
    throw new WeatherApiError(
      "都市名が指定されていません",
      400,
      "INVALID_CITY_NAME"
    );
  }

  try {
    const url = `${BASE_URL}/weather?q=${encodeURIComponent(
      cityName
    )}&appid=${API_KEY}&units=metric&lang=ja`;

    const response = await fetch(url, {
      // キャッシュを無効化して常に最新のデータを取得
      cache: "no-store",
    });

    // エラーハンドリング
    if (!response.ok) {
      if (response.status === 404) {
        throw new WeatherApiError(
          `都市 "${cityName}" が見つかりませんでした`,
          404,
          "CITY_NOT_FOUND"
        );
      } else if (response.status === 401) {
        throw new WeatherApiError(
          "APIキーが無効です",
          401,
          "INVALID_API_KEY"
        );
      } else if (response.status === 429) {
        throw new WeatherApiError(
          "APIリクエストの制限に達しました。しばらく待ってから再試行してください。",
          429,
          "RATE_LIMIT_EXCEEDED"
        );
      } else {
        throw new WeatherApiError(
          `天気情報の取得に失敗しました (ステータス: ${response.status})`,
          response.status,
          "FETCH_FAILED"
        );
      }
    }

    const data: WeatherData = await response.json();
    return transformWeatherData(data);
  } catch (error) {
    // すでにWeatherApiErrorの場合はそのまま投げる
    if (error instanceof WeatherApiError) {
      throw error;
    }

    // ネットワークエラーなどその他のエラー
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
    .map((result) => (result as PromiseFulfilledResult<SimplifiedWeatherData>).value);

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
  validateApiKey();

  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    throw new WeatherApiError(
      "無効な座標です",
      400,
      "INVALID_COORDINATES"
    );
  }

  try {
    const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=ja`;

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

    const data: WeatherData = await response.json();
    return transformWeatherData(data);
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
 * WeatherDataをSimplifiedWeatherDataに変換
 */
function transformWeatherData(data: WeatherData): SimplifiedWeatherData {
  return {
    cityName: data.name,
    country: data.sys.country,
    temperature: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    description: data.weather[0]?.description || "情報なし",
    icon: data.weather[0]?.icon || "01d",
    humidity: data.main.humidity,
    windSpeed: Math.round(data.wind.speed * 10) / 10,
    timestamp: data.dt,
  };
}
