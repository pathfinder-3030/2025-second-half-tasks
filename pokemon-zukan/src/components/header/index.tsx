import Link from "next/link";
import { PokeballIcon } from "@/components/pokeball-icon";

export function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <Link href="/" className="inline-flex items-center gap-3">
          <PokeballIcon size={40} />
          <h1 className="text-2xl font-bold text-gray-900">ポケモン図鑑</h1>
        </Link>
      </div>
    </header>
  );
}
