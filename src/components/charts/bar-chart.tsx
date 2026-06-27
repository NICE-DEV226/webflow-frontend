import { cn } from "@/lib/utils";

/**
 * Bar chart minimal (CSS). Couleurs = design system.
 */
export function BarChart({
  data,
  color = "var(--primary)",
  className,
}: {
  data: number[];
  color?: string;
  className?: string;
}) {
  const max = Math.max(...data, 1);
  return (
    <div className={cn("flex h-40 items-end gap-1.5", className)}>
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-sm transition-all"
          style={{
            height: `${Math.max((v / max) * 100, 3)}%`,
            backgroundColor: color,
          }}
          title={String(v)}
        />
      ))}
    </div>
  );
}
