import { CheckCircle2, Heart, NotebookPen, Star } from "lucide-react";
import { useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import type { FilmEntity } from "@/core/domain/entities/Film";
import type { FilmMeta, PersonalRating } from "@/core/domain/types";
import { hasNote } from "@/core/domain/types";
import { cn } from "@/shared/lib/cn";
import { highlightText } from "@/shared/lib/highlight";
import { StarRating } from "./StarRating";
import { FilmBadges } from "./FilmBadges";

type Props = {
  film: FilmEntity;
  meta: FilmMeta;

  searchQuery: string;
  highlightSynopsis: boolean;

  onToggleFavorite: (filmId: string) => void;
  onToggleWatched: (filmId: string) => void;

  onOpenDetails: (filmId: string) => void;
  onOpenNotes: (filmId: string, presetRating?: PersonalRating) => void;
};

/**
 * FilmCard
 *
 * Card de filme com ações:
 * - assistido/favorito
 * - abrir detalhes (sheet)
 * - abrir notas/avaliação (modal)
 */
export function FilmCard({
  film,
  meta,
  searchQuery,
  highlightSynopsis,
  onToggleFavorite,
  onToggleWatched,
  onOpenDetails,
  onOpenNotes,
}: Props) {
  const poster = film.raw.image || film.raw.movie_banner;
  const isTopRated = meta.rating === 5;

  const synopsis = useMemo(() => {
    if (!highlightSynopsis) return film.description;
    const q = searchQuery.trim();
    if (!q) return film.description;
    return highlightText(film.description, { query: q });
  }, [film.description, highlightSynopsis, searchQuery]);

  const rtLabel = film.rtScore != null ? `${film.rtScore}%` : "—";
  const personalRatingLabel = meta.rating != null ? `${meta.rating}/5` : "Sem avaliação";

  const subtitle = useMemo(() => {
    const year = film.releaseYear != null ? String(film.releaseYear) : "—";
    const duration = film.runningTimeHhMmLabel;
    return `${year} • ${duration}`;
  }, [film.releaseYear, film.runningTimeHhMmLabel]);

  const onClickDetails = useCallback(() => onOpenDetails(film.id), [film.id, onOpenDetails]);
  const onClickNotes = useCallback(() => onOpenNotes(film.id), [film.id, onOpenNotes]);
  const onClickNotesWithRating = useCallback(
    (value: PersonalRating) => onOpenNotes(film.id, value),
    [film.id, onOpenNotes]
  );

  const watchedLabel = meta.watched ? "Assistido" : "Marcar assistido";
  const favoriteLabel = meta.favorite ? "Remover favorito" : "Adicionar favorito";
  const notesLabel = hasNote(meta) ? "Editar anotação" : "Adicionar anotação";

  function ActionButton(props: {
    onClick: () => void;
    icon: ReactNode;
    label: string;
    active?: boolean;
    activeClassName?: string;
  }) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          props.onClick();
        }}
        className={cn(
          "inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] border px-3 py-2 text-sm font-medium",
          "border-border bg-surface hover:bg-surface-2",
          props.active && props.activeClassName
        )}
      >
        {props.icon}
        {props.label}
      </button>
    );
  }

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={`Abrir detalhes do filme ${film.title}`}
      onClick={onClickDetails}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClickDetails();
        }
      }}
      className={cn(
        "group overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface shadow-[var(--shadow-soft)]",
        "cursor-pointer transition-transform duration-200 will-change-transform",
        "hover:-translate-y-0.5 hover:shadow-[var(--shadow-popover)] focus:outline-none",
        "focus:ring-2 focus:ring-primary/25",
        isTopRated && "border-warning/35 bg-warning/5"
      )}
    >
      <div className="relative bg-surface-2">
        <img
          src={poster}
          alt={`Poster do filme ${film.title}`}
          loading="lazy"
          className="h-[300px] w-full object-cover"
        />

        <div className="absolute right-3 top-3">
          <FilmBadges meta={meta} />
        </div>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <header className="space-y-2">
          <h3 className="text-base font-semibold leading-snug sm:text-lg">{film.title}</h3>
          <p className="text-sm text-muted">{subtitle}</p>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 text-sm text-muted">
              <span className="inline-flex items-center gap-1">
                <Star size={16} /> {rtLabel}
              </span>
              <span className="text-muted">·</span>
              <span>{personalRatingLabel}</span>
            </div>

            <div
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              className="shrink-0"
            >
              <StarRating value={meta.rating} onChange={onClickNotesWithRating} size={16} />
            </div>
          </div>
        </header>

        <div>
          <p className={cn("text-sm leading-relaxed text-fg", "line-clamp-3")}>{synopsis}</p>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClickDetails();
            }}
            className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-muted hover:text-fg"
          >
            Ler mais
          </button>
        </div>

        <div className="text-xs text-muted">
          <p>
            Dir.: <span className="text-fg">{film.director}</span>
          </p>
          <p>
            Prod.: <span className="text-fg">{film.producer}</span>
          </p>
        </div>

        {hasNote(meta) ? (
          <div className="rounded-[var(--radius-md)] border border-border bg-surface-2 p-3">
            <p className="text-xs font-medium text-muted">Suas anotações</p>
            <p className="mt-1 text-sm text-fg line-clamp-3">{meta.note}</p>
          </div>
        ) : null}

        <div className="mt-1 space-y-2">
          <ActionButton
            onClick={() => onToggleWatched(film.id)}
            icon={<CheckCircle2 size={16} />}
            label={watchedLabel}
            active={meta.watched}
            activeClassName="border-success/40 bg-success/10"
          />

          <ActionButton
            onClick={() => onToggleFavorite(film.id)}
            icon={<Heart size={16} className={cn(meta.favorite && "fill-brand-500 stroke-brand-600")} />}
            label={favoriteLabel}
            active={meta.favorite}
            activeClassName="border-brand-600 bg-brand-100 dark:border-brand-300 dark:bg-brand-800"
          />

          <ActionButton onClick={onClickNotes} icon={<NotebookPen size={16} />} label={notesLabel} />
        </div>
      </div>
    </article>
  );
}
