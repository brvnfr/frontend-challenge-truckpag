import type { ReactNode } from "react";
import { APP_NAME, APP_REPOSITORY, APP_TAGLINE } from "@/app/constants/app";
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
      <header className="mx-auto max-w-6xl px-4 pb-6 pt-10">
        <div className="relative">
          <div className="absolute right-0 top-0">
            <ThemeToggle />
          </div>

          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              {APP_NAME}
            </h1>
            <p className="mt-3 text-sm text-muted sm:text-base">{APP_TAGLINE}</p>
            <p className="mt-2 text-xs text-muted">{APP_REPOSITORY}</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-12">{children}</main>
    </div>
  );
}