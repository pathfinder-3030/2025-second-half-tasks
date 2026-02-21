# 天気予報ダッシュボード

Next.js、TypeScript、Tailwind CSSを使用した天気予報ダッシュボードアプリケーション。OpenWeatherMap APIを利用して、複数都市の天気情報をリアルタイムで表示します。

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

### 2. OpenWeatherMap APIキーの取得

1. [OpenWeatherMap](https://openweathermap.org/api) にアクセス
2. アカウントを作成 (無料)
3. API KeysセクションからAPIキーを取得

### 3. インストール

```bash
# リポジトリをクローン (既存の場合はスキップ)
cd weather-dashboard

# 依存関係をインストール
npm install
```

### 4. 環境変数の設定

`.env.local.example` を `.env.local` にコピーして、APIキーを設定します:

```bash
cp .env.local.example .env.local
```

`.env.local` を編集:

```env
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_actual_api_key_here
```

### 5. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

### 6. ビルド

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
├── .env.local.example        # 環境変数の例
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

## 実装されているエラーハンドリング

### APIレベルのエラーハンドリング

1. **APIキー検証**
   - APIキーが設定されていない場合のエラー

2. **HTTPステータスコード別処理**
   - 404: 都市が見つからない
   - 401: APIキーが無効
   - 429: レート制限超過
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

// 都市名から天気情報を取得
export async function getWeatherByCity(cityName: string) {
  // バリデーション、フェッチ、エラーハンドリング
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

OpenWeatherMap API の使用エンドポイント:

- `GET /weather`: 現在の天気情報取得

パラメータ:
- `q`: 都市名
- `appid`: APIキー
- `units`: 単位 (metric = 摂氏)
- `lang`: 言語 (ja = 日本語)

## 今後の拡張案

- [ ] 週間天気予報の表示
- [ ] 位置情報を使った現在地の天気表示
- [ ] お気に入り都市の保存 (localStorage)
- [ ] 天気アイコンのアニメーション
- [ ] 詳細な天気情報 (気圧、雲量など)
- [ ] グラフによる気温変化の可視化
- [ ] PWA対応

## トラブルシューティング

### APIキーエラー

```
APIキーが設定されていません
```

→ `.env.local` ファイルが作成されているか、APIキーが正しく設定されているか確認してください。

### 都市が見つからない

```
都市 "xxxxx" が見つかりませんでした
```

→ 英語の都市名を使用してください (例: Tokyo, London, Paris)

### レート制限

```
APIリクエストの制限に達しました
```

→ 無料プランは1分間に60リクエストまでです。しばらく待ってから再試行してください。

## ライセンス

学習目的のデモプロジェクトです。

## 参考資料

- [Next.js Documentation](https://nextjs.org/docs)
- [OpenWeatherMap API Documentation](https://openweathermap.org/api)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
