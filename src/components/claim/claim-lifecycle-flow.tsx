"use client";

import { useEffect, useRef, useState } from "react";
import { GitBranch, Scale } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { CLAIM_STATUS, type ClaimStatus } from "@/lib/claim-status";

/*
  Visualisation du cycle de vie d'un sinistre — style "node graph" (n8n).
  Fidèle au workflow XFlow réel :
    submitted → [montant ≤ seuil ?] → auto: approved
                                    → agent: under_review → evaluation → [décision] → approved | rejected
    approved → paid → closed
  Le canvas a une taille fixe (design) mais est mis à l'échelle pour remplir la largeur
  disponible (ResizeObserver) → responsive, centré, SANS scrollbar.
  `currentStatus` met le nœud courant en surbrillance (sert aussi de tracker de progression).
*/

const CANVAS_W = 1080;
const CANVAS_H = 360;

type StatusNode = {
  status: ClaimStatus;
  x: number;
  y: number;
  w: number;
  h: number;
};

const STATUS_NODES: StatusNode[] = [
  { status: "submitted", x: 16, y: 150, w: 156, h: 56 },
  { status: "approved", x: 540, y: 150, w: 156, h: 56 },
  { status: "paid", x: 730, y: 150, w: 156, h: 56 },
  { status: "closed", x: 912, y: 150, w: 152, h: 56 },
  { status: "under_review", x: 200, y: 270, w: 160, h: 56 },
  { status: "evaluation", x: 388, y: 270, w: 150, h: 56 },
  { status: "rejected", x: 740, y: 270, w: 156, h: 56 },
];

type CondNode = {
  id: "amount" | "decision";
  x: number;
  y: number;
  w: number;
  h: number;
  icon: typeof Scale;
};

const COND_NODES: CondNode[] = [
  { id: "amount", x: 200, y: 156, w: 152, h: 44, icon: Scale },
  { id: "decision", x: 560, y: 276, w: 150, h: 44, icon: GitBranch },
];

type Edge = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  dir: "h" | "v";
  labelKey?: "auto" | "agent" | "approved" | "rejected";
  lx?: number;
  ly?: number;
  strong?: boolean;
};

const EDGES: Edge[] = [
  { x1: 172, y1: 178, x2: 200, y2: 178, dir: "h", strong: true },
  { x1: 352, y1: 178, x2: 540, y2: 178, dir: "h", labelKey: "auto", lx: 380, ly: 162, strong: true },
  { x1: 276, y1: 200, x2: 280, y2: 270, dir: "v", labelKey: "agent", lx: 296, ly: 236 },
  { x1: 360, y1: 298, x2: 388, y2: 298, dir: "h" },
  { x1: 538, y1: 298, x2: 560, y2: 298, dir: "h" },
  { x1: 635, y1: 276, x2: 618, y2: 206, dir: "v", labelKey: "approved", lx: 648, ly: 238, strong: true },
  { x1: 710, y1: 298, x2: 740, y2: 298, dir: "h", labelKey: "rejected", lx: 690, ly: 330 },
  { x1: 696, y1: 178, x2: 730, y2: 178, dir: "h", strong: true },
  { x1: 886, y1: 178, x2: 912, y2: 178, dir: "h", strong: true },
];

function edgePath({ x1, y1, x2, y2, dir }: Edge) {
  if (dir === "v") {
    const dy = (y2 - y1) / 2;
    return `M${x1} ${y1} C ${x1} ${y1 + dy}, ${x2} ${y2 - dy}, ${x2} ${y2}`;
  }
  const dx = Math.max(30, Math.abs(x2 - x1) / 2);
  return `M${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
}

export function ClaimLifecycleFlow({
  currentStatus,
  className,
}: {
  currentStatus?: ClaimStatus;
  className?: string;
}) {
  const t = useTranslations("lifecycle");
  const ts = useTranslations("claimStatus");

  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width;
      setScale(Math.min(1, w / CANVAS_W));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className={cn("w-full overflow-hidden", className)}>
      <div
        className="mx-auto"
        style={{ width: CANVAS_W * scale, height: CANVAS_H * scale }}
      >
        <div
          className="relative rounded-xl border bg-card"
          style={{
            width: CANVAS_W,
            height: CANVAS_H,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            backgroundImage:
              "radial-gradient(circle, #e2e8f0 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        >
          {/* Couche des connexions */}
          <svg
            className="pointer-events-none absolute inset-0"
            width={CANVAS_W}
            height={CANVAS_H}
          >
            <defs>
              <marker
                id="arrow"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
              </marker>
              <marker
                id="arrow-strong"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#1d9e75" />
              </marker>
            </defs>
            {EDGES.map((e, i) => (
              <path
                key={i}
                d={edgePath(e)}
                fill="none"
                stroke={e.strong ? "#1d9e75" : "#94a3b8"}
                strokeWidth={e.strong ? 2.5 : 2}
                strokeDasharray={e.strong ? undefined : "5 5"}
                markerEnd={`url(#${e.strong ? "arrow-strong" : "arrow"})`}
              />
            ))}
          </svg>

          {/* Étiquettes de connexion */}
          {EDGES.filter((e) => e.labelKey).map((e, i) => (
            <span
              key={i}
              className="absolute rounded bg-card px-1 text-[10px] font-medium text-muted-foreground"
              style={{ left: e.lx, top: e.ly }}
            >
              {t(`edge.${e.labelKey}`)}
            </span>
          ))}

          {/* Nœuds de statut */}
          {STATUS_NODES.map((n) => {
            const meta = CLAIM_STATUS[n.status];
            const Icon = meta.icon;
            const active = currentStatus === n.status;
            return (
              <div
                key={n.status}
                className={cn(
                  "absolute flex items-center gap-2.5 rounded-xl border bg-card px-3 shadow-sm transition-all",
                  active && "ring-2 ring-emerald shadow-md",
                )}
                style={{ left: n.x, top: n.y, width: n.w, height: n.h }}
              >
                <span
                  className="flex size-9 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: meta.bg, color: meta.fg }}
                >
                  <Icon className="size-4.5" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-xs font-semibold text-foreground">
                    {ts(n.status)}
                  </span>
                  <span className="block truncate text-[10px] text-muted-foreground">
                    {t(`node.${n.status}`)}
                  </span>
                </span>
              </div>
            );
          })}

          {/* Nœuds de condition (losanges / branches) */}
          {COND_NODES.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.id}
                className="absolute flex items-center gap-2 rounded-full border-2 border-dashed border-warning/60 bg-warning/5 px-3"
                style={{ left: c.x, top: c.y, width: c.w, height: c.h }}
              >
                <Icon className="size-4 shrink-0 text-warning" />
                <span className="truncate text-xs font-medium text-foreground">
                  {t(`cond.${c.id}`)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
