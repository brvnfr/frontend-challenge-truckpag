import type { ReactNode } from "react";

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

type Options = {
  query: string;
  highlightClassName?: string;
};

/**
 * highlightText
 *
 * Retorna o texto com trechos destacados (sem usar dangerouslySetInnerHTML).
 */
export function highlightText(text: string, options: Options): ReactNode {
  const query = options.query.trim();
  if (!query) return text;

  const terms = query
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean)
    .map(escapeRegExp);

  if (terms.length === 0) return text;

  const regex = new RegExp(`(${terms.join("|")})`, "gi");
  const parts = text.split(regex);

  const cls = options.highlightClassName ?? "rounded bg-brand-200 px-1 dark:bg-brand-700";

  return parts.map((part, idx) => {
    if (regex.test(part)) {
      // reset do regex state
      regex.lastIndex = 0;
      return (
        <mark key={idx} className={cls}>
          {part}
        </mark>
      );
    }

    return <span key={idx}>{part}</span>;
  });
}
