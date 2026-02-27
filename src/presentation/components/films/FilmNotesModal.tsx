import { X, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FilmEntity } from "@/core/domain/entities/Film";
import type { FilmMeta, PersonalRating } from "@/core/domain/types";
import { hasNote } from "@/core/domain/types";
import { cn } from "@/shared/lib/cn";
import { StarRating } from "./StarRating";

type Props = {
  open: boolean;
  film: FilmEntity | null;
  meta: FilmMeta;
  presetRating?: PersonalRating | null;
  onClose: () => void;
  onSave: (filmId: string, note: string, rating: PersonalRating) => void;
  onRemove: (filmId: string) => void;
};

/**
 * FilmNotesModal
 *
 * Modal para criar/editar/remover notas + avaliação pessoal.
 * - abre via botão "Adicionar/Editar anotação"
 * - abre via clique nas estrelas do card (com presetRating)
 */
export function FilmNotesModal({
  open,
  film,
  meta,
  presetRating,
  onClose,
  onSave,
  onRemove,
}: Props) {
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const [note, setNote] = useState("");
  const [rating, setRating] = useState<PersonalRating | null>(null);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // Evita que o sheet (listener no document) feche junto.
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;
    // Capture para interceptar ESC antes do sheet.
    document.addEventListener("keydown", onKeyDown, true);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // reset do form ao abrir
    setNote(meta.note ?? "");
    setRating(presetRating ?? meta.rating ?? null);

    queueMicrotask(() => closeBtnRef.current?.focus());

    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      document.body.style.overflow = prev;
    };
  }, [meta.note, meta.rating, onKeyDown, open, presetRating]);

  const title = useMemo(() => {
    if (!film) return "Notas";
    return hasNote(meta) ? `Editar notas — ${film.title}` : `Adicionar notas — ${film.title}`;
  }, [film, meta]);

  const canSave = note.trim().length > 0 && rating != null;

  const handleSave = useCallback(() => {
    if (!film || rating == null) return;
    onSave(film.id, note.trim(), rating);
  }, [film, note, onSave, rating]);

  const handleRemove = useCallback(() => {
    if (!film) return;
    onRemove(film.id);
  }, [film, onRemove]);

  if (!open || !film) return null;

  const ratingLabel = rating != null ? `${rating}/5` : "—";

  return (
    <div className="fixed inset-0 z-[60]">
      <button
        type="button"
        aria-label="Fechar modal"
        className="absolute inset-0 bg-black/45"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "absolute left-1/2 top-1/2 w-[min(560px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2",
          "overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface shadow-[var(--shadow-popover)]"
        )}
      >
        <header className="flex items-center justify-between gap-3 border-b border-border px-6 py-4">
          <h2 className="text-base font-semibold sm:text-lg">{title}</h2>

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

        <div className="space-y-5 px-6 py-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-2">
              <p className="text-sm font-medium">Sua avaliação</p>
              <div className="flex items-center gap-3">
                <StarRating value={rating} onChange={(v) => setRating(v)} size={22} />
                <span className="text-sm text-muted">{ratingLabel}</span>
              </div>
            </div>
          </div>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Suas anotações</span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ex: Trilha sonora incrível e narrativa emocional…"
              rows={5}
              className={cn(
                "w-full resize-none rounded-[var(--radius-md)] border border-border bg-surface px-3 py-2 text-sm outline-none",
                "focus:border-primary focus:ring-2 focus:ring-primary/25"
              )}
            />
          </label>
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-surface-2 px-6 py-4">
          <div className="flex items-center gap-2">
            {hasNote(meta) ? (
              <button
                type="button"
                onClick={handleRemove}
                className={cn(
                  "inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-border",
                  "bg-surface px-3 py-2 text-sm font-medium hover:bg-bg"
                )}
              >
                <Trash2 size={16} /> Remover nota
              </button>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className={cn(
                "inline-flex items-center justify-center rounded-[var(--radius-md)] border border-border",
                "bg-surface px-4 py-2 text-sm font-medium hover:bg-bg"
              )}
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={!canSave}
              className={cn(
                "inline-flex items-center justify-center rounded-[var(--radius-md)] px-4 py-2 text-sm font-medium",
                canSave ? "bg-primary text-primary-fg hover:opacity-90" : "cursor-not-allowed bg-border text-muted"
              )}
            >
              Salvar notas
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
