import type {
  FilmFilters,
  FilmSort,
  SortKey,
  StarsFilter,
} from "@/core/domain/types";
import { cn } from "@/shared/lib/cn";

type Props = {
  total: number;
  visible: number;

  isRefreshing?: boolean;
  onRefresh?: () => void;

  filters: FilmFilters;
  sort: FilmSort;

  onQueryChange: (value: string) => void;
  onToggleIncludeSynopsis: () => void;

  onToggleWatchedOnly: () => void;
  onToggleFavoriteOnly: () => void;
  onToggleNotedOnly: () => void;
  onStarsChange: (value: StarsFilter) => void;
  onClearFilters: () => void;

  onSortKeyChange: (key: SortKey) => void;
  onSortDirectionChange: (direction: "asc" | "desc") => void;
};

function ToggleChip(props: {
  pressed: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
        props.pressed
          ? "border-brand-600 bg-brand-100 text-fg dark:border-brand-300 dark:bg-brand-800"
          : "border-border bg-surface-2 text-muted hover:bg-surface"
      )}
      aria-pressed={props.pressed}
    >
      {props.label}
    </button>
  );
}

/**
 * FilmFiltersBar
 *
 * Controles de busca, filtros e ordenação.
 */
export function FilmFiltersBar(props: Props) {
  const { filters, sort } = props;

  return (
    <section className="rounded-[var(--radius-lg)] border border-border bg-surface p-6 shadow-[var(--shadow-soft)]">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Filmes</h2>
            <p className="mt-1 text-sm text-muted">
              {props.visible} de {props.total}
              {props.isRefreshing ? " (atualizando…)" : ""}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {props.onRefresh ? (
              <button
                type="button"
                onClick={props.onRefresh}
                className="inline-flex items-center justify-center rounded-[var(--radius-md)] border border-border bg-surface-2 px-4 py-2 text-sm font-medium text-fg hover:bg-surface"
              >
                Atualizar
              </button>
            ) : null}

            <button
              type="button"
              onClick={props.onClearFilters}
              className="inline-flex items-center justify-center rounded-[var(--radius-md)] border border-border bg-surface-2 px-4 py-2 text-sm font-medium text-fg hover:bg-surface"
            >
              Limpar filtros
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted">Buscar por título</span>
            <input
              value={filters.query}
              onChange={(e) => props.onQueryChange(e.target.value)}
              placeholder="Ex: Spirited Away"
              className={cn(
                "h-10 rounded-[var(--radius-md)] border border-border bg-surface px-3 text-sm outline-none",
                "focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:focus:ring-brand-800"
              )}
            />
          </label>

          <div className="flex items-end justify-between gap-3">
            <label className="inline-flex items-center gap-2 text-sm text-muted">
              <input
                type="checkbox"
                checked={filters.includeSynopsis}
                onChange={props.onToggleIncludeSynopsis}
                className="h-4 w-4 accent-[color:var(--color-primary)]"
              />
              Incluir sinopse na busca
            </label>

            <div className="flex items-center gap-2">
              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium text-muted">Estrelas</span>
                <select
                  value={filters.stars ?? ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (!v) return props.onStarsChange(null);
                    if (v === "unrated") return props.onStarsChange("unrated");
                    props.onStarsChange(Number(v) as 1 | 2 | 3 | 4 | 5);
                  }}
                  className={cn(
                    "h-10 rounded-[var(--radius-md)] border border-border bg-surface px-3 text-sm outline-none",
                    "focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:focus:ring-brand-800"
                  )}
                >
                  <option value="">Todas</option>
                  <option value="unrated">Sem avaliação</option>
                  <option value="1">1 ⭐</option>
                  <option value="2">2 ⭐</option>
                  <option value="3">3 ⭐</option>
                  <option value="4">4 ⭐</option>
                  <option value="5">5 ⭐</option>
                </select>
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium text-muted">Ordenar</span>
                <div className="flex gap-2">
                  <select
                    value={sort.key}
                    onChange={(e) => props.onSortKeyChange(e.target.value as SortKey)}
                    className={cn(
                      "h-10 rounded-[var(--radius-md)] border border-border bg-surface px-3 text-sm outline-none",
                      "focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:focus:ring-brand-800"
                    )}
                  >
                    <option value="title">Título</option>
                    <option value="duration">Duração</option>
                    <option value="personal_rating">Avaliação pessoal</option>
                    <option value="rt_score">rt_score</option>
                  </select>

                  <select
                    value={sort.direction}
                    onChange={(e) =>
                      props.onSortDirectionChange(e.target.value as "asc" | "desc")
                    }
                    className={cn(
                      "h-10 rounded-[var(--radius-md)] border border-border bg-surface px-3 text-sm outline-none",
                      "focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:focus:ring-brand-800"
                    )}
                  >
                    <option value="asc">Asc</option>
                    <option value="desc">Desc</option>
                  </select>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <ToggleChip
            pressed={filters.watchedOnly}
            onClick={props.onToggleWatchedOnly}
            label="Assistido"
          />
          <ToggleChip
            pressed={filters.favoriteOnly}
            onClick={props.onToggleFavoriteOnly}
            label="Favorito"
          />
          <ToggleChip
            pressed={filters.notedOnly}
            onClick={props.onToggleNotedOnly}
            label="Com anotação"
          />
        </div>
      </div>
    </section>
  );
}
