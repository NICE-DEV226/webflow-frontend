import { cn } from "@/lib/utils";

export interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

/**
 * Donut chart en SVG pur (pas de dépendance). Couleurs = design system.
 */
export function DonutChart({
  segments,
  size = 200,
  thickness = 24,
  centerValue,
  centerLabel,
  className,
}: {
  segments: DonutSegment[];
  size?: number;
  thickness?: number;
  centerValue?: string;
  centerLabel?: string;
  className?: string;
}) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const r = (size - thickness) / 2;
  const c = size / 2;
  const circ = 2 * Math.PI * r;
  let acc = 0;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className={cn("shrink-0", className)} style={{ width: size, height: size }}>
      <g transform={`rotate(-90 ${c} ${c})`}>
        <circle cx={c} cy={c} r={r} fill="none" stroke="var(--border)" strokeWidth={thickness} />
        {segments.map((seg) => {
          const len = (seg.value / total) * circ;
          const el = (
            <circle
              key={seg.label}
              cx={c}
              cy={c}
              r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth={thickness}
              strokeDasharray={`${len} ${circ - len}`}
              strokeDashoffset={-acc}
            />
          );
          acc += len;
          return el;
        })}
      </g>
      {centerValue && (
        <text x={c} y={c} textAnchor="middle" className="fill-primary">
          <tspan x={c} dy="-0.1em" className="font-mono text-2xl font-bold">
            {centerValue}
          </tspan>
          {centerLabel && (
            <tspan x={c} dy="1.5em" className="fill-muted-foreground text-xs">
              {centerLabel}
            </tspan>
          )}
        </text>
      )}
    </svg>
  );
}
