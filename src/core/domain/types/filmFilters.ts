import type { PersonalRating } from "./filmMeta";

export type StarsFilter = PersonalRating | "unrated" | null;

export type FilmFilters = {
  query: string;
  includeSynopsis: boolean;

  watchedOnly: boolean;
  favoriteOnly: boolean;
  notedOnly: boolean;

  stars: StarsFilter;
};

export function getDefaultFilmFilters(): FilmFilters {
  return {
    query: "",
    includeSynopsis: false,
    watchedOnly: false,
    favoriteOnly: false,
    notedOnly: false,
    stars: null,
  };
}
