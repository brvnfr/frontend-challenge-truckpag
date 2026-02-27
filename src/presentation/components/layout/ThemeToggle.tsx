import { Moon, Sun } from "lucide-react";
import { useCallback } from "react";
import { useThemeStore } from "@/app/theme/theme.store";
import { cn } from "@/shared/lib/cn";

type Props = {
  className?: string;
};

/**
 * ThemeToggle
 *
 * Alterna tema light/dark.
 */
export function ThemeToggle({ className }: Props) {
  const mode = useThemeStore((s) => s.mode);
  const toggle = useThemeStore((s) => s.toggle);

  const onToggle = useCallback(() => toggle(), [toggle]);

  const Icon = mode === "dark" ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border bg-surface px-2 py-2 text-sm",
        "shadow-[var(--shadow-soft)] hover:bg-surface-2",
        className
      )}
      aria-label="Alternar tema"
    >
      <Icon size={16} />
    </button>
  );
}