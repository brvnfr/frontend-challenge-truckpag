import { Star } from "lucide-react";
import type { PersonalRating } from "@/core/domain/types";
import { cn } from "@/shared/lib/cn";

type Props = {
  value: PersonalRating | null;
  onChange?: (value: PersonalRating) => void;
  size?: number;
  readonly?: boolean;
  className?: string;
};

/**
 * StarRating
 *
 * Componente de avaliação 1–5 estrelas.
 */
export function StarRating({
  value,
  onChange,
  size = 18,
  readonly = false,
  className,
}: Props) {
  const current = value ?? 0;

  return (
    <div className={cn("inline-flex items-center gap-1", className)}>
      {([1, 2, 3, 4, 5] as const).map((n) => {
        const active = n <= current;

        const icon = (
          <Star
            size={size}
            className={cn(
              "transition",
              active ? "fill-warning stroke-warning" : "stroke-muted",
              !readonly && "hover:stroke-warning"
            )}
          />
        );

        if (readonly || !onChange) {
          return <span key={n}>{icon}</span>;
        }

        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className="rounded p-0.5"
            aria-label={`Avaliar com ${n} estrela(s)`}
          >
            {icon}
          </button>
        );
      })}
    </div>
  );
}
