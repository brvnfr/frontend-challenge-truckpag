/**
 * FilmCardSkeleton
 *
 * Estado de carregamento para a lista de filmes.
 */
export function FilmCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface shadow-[var(--shadow-soft)]">
      <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr]">
        <div className="h-[200px] bg-surface-2 sm:h-full" />
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="h-5 w-2/3 rounded bg-surface-2" />
            <div className="flex gap-2">
              <div className="h-6 w-16 rounded-full bg-surface-2" />
              <div className="h-6 w-16 rounded-full bg-surface-2" />
            </div>
          </div>

          <div className="mt-3 h-4 w-1/2 rounded bg-surface-2" />

          <div className="mt-4 space-y-2">
            <div className="h-4 w-full rounded bg-surface-2" />
            <div className="h-4 w-full rounded bg-surface-2" />
            <div className="h-4 w-5/6 rounded bg-surface-2" />
            <div className="h-4 w-4/6 rounded bg-surface-2" />
          </div>
        </div>
      </div>
    </div>
  );
}
