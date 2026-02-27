import { useCallback, useMemo } from "react";
import { useFilmsQuery, useFilmActions } from "@/presentation/hooks";
import {
  FilmCardSkeleton,
  FilmFiltersBar,
  FilmList,
} from "@/presentation/components/films";
import { useGhibliStore } from "@/app/films";
import { queryFilms } from "@/core/domain/services";
import type { StarsFilter } from "@/core/domain/types";

function ErrorState(props: { message: string; onRetry: () => void }) {
  return (
    <section className="rounded-[var(--radius-lg)] border border-border bg-surface p-6 shadow-[var(--shadow-soft)]">
      <h2 className="text-lg font-semibold">Não foi possível carregar</h2>
      <p className="mt-2 text-sm text-muted">{props.message}</p>

      <button
        type="button"
        onClick={props.onRetry}
        className="mt-4 inline-flex items-center justify-center rounded-[var(--radius-md)] bg-primary px-4 py-2 text-sm font-medium text-primary-fg hover:opacity-90"
      >
        Tentar novamente
      </button>
    </section>
  );
}

function EmptyState(props: { title: string; description: string }) {
  return (
    <section className="rounded-[var(--radius-lg)] border border-border bg-surface p-6 shadow-[var(--shadow-soft)]">
      <h2 className="text-lg font-semibold">{props.title}</h2>
      <p className="mt-2 text-sm text-muted">{props.description}</p>
    </section>
  );
}

/**
 * FilmsPage
 *
 * Página do desafio: lista filmes do Studio Ghibli com:
 * - filtros/ordenação
 * - favorito/assistido
 * - anotação + avaliação pessoal
 * - persistência no localStorage
 */
export function FilmsPage() {
  const { data, isLoading, isError, error, refetch, isFetching } =
    useFilmsQuery();

  const metaById = useGhibliStore((s) => s.metaById);
  const filters = useGhibliStore((s) => s.filters);
  const sort = useGhibliStore((s) => s.sort);

  const setQuery = useGhibliStore((s) => s.setQuery);
  const toggleIncludeSynopsis = useGhibliStore((s) => s.toggleIncludeSynopsis);
  const toggleWatchedOnly = useGhibliStore((s) => s.toggleWatchedOnly);
  const toggleFavoriteOnly = useGhibliStore((s) => s.toggleFavoriteOnly);
  const toggleNotedOnly = useGhibliStore((s) => s.toggleNotedOnly);
  const setStarsFilter = useGhibliStore((s) => s.setStarsFilter);
  const clearFilters = useGhibliStore((s) => s.clearFilters);

  const setSortKey = useGhibliStore((s) => s.setSortKey);
  const setSortDirection = useGhibliStore((s) => s.setSortDirection);

  const { onToggleFavorite, onToggleWatched, onSaveNote, onRemoveNote } =
    useFilmActions();

  const onRefresh = useCallback(() => {
    void refetch();
  }, [refetch]);

  const visibleFilms = useMemo(() => {
    if (!data) return [];
    return queryFilms({ films: data, metaById, filters, sort });
  }, [data, filters, metaById, sort]);

  const total = data?.length ?? 0;
  const visible = visibleFilms.length;

  if (isLoading) {
    return (
      <section className="space-y-4">
        <section className="rounded-[var(--radius-lg)] border border-border bg-surface p-6 shadow-[var(--shadow-soft)]">
          <h2 className="text-lg font-semibold">Filmes</h2>
          <p className="mt-2 text-sm text-muted">Carregando…</p>
        </section>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <FilmCardSkeleton key={idx} />
          ))}
        </div>
      </section>
    );
  }

  if (isError) {
    const message =
      error instanceof Error
        ? error.message
        : "Erro inesperado ao carregar os filmes.";
    return <ErrorState message={message} onRetry={onRefresh} />;
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        title="Nenhum filme encontrado"
        description="A API não retornou itens. Tente novamente mais tarde."
      />
    );
  }

  return (
    <section className="space-y-4">
      <FilmFiltersBar
        total={total}
        visible={visible}
        isRefreshing={isFetching}
        onRefresh={onRefresh}
        filters={filters}
        sort={sort}
        onQueryChange={setQuery}
        onToggleIncludeSynopsis={toggleIncludeSynopsis}
        onToggleWatchedOnly={toggleWatchedOnly}
        onToggleFavoriteOnly={toggleFavoriteOnly}
        onToggleNotedOnly={toggleNotedOnly}
        onStarsChange={(v: StarsFilter) => setStarsFilter(v)}
        onClearFilters={clearFilters}
        onSortKeyChange={setSortKey}
        onSortDirectionChange={setSortDirection}
      />

      {visible === 0 ? (
        <EmptyState
          title="Nenhum resultado"
          description="Ajuste os filtros ou limpe a busca para ver mais filmes."
        />
      ) : (
        <FilmList
          films={visibleFilms}
          metaById={metaById}
          searchQuery={filters.query}
          highlightSynopsis={filters.includeSynopsis}
          onToggleFavorite={onToggleFavorite}
          onToggleWatched={onToggleWatched}
          onSaveNote={onSaveNote}
          onRemoveNote={onRemoveNote}
        />
      )}
    </section>
  );
}
