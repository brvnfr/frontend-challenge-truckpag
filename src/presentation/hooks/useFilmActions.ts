import { useCallback } from "react";
import toast from "react-hot-toast";
import { useGhibliStore } from "@/app/films";
import type { PersonalRating } from "@/core/domain/types";

/**
 * useFilmActions
 *
 * Encapsula ações do usuário (favoritar/assistir/anotar) com feedback (toasts).
 */
export function useFilmActions() {
  const toggleFavorite = useGhibliStore((s) => s.toggleFavorite);
  const toggleWatched = useGhibliStore((s) => s.toggleWatched);
  const saveNote = useGhibliStore((s) => s.saveNote);
  const removeNote = useGhibliStore((s) => s.removeNote);

  const onToggleFavorite = useCallback(
    (filmId: string) => {
      const next = toggleFavorite(filmId);
      toast.success(next ? "Adicionado aos favoritos" : "Removido dos favoritos");
    },
    [toggleFavorite]
  );

  const onToggleWatched = useCallback(
    (filmId: string) => {
      const next = toggleWatched(filmId);
      toast.success(next ? "Marcado como assistido" : "Desmarcado como assistido");
    },
    [toggleWatched]
  );

  const onSaveNote = useCallback(
    (filmId: string, note: string, rating: PersonalRating) => {
      saveNote(filmId, note, rating);
      toast.success("Anotação salva");
    },
    [saveNote]
  );

  const onRemoveNote = useCallback(
    (filmId: string) => {
      removeNote(filmId);
      toast.success("Anotação removida");
    },
    [removeNote]
  );

  return { onToggleFavorite, onToggleWatched, onSaveNote, onRemoveNote };
}
