import type { ReactNode } from "react";
import { APP_NAME, APP_REPOSITORY } from "@/app/constants/app";
import { ThemeToggle } from "@/presentation/components/layout/ThemeToggle";

type Props = {
  children: ReactNode;
};

/**
 * AppShell
 *
 * Layout base do app (header + container). 
 */
export function AppShell({ children }: Props) {
  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="mx-auto flex max-w-6xl items-start justify-between gap-4 px-4 py-6">
        <div>
          <h1 className="text-2xl font-semibold">{APP_NAME}</h1>
          <p className="text-sm text-muted">{APP_REPOSITORY}</p>
        </div>

        <ThemeToggle />
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-10">{children}</main>
    </div>
  );
}