import type { FilmRepository } from "@/core/repositories/FilmRepository";
import type { Film } from "@/core/domain/entities/Film";
import type { HttpClient } from "../http/HttpClient";

/**
 * GhibliFilmRepository
 *
 * Adapta o acesso HTTP à API do Studio Ghibli para a interface `FilmRepository`.
 */
export class GhibliFilmRepository implements FilmRepository {
  constructor(private readonly http: HttpClient) {}

  getAll(): Promise<Film[]> {
    return this.http.get<Film[]>("/films");
  }
}