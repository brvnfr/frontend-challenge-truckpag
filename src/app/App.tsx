import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-dvh bg-bg text-fg">
        <header className="mx-auto max-w-6xl px-4 py-6">
          <h1 className="text-2xl font-semibold">Studio Ghibli Films</h1>
          <p className="text-sm text-muted">
            frontend-challenge-truckpag
          </p>
        </header>

        <main className="mx-auto max-w-6xl px-4 pb-10">
          <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-6 shadow-[var(--shadow-soft)]">
            <p className="text-muted">
              Wave 1 ok. Na Wave 3 começamos a listar os filmes.
            </p>
          </div>
        </main>
      </div>

      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}