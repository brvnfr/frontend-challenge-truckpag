import type { Film } from "../domain/entities/Film";

/**
 * FilmRepository
 *
 * Porta (interface) para acesso a filmes.
 */
export interface FilmRepository {
  getAll(): Promise<Film[]>;
}