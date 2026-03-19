import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPokemonById, PokemonApiError } from "@/lib/pokemon-api";
import { TypeBadge } from "@/components/type-badge";
import { StatBar } from "@/components/stat-bar";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PokemonDetailPage({ params }: Props) {
  const { id } = await params;
  const pokemonId = Number(id);

  if (isNaN(pokemonId) || pokemonId < 1) {
    notFound();
  }

  let pokemon;
  try {
    pokemon = await getPokemonById(pokemonId);
  } catch (error) {
    if (error instanceof PokemonApiError && error.statusCode === 404) {
      notFound();
    }
    throw error;
  }

  const paddedId = String(pokemon.id).padStart(3, "0");

  return (
    <main className="container mx-auto px-4 py-8 max-w-2xl">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 mb-6"
      >
        ← 一覧に戻る
      </Link>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-48 h-48 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
            <Image
              src={pokemon.imageUrl}
              alt={pokemon.japaneseName}
              fill
              sizes="192px"
              className="object-contain p-4"
              priority
            />
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-lg">#{paddedId}</p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {pokemon.japaneseName}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 capitalize">
            {pokemon.name}
          </p>
          <div className="flex gap-2 mt-3">
            {pokemon.types.map((type) => (
              <TypeBadge key={type} type={type} size="md" />
            ))}
          </div>
        </div>

        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
            基本情報
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">高さ</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {pokemon.height} m
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">重さ</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {pokemon.weight} kg
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
            ステータス
          </h2>
          <div className="space-y-3">
            {pokemon.stats.map((stat) => (
              <StatBar key={stat.name} stat={stat} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
