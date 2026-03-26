import { getPokemonList } from "@/lib/pokemon-api";
import { PokemonCard } from "@/components/pokemon-card";
import { Pagination } from "@/components/pagination";

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function HomePage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  const { pokemons, pagination } = await getPokemonList(page);

  return (
    <main className='container mx-auto px-4 py-8'>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
        {pokemons.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>
      <Pagination pagination={pagination} />
    </main>
  );
}
