import { Lottie } from "@/components/lottie/lottie";
import { cn } from "@/lib/utils";

/**
 * État vide réutilisable — invitation à agir (jamais juste « aucun résultat »).
 * Affiche une animation Lottie si fournie (fallback gracieux sinon).
 */
export function EmptyState({
  title,
  body,
  animation,
  fallback,
  action,
  className,
}: {
  title: string;
  body: string;
  animation?: string;
  fallback?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-6 py-16 text-center",
        className,
      )}
    >
      {animation ? (
        <Lottie
          src={animation}
          className="mb-2 size-44"
          aria-label={title}
          fallback={fallback}
        />
      ) : (
        fallback
      )}
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{body}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
