import { getEnv } from "@/infrastructure/config/env";
import { AxiosHttpClient } from "@/infrastructure/http/AxiosHttpClient";
import { GhibliFilmRepository } from "@/infrastructure/repositories/GhibliFilmRepository";
import { GetFilmsUseCase } from "@/core/use-cases/GetFilmsUseCase";

/**
 * Container
 *
 * Instanciamento de dependências do app (repositórios, casos de uso, providers, etc).
 * 
 */
const env = getEnv();

const httpClient = new AxiosHttpClient(env.VITE_GHIBLI_API_BASE_URL);
const filmRepository = new GhibliFilmRepository(httpClient);

export const getFilmsUseCase = new GetFilmsUseCase(filmRepository);