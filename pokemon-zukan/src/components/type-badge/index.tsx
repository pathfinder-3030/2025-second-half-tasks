// ポケモンタイプの色マッピング
const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  normal: { bg: "bg-gray-400", text: "text-white" },
  fire: { bg: "bg-red-500", text: "text-white" },
  water: { bg: "bg-blue-500", text: "text-white" },
  electric: { bg: "bg-yellow-400", text: "text-black" },
  grass: { bg: "bg-green-500", text: "text-white" },
  ice: { bg: "bg-cyan-300", text: "text-black" },
  fighting: { bg: "bg-red-700", text: "text-white" },
  poison: { bg: "bg-purple-500", text: "text-white" },
  ground: { bg: "bg-amber-600", text: "text-white" },
  flying: { bg: "bg-indigo-300", text: "text-black" },
  psychic: { bg: "bg-pink-500", text: "text-white" },
  bug: { bg: "bg-lime-500", text: "text-white" },
  rock: { bg: "bg-stone-500", text: "text-white" },
  ghost: { bg: "bg-purple-700", text: "text-white" },
  dragon: { bg: "bg-violet-600", text: "text-white" },
  dark: { bg: "bg-gray-700", text: "text-white" },
  steel: { bg: "bg-slate-400", text: "text-black" },
  fairy: { bg: "bg-pink-300", text: "text-black" },
};

// タイプ名の日本語マッピング
const TYPE_NAMES: Record<string, string> = {
  normal: "ノーマル",
  fire: "ほのお",
  water: "みず",
  electric: "でんき",
  grass: "くさ",
  ice: "こおり",
  fighting: "かくとう",
  poison: "どく",
  ground: "じめん",
  flying: "ひこう",
  psychic: "エスパー",
  bug: "むし",
  rock: "いわ",
  ghost: "ゴースト",
  dragon: "ドラゴン",
  dark: "あく",
  steel: "はがね",
  fairy: "フェアリー",
};

type Props = {
  type: string;
  size?: "sm" | "md";
};

export function TypeBadge({ type, size = "sm" }: Props) {
  const colors = TYPE_COLORS[type] || { bg: "bg-gray-400", text: "text-white" };
  const japaneseName = TYPE_NAMES[type] || type;

  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";

  return (
    <span
      className={`${colors.bg} ${colors.text} ${sizeClasses} rounded-full font-medium`}
    >
      {japaneseName}
    </span>
  );
}
