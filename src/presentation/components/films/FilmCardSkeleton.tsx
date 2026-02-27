/**
 * FilmCardSkeleton
 *
 * Estado de carregamento para a lista de filmes.
 */
export function FilmCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface shadow-[var(--shadow-soft)]">
      <div className="h-[320px] bg-surface-2" />

      <div className="p-5">
        <div className="h-5 w-3/4 rounded bg-surface-2" />
        <div className="mt-2 h-4 w-2/5 rounded bg-surface-2" />

        <div className="mt-4 space-y-2">
          <div className="h-4 w-full rounded bg-surface-2" />
          <div className="h-4 w-full rounded bg-surface-2" />
          <div className="h-4 w-5/6 rounded bg-surface-2" />
        </div>

        <div className="mt-4 h-4 w-2/3 rounded bg-surface-2" />
        <div className="mt-2 h-4 w-1/2 rounded bg-surface-2" />

        <div className="mt-5 space-y-2">
          <div className="h-10 w-full rounded-[var(--radius-md)] bg-surface-2" />
          <div className="h-10 w-full rounded-[var(--radius-md)] bg-surface-2" />
          <div className="h-10 w-full rounded-[var(--radius-md)] bg-surface-2" />
        </div>
      </div>
    </div>
  );
}
