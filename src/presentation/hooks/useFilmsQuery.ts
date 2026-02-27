import { useQuery } from "@tanstack/react-query";
import type { FilmEntity } from "@/core/domain/entities/Film";
import { getFilmsUseCase } from "@/app/di";

export const FILMS_QUERY_KEY = ["films"] as const;

/**
 * useFilmsQuery
 *
 * Hook de estado assíncrono (TanStack Query) para carregar os filmes do Studio Ghibli.
 *
 * @remarks
 * - Centraliza cache, retry e estados (loading/error/success).
 * - Encaminha o AbortSignal para permitir cancelamento (navegação/refresh).
 */
export function useFilmsQuery() {
  return useQuery<FilmEntity[]>({
    queryKey: FILMS_QUERY_KEY,
    queryFn: ({ signal }) => getFilmsUseCase.execute({ signal }),
    staleTime: 5 * 60 * 1000, // 5 min
  });
}
