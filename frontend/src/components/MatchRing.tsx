const SIZE = 160;
const STROKE = 12;
const R = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * R;
const CX = SIZE / 2;
const CY = SIZE / 2;

function scoreColor(score: number) {
  if (score >= 70) return { stroke: "#059669", text: "#065f46", label: "Strong Match", labelBg: "#d1fae5", labelText: "#065f46" };
  if (score >= 40) return { stroke: "#d97706", text: "#92400e", label: "Partial Match", labelBg: "#fef3c7", labelText: "#92400e" };
  if (score > 0)   return { stroke: "#e11d48", text: "#9f1239", label: "Weak Match",   labelBg: "#ffe4e6", labelText: "#9f1239" };
  return             { stroke: "#e2e8f0", text: "#94a3b8", label: "No Analysis",  labelBg: "#f1f5f9", labelText: "#64748b" };
}

type Props = {
  score: number;
  matching: number;
  missing: number;
};

export function MatchRing({ score, matching, missing }: Props) {
  const safeScore = Number.isFinite(score) ? Math.max(0, Math.min(100, score)) : 0;
  const dashOffset = CIRCUMFERENCE - (safeScore / 100) * CIRCUMFERENCE;
  const colors = scoreColor(safeScore);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <svg width={SIZE} height={SIZE} style={{ transform: "rotate(-90deg)" }}>
          {/* Track */}
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="#e2e8f0" strokeWidth={STROKE} />
          {/* Fill arc */}
          <circle
            cx={CX}
            cy={CY}
            r={R}
            fill="none"
            stroke={colors.stroke}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            style={{ transition: "stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1)" }}
          />
          {/* Score label — counter-rotated to read upright */}
          <text
            x={CX}
            y={CY - 8}
            textAnchor="middle"
            dominantBaseline="central"
            transform={`rotate(90, ${CX}, ${CY})`}
            fontSize="32"
            fontWeight="800"
            fill={safeScore === 0 ? "#94a3b8" : "#0f172a"}
            fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
          >
            {safeScore}%
          </text>
          <text
            x={CX}
            y={CY + 16}
            textAnchor="middle"
            dominantBaseline="central"
            transform={`rotate(90, ${CX}, ${CY})`}
            fontSize="11"
            fontWeight="500"
            fill="#94a3b8"
            fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
            letterSpacing="0.05em"
          >
            MATCH
          </text>
        </svg>
      </div>

      {/* Status badge */}
      <span
        className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
        style={{ background: colors.labelBg, color: colors.labelText }}
      >
        {colors.label}
      </span>

      {/* Legend */}
      <div className="flex gap-6 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" />
          <span><strong className="text-slate-700 font-semibold">{matching}</strong> matching</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-rose-400" />
          <span><strong className="text-slate-700 font-semibold">{missing}</strong> missing</span>
        </span>
      </div>
    </div>
  );
}
