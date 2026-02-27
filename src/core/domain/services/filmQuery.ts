import type { FilmEntity } from "../entities/Film";
import type { FilmFilters } from "../types/filmFilters";
import type { FilmMetaById } from "../types/filmMeta";
import type { FilmSort } from "../types/filmSorting";
import { getDefaultFilmMeta, hasNote } from "../types/filmMeta";

function includesText(haystack: string, needle: string): boolean {
  return haystack.toLowerCase().includes(needle.toLowerCase());
}

function getMeta(metaById: FilmMetaById, filmId: string) {
  return metaById[filmId] ?? getDefaultFilmMeta();
}

function compareNullableNumber(a: number | null, b: number | null): number {
  // sempre manda null para o final, independente da direção
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  return a - b;
}

export type QueryFilmsParams = {
  films: FilmEntity[];
  metaById: FilmMetaById;
  filters: FilmFilters;
  sort: FilmSort;
};

export function queryFilms(params: QueryFilmsParams): FilmEntity[] {
  const { films, metaById, filters, sort } = params;
  const q = filters.query.trim();

  const filtered = films.filter((film) => {
    const meta = getMeta(metaById, film.id);

    if (filters.watchedOnly && !meta.watched) return false;
    if (filters.favoriteOnly && !meta.favorite) return false;
    if (filters.notedOnly && !hasNote(meta)) return false;

    if (filters.stars === "unrated") {
      if (meta.rating != null) return false;
    } else if (typeof filters.stars === "number") {
      if (meta.rating !== filters.stars) return false;
    }

    if (!q) return true;

    const matchesTitle = includesText(film.title, q);
    if (!filters.includeSynopsis) return matchesTitle;

    const matchesSynopsis = includesText(film.description, q);
    return matchesTitle || matchesSynopsis;
  });

  const sorted = [...filtered].sort((a, b) => {
    const aMeta = getMeta(metaById, a.id);
    const bMeta = getMeta(metaById, b.id);

    let cmp = 0;

    switch (sort.key) {
      case "title":
        cmp = a.title.localeCompare(b.title);
        break;

      case "duration":
        cmp = compareNullableNumber(a.runningTimeMinutes, b.runningTimeMinutes);
        break;

      case "personal_rating":
        cmp = compareNullableNumber(aMeta.rating ?? null, bMeta.rating ?? null);
        break;

      case "rt_score":
        cmp = compareNullableNumber(a.rtScore, b.rtScore);
        break;
    }

    return sort.direction === "asc" ? cmp : -cmp;
  });

  return sorted;
}
