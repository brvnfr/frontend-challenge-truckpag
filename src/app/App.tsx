import { AppProviders } from "@/";
import { AppShell } from "@/presentation/components/layout";
import { FilmsPage } from "@/presentation/pages";

/**
 * App
 *
 * Root component.
 */
export function App() {
  return (
    <AppProviders>
      <AppShell>
        <FilmsPage />
      </AppShell>
    </AppProviders>
  );
}