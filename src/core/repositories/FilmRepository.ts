import type { Film } from "../domain/entities/Film";

export type FilmRepositoryGetAllOptions = {
  signal?: AbortSignal;
};

/**
 * FilmRepository
 *
 * Porta (interface) para acesso a filmes.
 */
export interface FilmRepository {
  getAll(options?: FilmRepositoryGetAllOptions): Promise<Film[]>;
}