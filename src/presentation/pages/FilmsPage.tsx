import { useCallback, useMemo } from "react";
import { useFilmsQuery } from "@/presentation/hooks";
import { FilmCardSkeleton, FilmList } from "@/presentation/components/films";

function ErrorState(props: { message: string; onRetry: () => void }) {
  return (
    <section className="rounded-[var(--radius-lg)] border border-border bg-surface p-6 shadow-[var(--shadow-soft)]">
      <h2 className="text-lg font-semibold">Não foi possível carregar</h2>
      <p className="mt-2 text-sm text-muted">{props.message}</p>

      <button
        type="button"
        onClick={props.onRetry}
        className="mt-4 inline-flex items-center justify-center rounded-[var(--radius-md)] bg-primary px-4 py-2 text-sm font-medium text-primary-fg hover:opacity-90"
      >
        Tentar novamente
      </button>
    </section>
  );
}

function EmptyState() {
  return (
    <section className="rounded-[var(--radius-lg)] border border-border bg-surface p-6 shadow-[var(--shadow-soft)]">
      <h2 className="text-lg font-semibold">Nenhum filme encontrado</h2>
      <p className="mt-2 text-sm text-muted">
        A API não retornou itens. Tente novamente mais tarde.
      </p>
    </section>
  );
}

/**
 * FilmsPage
 *
 * Página inicial
 */
export function FilmsPage() {
  const { data, isLoading, isError, error, refetch, isFetching } =
    useFilmsQuery();

  const onRetry = useCallback(() => {
    void refetch();
  }, [refetch]);

  const subtitle = useMemo(() => {
    const total = data?.length ?? 0;
    const fetching = isFetching && !isLoading ? " (atualizando…)" : "";
    return `${total} filme(s)${fetching}`;
  }, [data?.length, isFetching, isLoading]);

  if (isLoading) {
    return (
      <section className="space-y-4">
        <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-6 shadow-[var(--shadow-soft)]">
          <h2 className="text-lg font-semibold">Filmes</h2>
          <p className="mt-2 text-sm text-muted">Carregando…</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <FilmCardSkeleton key={idx} />
          ))}
        </div>
      </section>
    );
  }

  if (isError) {
    const message =
      error instanceof Error
        ? error.message
        : "Erro inesperado ao carregar os filmes.";
    return <ErrorState message={message} onRetry={onRetry} />;
  }

  if (!data || data.length === 0) {
    return <EmptyState />;
  }

  return (
    <section className="space-y-4">
      <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-6 shadow-[var(--shadow-soft)]">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Filmes</h2>
            <p className="mt-1 text-sm text-muted">{subtitle}</p>
          </div>

          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center justify-center rounded-[var(--radius-md)] border border-border bg-surface-2 px-4 py-2 text-sm font-medium text-fg hover:bg-surface"
            aria-label="Atualizar lista de filmes"
          >
            Atualizar
          </button>
        </div>
      </div>

      <FilmList films={data} />
    </section>
  );
}
