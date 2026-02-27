import type { FilmRepository } from "../repositories/FilmRepository";
import { FilmEntity } from "../domain/entities/Film";

/**
 * GetFilmsUseCase
 *
 * Obtem a lista de filmes do repositório e os transforma em `FilmEntity` para consumo na UI.
 */
export class GetFilmsUseCase {
  constructor(private readonly repository: FilmRepository) {}

  async execute(): Promise<FilmEntity[]> {
    const films = await this.repository.getAll();
    return films.map((f) => new FilmEntity(f));
  }
}