import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Film } from "@/core/domain/entities/Film";
import type { FilmFilters } from "@/core/domain/types";
import type { FilmMetaById, PersonalRating } from "@/core/domain/types";
import type { FilmSort, SortDirection, SortKey, StarsFilter } from "@/core/domain/types";
import { getDefaultFilmFilters, getDefaultFilmMeta, getDefaultFilmSort } from "@/core/domain/types";

type FilmCatalog = {
  items: Film[];
  updatedAt: number | null;
};

type GhibliState = {
  catalog: FilmCatalog;

  metaById: FilmMetaById;
  filters: FilmFilters;
  sort: FilmSort;

  // Catalog
  setCatalog: (films: Film[]) => void;

  // Meta
  toggleFavorite: (filmId: string) => boolean; // retorna novo valor
  toggleWatched: (filmId: string) => boolean;
  saveNote: (filmId: string, note: string, rating: PersonalRating) => void;
  removeNote: (filmId: string) => void;

  // Filters
  setQuery: (value: string) => void;
  toggleIncludeSynopsis: () => void;
  toggleWatchedOnly: () => void;
  toggleFavoriteOnly: () => void;
  toggleNotedOnly: () => void;
  setStarsFilter: (stars: StarsFilter) => void;
  clearFilters: () => void;

  // Sorting
  setSortKey: (key: SortKey) => void;
  setSortDirection: (direction: SortDirection) => void;
};

function upsertMeta(metaById: FilmMetaById, filmId: string, partial: Partial<ReturnType<typeof getDefaultFilmMeta>>) {
  const current = metaById[filmId] ?? getDefaultFilmMeta();
  return { ...metaById, [filmId]: { ...current, ...partial } };
}

export const useGhibliStore = create<GhibliState>()(
  persist(
    (set, get) => ({
      catalog: { items: [], updatedAt: null },

      metaById: {},
      filters: getDefaultFilmFilters(),
      sort: getDefaultFilmSort(),

      setCatalog: (films) =>
        set({
          catalog: {
            items: films,
            updatedAt: Date.now(),
          },
        }),

      toggleFavorite: (filmId) => {
        const meta = get().metaById[filmId] ?? getDefaultFilmMeta();
        const next = !meta.favorite;
        set({ metaById: upsertMeta(get().metaById, filmId, { favorite: next }) });
        return next;
      },

      toggleWatched: (filmId) => {
        const meta = get().metaById[filmId] ?? getDefaultFilmMeta();
        const next = !meta.watched;
        set({ metaById: upsertMeta(get().metaById, filmId, { watched: next }) });
        return next;
      },

      saveNote: (filmId, note, rating) => {
        set({
          metaById: upsertMeta(get().metaById, filmId, {
            note,
            rating,
          }),
        });
      },

      removeNote: (filmId) => {
        set({
          metaById: upsertMeta(get().metaById, filmId, {
            note: "",
            rating: null,
          }),
        });
      },

      setQuery: (value) => set({ filters: { ...get().filters, query: value } }),
      toggleIncludeSynopsis: () =>
        set({ filters: { ...get().filters, includeSynopsis: !get().filters.includeSynopsis } }),
      toggleWatchedOnly: () =>
        set({ filters: { ...get().filters, watchedOnly: !get().filters.watchedOnly } }),
      toggleFavoriteOnly: () =>
        set({ filters: { ...get().filters, favoriteOnly: !get().filters.favoriteOnly } }),
      toggleNotedOnly: () =>
        set({ filters: { ...get().filters, notedOnly: !get().filters.notedOnly } }),
      setStarsFilter: (stars) => set({ filters: { ...get().filters, stars } }),
      clearFilters: () => set({ filters: getDefaultFilmFilters() }),

      setSortKey: (key) => set({ sort: { ...get().sort, key } }),
      setSortDirection: (direction) => set({ sort: { ...get().sort, direction } }),
    }),
    {
      name: "truckpag_ghibli_state",
      version: 1,
      partialize: (state) => ({
        catalog: state.catalog,
        metaById: state.metaById,
        filters: state.filters,
        sort: state.sort,
      }),
    }
  )
);
