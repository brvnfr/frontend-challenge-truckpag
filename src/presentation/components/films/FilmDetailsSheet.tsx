import { X, Star, NotebookPen, Apple } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import type { FilmEntity } from "@/core/domain/entities/Film";
import type { FilmMeta } from "@/core/domain/types";
import { hasNote } from "@/core/domain/types";
import { cn } from "@/shared/lib/cn";
import { highlightText } from "@/shared/lib/highlight";
import { FilmBadges } from "./FilmBadges";

type Props = {
  open: boolean;
  film: FilmEntity | null;
  meta: FilmMeta;
  searchQuery: string;
  highlightSynopsis: boolean;
  onClose: () => void;
  onOpenNotes: (filmId: string) => void;
};

/**
 * FilmDetailsSheet
 *
 * Sheet lateral com detalhes completos do filme.
 */
export function FilmDetailsSheet({
  open,
  film,
  meta,
  searchQuery,
  highlightSynopsis,
  onClose,
  onOpenNotes,
}: Props) {
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", onKeyDown);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // foco no botão fechar
    queueMicrotask(() => closeBtnRef.current?.focus());

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prev;
    };
  }, [onKeyDown, open]);

  const synopsis = useMemo(() => {
    if (!film) return null;
    if (!highlightSynopsis) return film.description;
    const q = searchQuery.trim();
    if (!q) return film.description;
    return highlightText(film.description, { query: q });
  }, [film, highlightSynopsis, searchQuery]);

  if (!open || !film) return null;

  const hero = film.raw.movie_banner || film.raw.image;
  const poster = film.raw.image || film.raw.movie_banner;

  const rtLabel = film.rtScore != null ? `${film.rtScore}%` : "—";
  const personalLabel = meta.rating != null ? `${meta.rating}/5` : "Sem avaliação";
  const year = film.releaseYear != null ? String(film.releaseYear) : "—";

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Fechar detalhes"
        className="absolute inset-0 bg-black/45"
        onClick={onClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`Detalhes do filme ${film.title}`}
        className={cn(
          "absolute right-0 top-0 h-full w-full max-w-[560px] overflow-hidden",
          "border-l border-border bg-surface shadow-[var(--shadow-popover)]"
        )}
      >
        <header className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div className="min-w-0">
            <p className="text-xs font-medium text-muted">Detalhes</p>
            <h2 className="truncate text-base font-semibold sm:text-lg">{film.title}</h2>
          </div>

          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            className={cn(
              "inline-flex items-center justify-center rounded-[var(--radius-md)] border border-border",
              "bg-surface p-2 hover:bg-bg"
            )}
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </header>

        <div className="h-full overflow-y-auto">
          <div className="relative">
            <img src={hero} alt="Banner do filme" className="h-[220px] w-full object-cover" />
            <div className="absolute right-3 top-3">
              <FilmBadges meta={meta} />
            </div>
          </div>

          <div className="space-y-5 p-5">
            <div className="flex items-start gap-4">
              <img
                src={poster}
                alt={`Poster do filme ${film.title}`}
                className="hidden h-[132px] w-[92px] flex-none rounded-[var(--radius-md)] object-cover sm:block"
                loading="lazy"
              />

              <div className="min-w-0 flex-1 space-y-2">
                <h3 className="text-lg font-semibold leading-snug">{film.title}</h3>

                <p className="text-sm text-muted">
                  {year} • {film.runningTimeHhMmLabel}
                </p>

                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="inline-flex items-center gap-1 text-muted">
                    <Apple size={16} /> RT: <span className="text-fg">{rtLabel}</span>
                  </span>
                  <span className="text-muted">·</span>
                  <span className="inline-flex items-center gap-1text-muted">
                    <Star size={16} /> Sua nota: <span className="text-fg ms-2">{personalLabel}</span>
                  </span>
                </div>

                <div className="text-xs text-muted">
                  <p>
                    Diretor: <span className="text-fg">{film.director}</span>
                  </p>
                  <p>
                    Produtor: <span className="text-fg">{film.producer}</span>
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => onOpenNotes(film.id)}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-border",
                      "bg-surface px-3 py-2 text-sm font-medium hover:bg-bg"
                    )}
                  >
                    <NotebookPen size={16} /> {hasNote(meta) ? "Editar notas" : "Adicionar notas"}
                  </button>
                </div>
              </div>
            </div>

            <section className="space-y-2">
              <h4 className="text-sm font-semibold">Sinopse</h4>
              <p className="text-sm leading-relaxed text-fg">{synopsis}</p>
            </section>

            {hasNote(meta) ? (
              <section className="space-y-2 rounded-[var(--radius-md)] border border-border bg-surface-2 p-4">
                <h4 className="text-sm font-semibold">Suas anotações</h4>
                <p className="text-sm text-fg whitespace-pre-wrap">{meta.note}</p>
              </section>
            ) : null}

            <div className="h-10" />
          </div>
        </div>
      </aside>
    </div>
  );
}
