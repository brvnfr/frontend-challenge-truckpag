export type SortKey = "title" | "duration" | "personal_rating" | "rt_score";
export type SortDirection = "asc" | "desc";

export type FilmSort = {
  key: SortKey;
  direction: SortDirection;
};

export function getDefaultFilmSort(): FilmSort {
  return { key: "title", direction: "asc" };
}
