import { useQuery } from "@tanstack/react-query";
import { FilmEntity } from "@/core/domain/entities/Film";
import type { Film } from "@/core/domain/entities/Film";
import { getFilmsUseCase } from "@/app/di";
import { useGhibliStore } from "@/app/films";

export const FILMS_QUERY_KEY = ["films"] as const;

function toEntities(items: Film[]): FilmEntity[] {
  return items.map((f) => new FilmEntity(f));
}

/**
 * useFilmsQuery
 *
 * Hook de estado assíncrono (TanStack Query) para carregar os filmes do Studio Ghibli.
 *
 * @remarks
 * - Centraliza cache, retry e estados (loading/error/success).
 * - Encaminha o AbortSignal para permitir cancelamento (navegação/refresh).
 * - Persiste um snapshot da lista no localStorage (via store) para abrir o app com dados.
 */
export function useFilmsQuery() {
  const catalog = useGhibliStore((s) => s.catalog);
  const setCatalog = useGhibliStore((s) => s.setCatalog);

  return useQuery<FilmEntity[]>({
    queryKey: FILMS_QUERY_KEY,
    queryFn: async ({ signal }) => {
      const res = await getFilmsUseCase.execute({ signal });
      // Persistimos o snapshot do catálogo para inicialização rápida.
      setCatalog(res.map((f) => f.raw));
      return res;
    },
    staleTime: 5 * 60 * 1000, // 5 min
    initialData: catalog.items.length ? toEntities(catalog.items) : undefined,
    initialDataUpdatedAt: catalog.updatedAt ?? 0,
  });
}
