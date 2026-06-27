"use client";

import { Car, Home, Stethoscope } from "lucide-react";

import { cn } from "@/lib/utils";

interface DisplayCardProps {
  className?: string;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  date?: string;
  /** Couleur d'accent (hex) — pastille d'icône + titre. */
  accent?: string;
}

function DisplayCard({
  className,
  icon,
  title = "Health",
  description = "Paid out · $1,200",
  date = "2h 14m",
  accent = "#1D9E75",
}: DisplayCardProps) {
  return (
    <div
      className={cn(
        "relative flex h-36 w-[22rem] -skew-y-[8deg] flex-col justify-between rounded-xl border bg-card/80 px-4 py-3 shadow-md backdrop-blur-sm transition-all duration-700 select-none after:absolute after:-right-1 after:top-[-5%] after:h-[110%] after:w-[20rem] after:bg-gradient-to-l after:from-background after:to-transparent after:content-[''] hover:border-emerald/40 [&>*]:flex [&>*]:items-center [&>*]:gap-2",
        className,
      )}
    >
      <div>
        <span
          className="relative inline-flex items-center justify-center rounded-lg p-1.5"
          style={{ backgroundColor: `${accent}1a`, color: accent }}
        >
          {icon}
        </span>
        <p className="text-base font-semibold" style={{ color: accent }}>
          {title}
        </p>
      </div>
      <p className="text-base font-medium whitespace-nowrap text-foreground">
        {description}
      </p>
      <p className="text-sm text-muted-foreground">{date}</p>
    </div>
  );
}

const STACK_BASE =
  "[grid-area:stack] before:absolute before:left-0 before:top-0 before:h-full before:w-full before:rounded-xl before:bg-background/60 before:content-[''] before:transition-opacity before:duration-700 grayscale-[100%] hover:before:opacity-0 hover:grayscale-0";

const claimCards: DisplayCardProps[] = [
  {
    icon: <Stethoscope className="size-4" />,
    title: "Health",
    description: "Paid out · $1,200",
    date: "2h 14m",
    accent: "#3B82F6",
    className: cn(STACK_BASE, "hover:-translate-y-10"),
  },
  {
    icon: <Car className="size-4" />,
    title: "Vehicle",
    description: "Approved · $4,500",
    date: "Today",
    accent: "#6366F1",
    className: cn(STACK_BASE, "translate-x-14 translate-y-10 hover:-translate-y-1"),
  },
  {
    icon: <Home className="size-4" />,
    title: "Property",
    description: "Under review · $9,000",
    date: "1h ago",
    accent: "#10B981",
    className: "[grid-area:stack] translate-x-28 translate-y-20 hover:translate-y-10",
  },
];

export function DisplayCards({ cards }: { cards?: DisplayCardProps[] }) {
  const displayCards = cards ?? claimCards;
  return (
    <div className="grid place-items-center opacity-100 [grid-template-areas:'stack']">
      {displayCards.map((cardProps, index) => (
        <DisplayCard key={index} {...cardProps} />
      ))}
    </div>
  );
}

export default DisplayCards;
