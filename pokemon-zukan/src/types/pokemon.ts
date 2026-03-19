// PokeAPI レスポンス型

// ポケモン一覧のレスポンス
export type PokemonListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    name: string;
    url: string;
  }[];
};

// ポケモン詳細（APIレスポンス）
export type PokemonResponse = {
  id: number;
  name: string;
  height: number; // デシメートル単位
  weight: number; // ヘクトグラム単位
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }[];
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
  sprites: {
    front_default: string;
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
};

// ポケモン種族情報（日本語名取得用）
export type PokemonSpeciesResponse = {
  names: {
    language: {
      name: string;
    };
    name: string;
  }[];
};

// アプリ内で使用する型

// 一覧表示用に簡略化したポケモンデータ
export type SimplifiedPokemon = {
  id: number;
  name: string;
  japaneseName: string;
  types: string[];
  imageUrl: string;
};

// 詳細表示用
export type PokemonDetail = SimplifiedPokemon & {
  height: number; // メートル単位に変換済み
  weight: number; // キログラム単位に変換済み
  stats: PokemonStat[];
};

export type PokemonStat = {
  name: string;
  japaneseName: string;
  value: number;
};

// ページネーション情報
export type PaginationInfo = {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

// エラー型
export type PokemonError = {
  message: string;
  code?: string;
  statusCode?: number;
};
