import Link from "next/link";
import Image from "next/image";
import { SimplifiedPokemon } from "@/types/pokemon";
import { TypeBadge } from "@/components/type-badge";

type Props = {
  pokemon: SimplifiedPokemon;
};

export function PokemonCard({ pokemon }: Props) {
  const paddedId = String(pokemon.id).padStart(3, "0");

  return (
    <Link
      href={`/pokemon/${pokemon.id}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4"
    >
      <div className="relative w-full aspect-square bg-gray-100 rounded-lg mb-3">
        <Image
          src={pokemon.imageUrl}
          alt={pokemon.japaneseName}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-contain p-2"
        />
      </div>
      <p className="text-sm text-gray-500">#{paddedId}</p>
      <h2 className="text-lg font-bold text-gray-900">
        {pokemon.japaneseName}
      </h2>
      <div className="flex gap-1 mt-2 flex-wrap">
        {pokemon.types.map((type) => (
          <TypeBadge key={type} type={type} />
        ))}
      </div>
    </Link>
  );
}
