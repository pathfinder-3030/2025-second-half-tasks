import { PokemonStat } from "@/types/pokemon";

type Props = {
  stat: PokemonStat;
};

const MAX_STAT = 255;

export function StatBar({ stat }: Props) {
  const percentage = Math.min((stat.value / MAX_STAT) * 100, 100);

  // ステータス値に応じた色
  const getBarColor = (value: number) => {
    if (value >= 150) return "bg-green-500";
    if (value >= 100) return "bg-lime-500";
    if (value >= 70) return "bg-yellow-500";
    if (value >= 50) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="flex items-center gap-3">
      <span className="w-20 text-sm text-gray-600">
        {stat.japaneseName}
      </span>
      <span className="w-10 text-sm font-medium text-right text-gray-900">
        {stat.value}
      </span>
      <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${getBarColor(stat.value)} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
