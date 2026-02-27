import type { FilmEntity } from "@/core/domain/entities/Film";
import { FilmCard } from "./FilmCard";

type Props = {
  films: FilmEntity[];
};

/**
 * FilmList
 *
 * Lista de cards de filmes.
 */
export function FilmList({ films }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {films.map((film) => (
        <FilmCard key={film.id} film={film} />
      ))}
    </div>
  );
}
