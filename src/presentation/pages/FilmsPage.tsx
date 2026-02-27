import { useCallback, useMemo, useState } from "react";
import { useFilmsQuery, useFilmActions } from "@/presentation/hooks";
import {
  FilmCardSkeleton,
  FilmDetailsSheet,
  FilmFiltersBar,
  FilmList,
  FilmNotesModal,
} from "@/presentation/components/films";
import { useGhibliStore } from "@/app/films";
import { queryFilms } from "@/core/domain/services";
import type { PersonalRating, StarsFilter } from "@/core/domain/types";
import { getDefaultFilmMeta } from "@/core/domain/types";

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
 * - anotação + avaliação pessoal (modal)
 * - detalhes completos (sheet)
 * - persistência no localStorage
 */
export function FilmsPage() {
  const { data, isLoading, isError, error, refetch, isFetching } = useFilmsQuery();

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

  const { onToggleFavorite, onToggleWatched, onSaveNote, onRemoveNote } = useFilmActions();

  const [detailsFilmId, setDetailsFilmId] = useState<string | null>(null);
  const [notesState, setNotesState] = useState<{ filmId: string | null; presetRating: PersonalRating | null }>(
    { filmId: null, presetRating: null }
  );

  const onRefresh = useCallback(() => {
    void refetch();
  }, [refetch]);

  const filmsById = useMemo(() => {
    const map = new Map<string, NonNullable<typeof data>[number]>();
    (data ?? []).forEach((f) => map.set(f.id, f));
    return map;
  }, [data]);

  const visibleFilms = useMemo(() => {
    if (!data) return [];
    return queryFilms({ films: data, metaById, filters, sort });
  }, [data, filters, metaById, sort]);

  const total = data?.length ?? 0;
  const visible = visibleFilms.length;

  const openDetails = useCallback((filmId: string) => setDetailsFilmId(filmId), []);
  const closeDetails = useCallback(() => setDetailsFilmId(null), []);

  const openNotes = useCallback((filmId: string, presetRating?: PersonalRating) => {
    setNotesState({ filmId, presetRating: presetRating ?? null });
  }, []);
  const closeNotes = useCallback(() => setNotesState({ filmId: null, presetRating: null }), []);

  const detailsFilm = detailsFilmId ? filmsById.get(detailsFilmId) ?? null : null;
  const detailsMeta = detailsFilmId ? metaById[detailsFilmId] ?? getDefaultFilmMeta() : getDefaultFilmMeta();

  const notesFilm = notesState.filmId ? filmsById.get(notesState.filmId) ?? null : null;
  const notesMeta = notesState.filmId ? metaById[notesState.filmId] ?? getDefaultFilmMeta() : getDefaultFilmMeta();

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
      error instanceof Error ? error.message : "Erro inesperado ao carregar os filmes.";
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
    <section className="space-y-8">
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
          onOpenDetails={openDetails}
          onOpenNotes={openNotes}
        />
      )}

      <FilmDetailsSheet
        open={detailsFilmId != null}
        film={detailsFilm}
        meta={detailsMeta}
        searchQuery={filters.query}
        highlightSynopsis={filters.includeSynopsis}
        onClose={closeDetails}
        onOpenNotes={(filmId) => {
          closeDetails();
          openNotes(filmId);
        }}
      />

      <FilmNotesModal
        open={notesState.filmId != null}
        film={notesFilm}
        meta={notesMeta}
        presetRating={notesState.presetRating}
        onClose={closeNotes}
        onSave={(filmId, note, rating) => {
          onSaveNote(filmId, note, rating);
          closeNotes();
        }}
        onRemove={(filmId) => {
          onRemoveNote(filmId);
          closeNotes();
        }}
      />
    </section>
  );
}
