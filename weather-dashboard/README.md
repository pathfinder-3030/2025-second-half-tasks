# 天気予報ダッシュボード

複数都市のリアルタイム天気情報を表示する Web アプリケーションです。  
**実装課題テーマ：「フロントエンドを自作し、外部 API との連携やデータフェッチの実装を通じて、バックエンドの処理構造や API の仕組みをより深く理解する」**

---

## 技術スタック

| 分類 | 技術 |
|------|------|
| フレームワーク | Next.js 15 (App Router) |
| 言語 | TypeScript 5 |
| スタイリング | Tailwind CSS |
| アイコン | lucide-react |
| 外部 API | Open-Meteo Geocoding API / Open-Meteo Weather API |

---

## 機能

- デフォルト 5 都市（東京・大阪・京都・福岡・札幌）の天気を一覧表示
- 都市名を入力して任意の都市を追加
- データの手動更新（再フェッチ）
- ダークモード対応

---

## アーキテクチャ

```
weather-dashboard/
├── app/
│   ├── layout.tsx          # ルートレイアウト（フォント・メタデータ設定）
│   └── page.tsx            # エントリーポイント（UI の組み立て）
├── components/
│   ├── header/             # タイトル表示
│   ├── city-add-form/      # 都市追加フォーム
│   ├── weather-card/       # 天気カード（都市ごと）
│   ├── loading-spinner/    # ローディング表示
│   ├── error-message/      # エラー表示
│   └── footer/             # フッター
├── hooks/
│   └── use-weather.ts      # データフェッチの状態管理カスタムフック
├── lib/
│   └── weather-api.ts      # 外部 API との通信ロジック（純粋関数）
└── types/
    └── weather.ts          # 型定義（API レスポンス / アプリ用データ）
```

### 層ごとの責務分離

| 層 | 責務 |
|----|------|
| `lib/weather-api.ts` | HTTP リクエストの送信・レスポンスの解釈・エラーハンドリング。React に依存しない純粋なロジック |
| `hooks/use-weather.ts` | `lib` の関数を呼び出し、ローディング・エラー・データの状態を React として管理 |
| `components/` | 状態の表示のみ。フェッチロジックを持たない |

---

## データフロー

ユーザーが都市名を入力してから画面に天気が表示されるまでの流れです。

```
[ユーザー操作]
     │
     │  都市名を入力・「追加」ボタン押下
     ▼
[city-add-form/index.tsx]
     │
     │  onAdd(cityName) コールバック呼び出し
     ▼
[hooks/use-weather.ts]  addCity()
     │
     │  cities ステートを更新
     │    → useEffect が反応し fetchWeatherData() を実行
     ▼
[lib/weather-api.ts]  getWeatherForMultipleCities()
     │
     │  全都市を Promise.allSettled() で並列リクエスト
     │
     ├── getWeatherByCity("Tokyo") ──────────────────────────────────────┐
     │        │                                                          │
     │        │  【Step 1】Geocoding API                                 │
     │        │    GET https://geocoding-api.open-meteo.com/v1/search    │
     │        │    ?name=Tokyo&count=1&language=ja&format=json           │
     │        │                                                          │
     │        │    レスポンス例:                                          │
     │        │    {                                                      │
     │        │      "results": [{                                        │
     │        │        "name": "東京都",                                  │
     │        │        "latitude": 35.6895,                              │
     │        │        "longitude": 139.6917,                            │
     │        │        "country_code": "JP"                              │
     │        │      }]                                                   │
     │        │    }                                                      │
     │        │                                                          │
     │        │  【Step 2】Weather API                                    │
     │        │    GET https://api.open-meteo.com/v1/forecast            │
     │        │    ?latitude=35.6895&longitude=139.6917                  │
     │        │    &current=temperature_2m,relative_humidity_2m,         │
     │        │             apparent_temperature,weather_code,           │
     │        │             wind_speed_10m                               │
     │        │    &timezone=auto&wind_speed_unit=ms                     │
     │        │                                                          │
     │        │    レスポンス例:                                          │
     │        │    {                                                      │
     │        │      "current": {                                         │
     │        │        "temperature_2m": 18,                             │
     │        │        "relative_humidity_2m": 60,                       │
     │        │        "apparent_temperature": 17,                       │
     │        │        "weather_code": 1,                                │
     │        │        "wind_speed_10m": 3.2                             │
     │        │      }                                                    │
     │        │    }                                                      │
     │        │                                                          │
     │        │  【Step 3】データ変換                                     │
     │        │    OpenMeteoResponse → SimplifiedWeatherData             │
     │        └──────────────────────────────────────────────────────────┘
     │
     │  全都市のリクエスト完了後、成功分のみ抽出
     ▼
[hooks/use-weather.ts]
     │
     │  weatherData ステートを更新
     ▼
[components/weather-card/index.tsx]
     │
     │  SimplifiedWeatherData を受け取り描画
     ▼
[ユーザーに天気情報を表示]
```

---

## 実装のポイント

### 1. 2 段階 API 呼び出し（Geocoding → Weather）

Open-Meteo の Weather API は「緯度・経度」を受け取る仕様のため、都市名を直接渡すことができません。  
まず Geocoding API で都市名を座標に変換し、その座標を Weather API に渡す **2 段階のリクエスト**が必要です。

```typescript
// lib/weather-api.ts
export async function getWeatherByCity(cityName: string) {
  const location = await geocodeCity(cityName);            // Step 1: 名前 → 座標
  const weatherData = await fetchWeatherByCoordinates(     // Step 2: 座標 → 天気
    location.latitude,
    location.longitude
  );
  return transformToSimplifiedData(weatherData, location.name, location.country_code);
}
```

この設計を通じて、**API がリソース指向（座標という一意なキーで設計されている）** こと、  
および **複数 API を組み合わせるオーケストレーション**の概念を理解しました。  
また、"Paris" という都市名はフランスにもテキサスにも存在するため、緯度経度という一意な識別子を使うことで曖昧さが消えるという、バックエンドのリソース設計の思想にも触れました。

---

### 2. 並列フェッチと部分成功の許容（Promise.allSettled）

複数都市を取得する際、`Promise.all` ではなく `Promise.allSettled` を使用しています。

```typescript
// lib/weather-api.ts
const results = await Promise.allSettled(
  cityNames.map((city) => getWeatherByCity(city))
);

// 成功した結果のみ抽出（1 都市が失敗しても他は表示する）
const successfulResults = results
  .filter((result) => result.status === "fulfilled")
  .map((result) => (result as PromiseFulfilledResult<SimplifiedWeatherData>).value);
```

| | `Promise.all` | `Promise.allSettled` |
|-|---|---|
| 1 つでも失敗したら | 全体が reject | 残りは続行 |
| 戻り値 | 成功した結果の配列 | 成否を含むオブジェクト配列 |
| 用途 | 全て成功が必要な処理 | 部分成功を許容したい処理 |

この選択により、ある都市のリクエストが失敗しても他の都市の結果は表示できます。  
バックエンドでも同様に「一部失敗を許容するバッチ処理」の設計が求められる場面があり、その判断基準を学びました。

---

### 3. カスタムエラークラスによるエラーの構造化

`Error` を継承した `WeatherApiError` クラスを定義し、HTTP ステータスコードとエラーコードを付与しています。

```typescript
// lib/weather-api.ts
export class WeatherApiError extends Error {
  code?: string;       // "CITY_NOT_FOUND" / "NETWORK_ERROR" など
  statusCode?: number; // 404 / 500 など

  constructor(message: string, statusCode?: number, code?: string) {
    super(message);
    this.name = "WeatherApiError";
  }
}
```

これにより `catch` ブロックで `instanceof WeatherApiError` を使って **API 由来のエラーかどうかを区別**でき、  
フック側でユーザーへのメッセージを適切に分岐できます。

```typescript
// hooks/use-weather.ts
} catch (err) {
  if (err instanceof WeatherApiError) {
    setError(err.message);  // API エラーは詳細メッセージを表示
  } else {
    setError("天気情報の取得中に予期しないエラーが発生しました");
  }
}
```

バックエンドの実装でも同様に、エラーに種別・コード・HTTP ステータスを持たせることが一般的です。  
フロントから叩く側として「エラーがどういう構造で返ってくるか」を意識したことで、API 設計への理解が深まりました。

---

### 4. `cache: "no-store"` による常時最新データの取得

Next.js の `fetch` はデフォルトでキャッシュが有効ですが、天気情報は常に最新値が必要なため明示的に無効化しています。

```typescript
const response = await fetch(url, { cache: "no-store" });
```

これは HTTP の **Cache-Control ヘッダー**の仕組みを意識した選択です。  
バックエンドでレスポンスに `Cache-Control: no-store` を付与するのと同じ意図であり、  
「どのデータをキャッシュしてよいか」という HTTP 設計の考え方を実感として学びました。

---

### 5. 型定義で外部 API とアプリ内部を分離

外部 API のレスポンス形状を TypeScript の型として定義し、アプリ内部では `SimplifiedWeatherData` に変換しています。

```typescript
// types/weather.ts：外部 API のレスポンス形状をそのまま型にする
type OpenMeteoResponse = {
  current: {
    temperature_2m: number;   // 外部 API のフィールド名をそのまま使用
    weather_code: number;
    wind_speed_10m: number;
    // ...
  };
};

// アプリが必要なフィールドだけに絞った型（命名も日本語文脈に合わせて変換）
type SimplifiedWeatherData = {
  cityName: string;
  temperature: number;   // temperature_2m から変換
  description: string;   // weather_code をコードから日本語テキストに変換
  // ...
};
```

**外部仕様をそのまま内部に持ち込まず、変換層を挟む**このパターンは、  
バックエンドの DTO（Data Transfer Object）設計や DDD のアンチコラプションレイヤーの考え方に通じます。  
外部 API 仕様が変わってもアプリ内部への影響を最小限にできます。

---

## セットアップ・起動方法

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev
```

ブラウザで `http://localhost:3000` を開くと動作します。  
Open-Meteo API は**完全無料・API キー不要**で利用できます。

### API レート制限（無料プラン）

| 単位 | 上限 |
|------|------|
| 1 分あたり | 600 コール |
| 1 時間あたり | 5,000 コール |
| 1 日あたり | 10,000 コール |

---

## トラブルシューティング

**都市が見つからない場合**  
→ 英語の都市名を使用してください（例: `Tokyo`, `London`, `Paris`）

**ネットワークエラーが出る場合**  
→ インターネット接続を確認してください。

---

## 学んだこと・気づき

> ここは自分の言葉で記述してください。実装を通じて気づいたこと、難しかった点、  
> バックエンドの仕組みへの理解が深まった点などを書くと、評価者への説明として効果的です。

（記述例）
- フロントエンドから API を叩くことで、バックエンドがリクエストをどのように受け取り処理しているかを意識するようになった
- エラーハンドリングの設計が API の信頼性に大きく影響することを実感した
- `Promise.allSettled` と `Promise.all` の使い分けを通じて、非同期処理の設計判断を学んだ
- など

---

## 参考資料

- [Open-Meteo API Documentation](https://open-meteo.com/en/docs)
- [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api)
- [Next.js Documentation](https://nextjs.org/docs)
