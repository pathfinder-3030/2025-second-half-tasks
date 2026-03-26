type Props = {
  size?: number;
  className?: string;
};

export function PokeballIcon({ size = 32, className = "" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
    >
      {/* 外側の円 */}
      <circle cx="50" cy="50" r="48" fill="white" stroke="#333" strokeWidth="4" />

      {/* 上半分（赤） */}
      <path
        d="M 50 2 A 48 48 0 0 1 98 50 L 2 50 A 48 48 0 0 1 50 2"
        fill="#EF4444"
        stroke="#333"
        strokeWidth="4"
      />

      {/* 中央の線 */}
      <rect x="2" y="46" width="96" height="8" fill="#333" />

      {/* 中央の円（外側） */}
      <circle cx="50" cy="50" r="16" fill="white" stroke="#333" strokeWidth="4" />

      {/* 中央の円（内側） */}
      <circle cx="50" cy="50" r="8" fill="white" stroke="#333" strokeWidth="3" />
    </svg>
  );
}
