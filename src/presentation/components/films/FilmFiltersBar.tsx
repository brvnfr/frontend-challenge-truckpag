import type {
  FilmFilters,
  FilmSort,
  SortKey,
  StarsFilter,
} from "@/core/domain/types";
import type { ReactNode } from "react";
import { Heart, NotebookPen, Search, Star, Eye } from "lucide-react";
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
  icon?: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium",
        props.pressed
          ? "border-brand-600 bg-brand-100 text-fg dark:border-brand-300 dark:bg-brand-800"
          : "border-border bg-surface-2 text-muted hover:bg-surface"
      )}
      aria-pressed={props.pressed}
    >
      {props.icon}
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
    <section className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Filmes</h2>
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
              className="inline-flex items-center justify-center rounded-[var(--radius-md)] border border-border bg-surface px-4 py-2 text-sm font-medium text-fg shadow-[var(--shadow-soft)] hover:bg-surface-2"
            >
              Atualizar
            </button>
          ) : null}

          <button
            type="button"
            onClick={props.onClearFilters}
            className="inline-flex items-center justify-center rounded-[var(--radius-md)] border border-border bg-surface px-4 py-2 text-sm font-medium text-fg shadow-[var(--shadow-soft)] hover:bg-surface-2"
          >
            Limpar filtros
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="sr-only" htmlFor="film-search">
          Buscar filmes
        </label>
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            id="film-search"
            value={filters.query}
            onChange={(e) => props.onQueryChange(e.target.value)}
            placeholder="Buscar filmes..."
            className={cn(
              "h-11 w-full rounded-[var(--radius-md)] border border-border bg-surface pl-10 pr-3 text-sm outline-none",
              "shadow-[var(--shadow-soft)]",
              "focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:focus:ring-brand-800"
            )}
          />
        </div>

        <label className="inline-flex items-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            checked={filters.includeSynopsis}
            onChange={props.onToggleIncludeSynopsis}
            className="h-4 w-4 accent-[color:var(--color-primary)]"
          />
          Incluir sinopse na busca
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted">Filtros:</span>

          <ToggleChip
            pressed={filters.watchedOnly}
            onClick={props.onToggleWatchedOnly}
            label="Assistido"
            icon={<Eye size={14} />}
          />

          <ToggleChip
            pressed={filters.favoriteOnly}
            onClick={props.onToggleFavoriteOnly}
            label="Favoritos"
            icon={<Heart size={14} />}
          />

          <ToggleChip
            pressed={filters.notedOnly}
            onClick={props.onToggleNotedOnly}
            label="Com anotação"
            icon={<NotebookPen size={14} />}
          />

          <label className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted shadow-[var(--shadow-soft)]">
            <Star size={14} />
            <span>Estrelas</span>
            <select
              value={filters.stars ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                if (!v) return props.onStarsChange(null);
                if (v === "unrated") return props.onStarsChange("unrated");
                props.onStarsChange(Number(v) as 1 | 2 | 3 | 4 | 5);
              }}
              className="h-6 rounded border border-border bg-surface px-2 text-xs text-fg outline-none"
              aria-label="Filtrar por estrelas"
            >
              <option value="">Todas</option>
              <option value="unrated">Sem avaliação</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={sort.key}
            onChange={(e) => props.onSortKeyChange(e.target.value as SortKey)}
            className={cn(
              "h-10 rounded-[var(--radius-md)] border border-border bg-surface px-3 text-sm outline-none",
              "shadow-[var(--shadow-soft)]",
              "focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:focus:ring-brand-800"
            )}
          >
            <option value="title">Título</option>
            <option value="duration">Duração</option>
            <option value="personal_rating">Avaliação pessoal</option>
            <option value="rt_score">Avaliação Rotten Tomato</option>
          </select>

          <select
            value={sort.direction}
            onChange={(e) => props.onSortDirectionChange(e.target.value as "asc" | "desc")}
            className={cn(
              "h-10 rounded-[var(--radius-md)] border border-border bg-surface px-3 text-sm outline-none",
              "shadow-[var(--shadow-soft)]",
              "focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:focus:ring-brand-800"
            )}
            aria-label="Direção da ordenação"
          >
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </div>
      </div>
    </section>
  );
}
