export type PersonalRating = 1 | 2 | 3 | 4 | 5;

export type FilmMeta = {
  watched: boolean;
  favorite: boolean;
  note: string;
  rating: PersonalRating | null;
};

export type FilmMetaById = Record<string, FilmMeta>;

export function getDefaultFilmMeta(): FilmMeta {
  return {
    watched: false,
    favorite: false,
    note: "",
    rating: null,
  };
}

export function hasNote(meta: FilmMeta): boolean {
  return meta.note.trim().length > 0;
}
