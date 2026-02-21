# 天気予報ダッシュボード

Next.js、TypeScript、Tailwind CSSを使用した天気予報ダッシュボードアプリケーション。Open-Meteo APIを利用して、複数都市の天気情報をリアルタイムで表示します。

## 学習目的

このプロジェクトは以下の学習目標を達成するために作成されました:

1. **フロントエンドエンジニアのフェッチ理解**
   - 外部APIからのデータ取得
   - 非同期処理の実装

2. **エラーハンドリング**
   - APIエラーの適切な処理
   - ユーザーフレンドリーなエラーメッセージ表示
   - リトライ機能の実装

3. **技術スタック**
   - Next.js (App Router)
   - TypeScript
   - Tailwind CSS

## 使用API

### Open-Meteo API

このアプリケーションは [Open-Meteo](https://open-meteo.com/) の無料APIを使用しています。

**特徴:**

- **完全無料** (非商用利用)
- **APIキー不要** - 登録なしですぐに使用可能
- **日本語対応** - WMO Weather Codeを日本語にマッピング
- **世界中の都市に対応**

**利用制限 (無料プラン):**

- 1分あたり: 600コール
- 1時間あたり: 5,000コール
- 1日あたり: 10,000コール
- 1ヶ月あたり: 300,000コール

**使用エンドポイント:**

- Geocoding API: `https://geocoding-api.open-meteo.com/v1/search`
- Weather API: `https://api.open-meteo.com/v1/forecast`

## 機能

- 複数都市の天気情報の同時表示
- 都市の追加機能
- リアルタイムデータ更新
- ローディング状態の表示
- エラーハンドリングとリトライ機能
- レスポンシブデザイン (モバイル・タブレット・デスクトップ対応)
- ダークモード対応

## セットアップ手順

### 1. 前提条件

- Node.js 18以上
- npm または yarn

### 2. インストール

```bash
# リポジトリをクローン (既存の場合はスキップ)
cd weather-dashboard

# 依存関係をインストール
npm install
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

**APIキーの設定は不要です！** Open-Meteo APIはAPIキーなしで利用できます。

### 4. ビルド

```bash
npm run build
npm start
```

## プロジェクト構造

```
weather-dashboard/
├── app/
│   ├── globals.css          # グローバルスタイル
│   ├── layout.tsx            # ルートレイアウト
│   └── page.tsx              # メインページ
├── components/
│   ├── WeatherCard.tsx       # 天気カードコンポーネント
│   ├── LoadingSpinner.tsx    # ローディングスピナー
│   └── ErrorMessage.tsx      # エラーメッセージ
├── lib/
│   └── weatherApi.ts         # API関連関数
├── types/
│   └── weather.ts            # 型定義
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

## 実装されているエラーハンドリング

### APIレベルのエラーハンドリング

1. **都市名検証**
   - 都市名が空の場合のエラー
   - 都市が見つからない場合のエラー

2. **HTTPステータスコード別処理**
   - 404: 都市が見つからない
   - その他: 一般的なエラー

3. **ネットワークエラー**
   - 接続エラーの検出と適切なメッセージ表示

### UIレベルのエラーハンドリング

1. **エラーメッセージ表示**
   - 視覚的にわかりやすいエラー表示
   - エラーの詳細説明

2. **リトライ機能**
   - 再試行ボタンの提供
   - ワンクリックでのデータ再取得

3. **複数都市の並列フェッチ**
   - `Promise.allSettled` を使用
   - 一部が失敗しても他の結果を表示

## 学習ポイント

### 1. APIフェッチの実装

`lib/weatherApi.ts` で以下を実装:

```typescript
// カスタムエラークラス
export class WeatherApiError extends Error {
  // エラーコードとステータスコードを保持
}

// 都市名から天気情報を取得 (2ステップ)
// 1. Geocoding API で都市名 → 座標を取得
// 2. Weather API で座標 → 天気情報を取得
export async function getWeatherByCity(cityName: string) {
  const location = await geocodeCity(cityName);
  const weather = await fetchWeatherByCoordinates(location.latitude, location.longitude);
  return transformWeatherData(weather, location);
}
```

### 2. エラーハンドリングパターン

```typescript
try {
  const data = await fetchWeatherData();
  // 成功時の処理
} catch (err) {
  if (err instanceof WeatherApiError) {
    // カスタムエラーの処理
  } else {
    // その他のエラーの処理
  }
}
```

### 3. React Hooksの活用

- `useState`: 状態管理 (データ、ローディング、エラー)
- `useEffect`: 初回データロード

### 4. TypeScriptの型安全性

- APIレスポンスの型定義
- コンポーネントのProps型定義
- エラーオブジェクトの型定義

## APIエンドポイント

### Open-Meteo Geocoding API

都市名から座標を取得:

```
GET https://geocoding-api.open-meteo.com/v1/search
```

パラメータ:

- `name`: 都市名
- `count`: 結果数 (デフォルト: 1)
- `language`: 言語 (ja = 日本語)

### Open-Meteo Weather API

座標から天気情報を取得:

```
GET https://api.open-meteo.com/v1/forecast
```

パラメータ:

- `latitude`: 緯度
- `longitude`: 経度
- `current`: 取得する現在の天気データ
- `timezone`: タイムゾーン (auto = 自動)

## 今後の拡張案

- [ ] 週間天気予報の表示
- [ ] 位置情報を使った現在地の天気表示
- [ ] お気に入り都市の保存 (localStorage)
- [ ] 天気アイコンのアニメーション
- [ ] 詳細な天気情報 (気圧、雲量など)
- [ ] グラフによる気温変化の可視化
- [ ] PWA対応

## トラブルシューティング

### 都市が見つからない

```
都市 "xxxxx" が見つかりませんでした
```

→ 英語の都市名を使用してください (例: Tokyo, London, Paris)

### ネットワークエラー

```
ネットワークエラー: ...
```

→ インターネット接続を確認してください。

### レート制限

Open-Meteo の無料プランには制限があります。大量のリクエストを行うと一時的にブロックされる場合があります。しばらく待ってから再試行してください。

## ライセンス

学習目的のデモプロジェクトです。

## 参考資料

- [Next.js Documentation](https://nextjs.org/docs)
- [Open-Meteo API Documentation](https://open-meteo.com/en/docs)
- [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
