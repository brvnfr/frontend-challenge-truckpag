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

  onOpenDetails: (filmId: string) => void;
  onOpenNotes: (filmId: string, presetRating?: PersonalRating) => void;
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
  onOpenDetails,
  onOpenNotes,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {films.map((film) => (
        <FilmCard
          key={film.id}
          film={film}
          meta={metaById[film.id] ?? getDefaultFilmMeta()}
          searchQuery={searchQuery}
          highlightSynopsis={highlightSynopsis}
          onToggleFavorite={onToggleFavorite}
          onToggleWatched={onToggleWatched}
          onOpenDetails={onOpenDetails}
          onOpenNotes={onOpenNotes}
        />
      ))}
    </div>
  );
}
