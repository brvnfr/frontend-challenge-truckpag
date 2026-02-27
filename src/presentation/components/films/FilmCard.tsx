import { CheckCircle2, Heart, Pencil, Save, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import type { FilmEntity } from "@/core/domain/entities/Film";
import type { FilmMeta, PersonalRating } from "@/core/domain/types";
import { hasNote } from "@/core/domain/types";
import { cn } from "@/shared/lib/cn";
import { highlightText } from "@/shared/lib/highlight";
import { StarRating } from "./StarRating";

type Props = {
  film: FilmEntity;
  meta: FilmMeta;

  searchQuery: string;
  highlightSynopsis: boolean;

  onToggleFavorite: (filmId: string) => void;
  onToggleWatched: (filmId: string) => void;
  onSaveNote: (filmId: string, note: string, rating: PersonalRating) => void;
  onRemoveNote: (filmId: string) => void;
};

/**
 * FilmCard
 *
 * Card de filme com ações:
 * - assistido/favorito
 * - anotação + avaliação pessoal
 * - destaque de texto (quando habilitado)
 */
export function FilmCard({
  film,
  meta,
  searchQuery,
  highlightSynopsis,
  onToggleFavorite,
  onToggleWatched,
  onSaveNote,
  onRemoveNote,
}: Props) {
  const poster = film.raw.image || film.raw.movie_banner;

  const [isEditing, setIsEditing] = useState(false);
  const [note, setNote] = useState(meta.note);
  const [rating, setRating] = useState<PersonalRating | null>(meta.rating);

  useEffect(() => {
    if (!isEditing) return;
    setNote(meta.note);
    setRating(meta.rating);
  }, [isEditing, meta.note, meta.rating]);

  const synopsis = useMemo(() => {
    if (!highlightSynopsis) return film.description;
    const q = searchQuery.trim();
    if (!q) return film.description;
    return highlightText(film.description, { query: q });
  }, [film.description, highlightSynopsis, searchQuery]);

  const personalRatingLabel = meta.rating != null ? `${meta.rating}/5` : "—";

  const onEditToggle = useCallback(() => {
    setIsEditing((v) => !v);
  }, []);

  const canSave = note.trim().length > 0 && rating != null;

  const onSave = useCallback(() => {
    if (!canSave || rating == null) {
      toast.error("Preencha a anotação e selecione de 1 a 5 estrelas.");
      return;
    }
    onSaveNote(film.id, note.trim(), rating);
    setIsEditing(false);
  }, [canSave, film.id, note, onSaveNote, rating]);

  const onRemove = useCallback(() => {
    onRemoveNote(film.id);
    setIsEditing(false);
  }, [film.id, onRemoveNote]);

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

        <div className="flex flex-col gap-4 p-5 sm:p-6">
          <header className="flex flex-col gap-2">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h3 className="text-lg font-semibold leading-snug">
                {film.title}
                {film.releaseYear != null ? (
                  <span className="text-muted"> ({film.releaseYear})</span>
                ) : null}
              </h3>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => onToggleWatched(film.id)}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium",
                    meta.watched
                      ? "border-success/40 bg-success/10 text-fg"
                      : "border-border bg-surface-2 text-muted hover:bg-surface"
                  )}
                  aria-pressed={meta.watched}
                  aria-label="Marcar como assistido"
                >
                  <CheckCircle2 size={14} />
                  Assistido
                </button>

                <button
                  type="button"
                  onClick={() => onToggleFavorite(film.id)}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium",
                    meta.favorite
                      ? "border-brand-600 bg-brand-100 text-fg dark:border-brand-300 dark:bg-brand-800"
                      : "border-border bg-surface-2 text-muted hover:bg-surface"
                  )}
                  aria-pressed={meta.favorite}
                  aria-label="Marcar como favorito"
                >
                  <Heart
                    size={14}
                    className={cn(meta.favorite && "fill-brand-500 stroke-brand-600")}
                  />
                  Favorito
                </button>
              </div>
            </div>

            <p className="text-sm text-muted">
              Dir. <span className="text-fg">{film.director}</span> · Prod.{" "}
              <span className="text-fg">{film.producer}</span>
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-border bg-surface-2 px-2.5 py-1 text-xs text-muted">
                {film.runningTimeLabel}
              </span>
              <span className="rounded-full border border-border bg-surface-2 px-2.5 py-1 text-xs text-muted">
                RT: {film.rtScore ?? "—"}
              </span>
              <span className="rounded-full border border-border bg-surface-2 px-2.5 py-1 text-xs text-muted">
                Sua nota: {personalRatingLabel}
              </span>

              <StarRating value={meta.rating} readonly size={16} className="ml-1" />
            </div>
          </header>

          <div>
            <p className="line-clamp-4 text-sm leading-relaxed text-fg">{synopsis}</p>
          </div>

          <section className="rounded-[var(--radius-md)] border border-border bg-surface-2 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium">Anotações</p>
                <p className="mt-1 text-xs text-muted">
                  Adicione uma anotação e uma avaliação pessoal (1–5 estrelas).
                </p>
              </div>

              <button
                type="button"
                onClick={onEditToggle}
                className={cn(
                  "inline-flex items-center gap-2 rounded-[var(--radius-md)] border px-3 py-2 text-sm font-medium",
                  "border-border bg-surface hover:bg-bg"
                )}
              >
                {isEditing ? <X size={16} /> : <Pencil size={16} />}
                {isEditing ? "Fechar" : hasNote(meta) ? "Editar" : "Adicionar"}
              </button>
            </div>

            {!isEditing && hasNote(meta) ? (
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <StarRating value={meta.rating} readonly />
                  <span className="text-xs text-muted">{personalRatingLabel}</span>
                </div>
                <p className="text-sm text-fg">{meta.note}</p>
              </div>
            ) : null}

            {isEditing ? (
              <div className="mt-4 space-y-3">
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-muted">Sua anotação</span>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Ex: Trilha sonora incrível e narrativa emocional…"
                    rows={3}
                    className={cn(
                      "w-full resize-none rounded-[var(--radius-md)] border border-border bg-surface px-3 py-2 text-sm outline-none",
                      "focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:focus:ring-brand-800"
                    )}
                  />
                </label>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted">Estrelas</span>
                    <StarRating
                      value={rating}
                      onChange={(v) => setRating(v)}
                      className="ml-1"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    {hasNote(meta) ? (
                      <button
                        type="button"
                        onClick={onRemove}
                        className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-border bg-surface px-3 py-2 text-sm font-medium text-fg hover:bg-bg"
                      >
                        <Trash2 size={16} />
                        Remover
                      </button>
                    ) : null}

                    <button
                      type="button"
                      onClick={onSave}
                      disabled={!canSave}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium",
                        canSave
                          ? "bg-primary text-primary-fg hover:opacity-90"
                          : "cursor-not-allowed bg-border text-muted"
                      )}
                    >
                      <Save size={16} />
                      Salvar
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </article>
  );
}
