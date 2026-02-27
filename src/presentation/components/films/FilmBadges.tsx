import { NotebookPen, Sparkles, Star } from "lucide-react";

import type { FilmMeta } from "@/core/domain/types";
import { hasNote } from "@/core/domain/types";
import { cn } from "@/shared/lib/cn";

type Props = {
  meta: FilmMeta;
};

/**
 * FilmBadges
 *
 * Badges exibidas sobre a imagem (card/sheet), alinhadas verticalmente.
 * Mantém a responsabilidade visual em um único componente.
 */
export function FilmBadges({ meta }: Props) {
  const isTopRated = meta.rating === 5;

  const base =
    "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold shadow-[var(--shadow-soft)] backdrop-blur-sm ring-1 ring-black/10 dark:ring-white/10";

  return (
    <div className="flex flex-col items-end gap-2">
      {hasNote(meta) ? (
        <span className={cn(base, "bg-success text-bg")}>
          <NotebookPen size={14} /> Anotações
        </span>
      ) : null}

      {meta.rating != null ? (
        <span className={cn(base, "bg-warning text-primary-fg")}>
          <Star size={14} /> {meta.rating}/5
        </span>
      ) : null}

      {isTopRated ? (
        <span className={cn(base, "bg-brand-600 text-primary-fg")}>
          <Sparkles size={14} /> Top Rated
        </span>
      ) : null}
    </div>
  );
}
