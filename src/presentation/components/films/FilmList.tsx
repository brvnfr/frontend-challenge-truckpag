import type { FilmEntity } from "@/core/domain/entities/Film";
import type { FilmMetaById, PersonalRating } from "@/core/domain/types";
import { getDefaultFilmMeta } from "@/core/domain/types";
import { FilmCard } from "./FilmCard";

type Props = {
  films: FilmEntity[];
  metaById: FilmMetaById;

  searchQuery: string;
  highlightSynopsis: boolean;

  onToggleFavorite: (filmId: string) => void;
  onToggleWatched: (filmId: string) => void;
  onSaveNote: (filmId: string, note: string, rating: PersonalRating) => void;
  onRemoveNote: (filmId: string) => void;
};

/**
 * FilmList
 *
 * Lista de cards de filmes.
 */
export function FilmList({
  films,
  metaById,
  searchQuery,
  highlightSynopsis,
  onToggleFavorite,
  onToggleWatched,
  onSaveNote,
  onRemoveNote,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {films.map((film) => (
        <FilmCard
          key={film.id}
          film={film}
          meta={metaById[film.id] ?? getDefaultFilmMeta()}
          searchQuery={searchQuery}
          highlightSynopsis={highlightSynopsis}
          onToggleFavorite={onToggleFavorite}
          onToggleWatched={onToggleWatched}
          onSaveNote={onSaveNote}
          onRemoveNote={onRemoveNote}
        />
      ))}
    </div>
  );
}
