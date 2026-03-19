import {
  PokemonListResponse,
  PokemonResponse,
  PokemonSpeciesResponse,
  SimplifiedPokemon,
  PokemonDetail,
  PaginationInfo,
  PokemonStat,
} from "@/types/pokemon";

const BASE_URL = "https://pokeapi.co/api/v2";
const ITEMS_PER_PAGE = 20;

// ステータス名の日本語マッピング
const STAT_NAME_MAP: Record<string, string> = {
  hp: "HP",
  attack: "こうげき",
  defense: "ぼうぎょ",
  "special-attack": "とくこう",
  "special-defense": "とくぼう",
  speed: "すばやさ",
};

/**
 * カスタムエラークラス
 */
export class PokemonApiError extends Error {
  code?: string;
  statusCode?: number;

  constructor(message: string, statusCode?: number, code?: string) {
    super(message);
    this.name = "PokemonApiError";
    this.statusCode = statusCode;
    this.code = code;
  }
}

/**
 * ポケモンのIDをURLから抽出
 */
function extractIdFromUrl(url: string): number {
  const matches = url.match(/\/pokemon\/(\d+)\//);
  return matches ? parseInt(matches[1], 10) : 0;
}

/**
 * ポケモンの日本語名を取得
 */
async function fetchJapaneseName(id: number): Promise<string> {
  try {
    const response = await fetch(`${BASE_URL}/pokemon-species/${id}`);
    if (!response.ok) {
      return "";
    }
    const data: PokemonSpeciesResponse = await response.json();
    const jaName = data.names.find((n) => n.language.name === "ja");
    return jaName?.name || "";
  } catch {
    return "";
  }
}

/**
 * ポケモン詳細を取得してSimplifiedPokemonに変換
 */
async function fetchPokemonDetail(
  nameOrId: string | number
): Promise<SimplifiedPokemon> {
  const response = await fetch(`${BASE_URL}/pokemon/${nameOrId}`);

  if (!response.ok) {
    throw new PokemonApiError(
      `ポケモンの取得に失敗しました (ステータス: ${response.status})`,
      response.status,
      "FETCH_FAILED"
    );
  }

  const data: PokemonResponse = await response.json();
  const japaneseName = await fetchJapaneseName(data.id);

  return {
    id: data.id,
    name: data.name,
    japaneseName: japaneseName || data.name,
    types: data.types.map((t) => t.type.name),
    imageUrl:
      data.sprites.other["official-artwork"].front_default ||
      data.sprites.front_default,
  };
}

/**
 * ポケモン一覧を取得
 */
export async function getPokemonList(
  page: number = 1
): Promise<{ pokemons: SimplifiedPokemon[]; pagination: PaginationInfo }> {
  const offset = (page - 1) * ITEMS_PER_PAGE;

  try {
    const response = await fetch(
      `${BASE_URL}/pokemon?limit=${ITEMS_PER_PAGE}&offset=${offset}`
    );

    if (!response.ok) {
      throw new PokemonApiError(
        `一覧の取得に失敗しました (ステータス: ${response.status})`,
        response.status,
        "FETCH_LIST_FAILED"
      );
    }

    const data: PokemonListResponse = await response.json();

    // 各ポケモンの詳細を並列で取得
    const pokemonPromises = data.results.map((pokemon) => {
      const id = extractIdFromUrl(pokemon.url);
      return fetchPokemonDetail(id);
    });

    const pokemons = await Promise.all(pokemonPromises);

    const totalPages = Math.ceil(data.count / ITEMS_PER_PAGE);

    return {
      pokemons,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount: data.count,
        hasNext: data.next !== null,
        hasPrevious: data.previous !== null,
      },
    };
  } catch (error) {
    if (error instanceof PokemonApiError) {
      throw error;
    }

    if (error instanceof Error) {
      throw new PokemonApiError(
        `ネットワークエラー: ${error.message}`,
        500,
        "NETWORK_ERROR"
      );
    }

    throw new PokemonApiError(
      "不明なエラーが発生しました",
      500,
      "UNKNOWN_ERROR"
    );
  }
}

/**
 * ポケモン詳細を取得（詳細ページ用）
 */
export async function getPokemonById(id: number): Promise<PokemonDetail> {
  try {
    const response = await fetch(`${BASE_URL}/pokemon/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new PokemonApiError(
          `ポケモンが見つかりませんでした (ID: ${id})`,
          404,
          "NOT_FOUND"
        );
      }
      throw new PokemonApiError(
        `ポケモンの取得に失敗しました (ステータス: ${response.status})`,
        response.status,
        "FETCH_FAILED"
      );
    }

    const data: PokemonResponse = await response.json();
    const japaneseName = await fetchJapaneseName(data.id);

    const stats: PokemonStat[] = data.stats.map((s) => ({
      name: s.stat.name,
      japaneseName: STAT_NAME_MAP[s.stat.name] || s.stat.name,
      value: s.base_stat,
    }));

    return {
      id: data.id,
      name: data.name,
      japaneseName: japaneseName || data.name,
      types: data.types.map((t) => t.type.name),
      imageUrl:
        data.sprites.other["official-artwork"].front_default ||
        data.sprites.front_default,
      height: data.height / 10, // デシメートル → メートル
      weight: data.weight / 10, // ヘクトグラム → キログラム
      stats,
    };
  } catch (error) {
    if (error instanceof PokemonApiError) {
      throw error;
    }

    if (error instanceof Error) {
      throw new PokemonApiError(
        `ネットワークエラー: ${error.message}`,
        500,
        "NETWORK_ERROR"
      );
    }

    throw new PokemonApiError(
      "不明なエラーが発生しました",
      500,
      "UNKNOWN_ERROR"
    );
  }
}
