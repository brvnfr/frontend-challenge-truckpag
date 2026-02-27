import type {
  FilmRepository,
  FilmRepositoryGetAllOptions,
} from "../repositories/FilmRepository";
import { FilmEntity } from "../domain/entities/Film";

export type GetFilmsUseCaseOptions = FilmRepositoryGetAllOptions;

/**
 * GetFilmsUseCase
 *
 * Obtem a lista de filmes do repositório e os transforma em `FilmEntity` para consumo na UI.
 */
export class GetFilmsUseCase {
  constructor(private readonly repository: FilmRepository) {}

  async execute(options?: GetFilmsUseCaseOptions): Promise<FilmEntity[]> {
    const films = await this.repository.getAll(options);
    return films.map((f) => new FilmEntity(f));
  }
}
