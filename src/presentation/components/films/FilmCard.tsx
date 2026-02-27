import type { FilmEntity } from "@/core/domain/entities/Film";

type Props = {
  film: FilmEntity;
};

/**
 * FilmCard
 *
 * Card de apresentação do filme (somente UI).
 * Recebe `FilmEntity` para ler dados (números/labels).
 */
export function FilmCard({ film }: Props) {
  const poster = film.raw.image || film.raw.movie_banner;

  return (
    <article className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface shadow-[var(--shadow-soft)]">
      <div className="grid grid-cols-1 gap-0 sm:grid-cols-[220px_1fr]">
        <div className="bg-surface-2">
          <img
            src={poster}
            alt={`Poster do filme ${film.title}`}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="p-5 sm:p-6">
          <header className="flex flex-col gap-2">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h3 className="text-lg font-semibold leading-snug">
                {film.title}
                {film.releaseYear != null ? (
                  <span className="text-muted"> ({film.releaseYear})</span>
                ) : null}
              </h3>

              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-border bg-surface-2 px-2.5 py-1 text-xs text-muted">
                  {film.runningTimeLabel}
                </span>
                <span className="rounded-full border border-border bg-surface-2 px-2.5 py-1 text-xs text-muted">
                  RT: {film.rtScore ?? "—"}
                </span>
              </div>
            </div>

            <p className="text-sm text-muted">
              Dir. <span className="text-fg">{film.director}</span> · Prod.{" "}
              <span className="text-fg">{film.producer}</span>
            </p>
          </header>

          <div className="mt-4">
            <p className="line-clamp-4 text-sm leading-relaxed text-fg">
              {film.description}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
